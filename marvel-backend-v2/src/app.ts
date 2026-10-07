import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { rateLimiter } from 'hono-rate-limiter';
import userRoutes from './routes/user.js';
import homeRoutes from './routes/home.js';
import characterRoutes from './routes/characters.js';
import comicRoutes from './routes/comics.js';
import favouriteRoutes from './routes/favourites.js';
import { clientIp } from './utils/client-ip.js';

const app = new Hono();

app.use(logger());
app.use(secureHeaders());
// En production, le front appelle l'API via la redirection /api de Vercel (même origine) :
// CORS ne sert plus qu'aux appels directs, limités au front déclaré.
app.use(cors({
  origin: (origin) =>
    process.env.FRONTEND_URL
      ? origin === process.env.FRONTEND_URL ? origin : null
      : /^http:\/\/localhost(:\d+)?$/.test(origin) ? origin : null,
  credentials: true,
}));

// Limite générale : de quoi feuilleter le catalogue sans être bloqué.
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  keyGenerator: clientIp,
}));

// Limite stricte sur les routes sensibles : bloque les essais de mots de passe en boucle
// et l'envoi massif d'e-mails de réinitialisation.
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (c) => `auth:${clientIp(c)}`,
});
app.use('/user/login', authLimiter);
app.use('/user/signup', authLimiter);
app.use('/user/forgot-password', authLimiter);
app.use('/user/reset-password', authLimiter);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

app.notFound((c) => c.json({ error: 'Route introuvable' }, 404));

app.route('/', userRoutes);
app.route('/', homeRoutes);
app.route('/', characterRoutes);
app.route('/', comicRoutes);
app.route('/', favouriteRoutes);

export default app;
