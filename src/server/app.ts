import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from 'hono-rate-limiter';
import userRoutes from './routes/user';
import catalogRoutes from './routes/catalog';
import favouriteRoutes from './routes/favourites';
import { clientIp } from './utils/client-ip';

// API servie par Next.js sous /api (app/api/[[...route]]/route.ts) : même origine que le site,
// donc ni CORS ni cookie tiers.
const app = new Hono().basePath('/api');

app.use(secureHeaders());

// Limite générale : de quoi feuilleter le catalogue sans être bloqué.
// Mémoire propre à chaque instance de fonction : protection d'appoint, le CDN absorbe l'essentiel.
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
app.route('/', catalogRoutes);
app.route('/', favouriteRoutes);

export default app;
