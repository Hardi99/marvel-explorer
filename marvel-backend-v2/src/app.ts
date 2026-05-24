import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { rateLimiter } from 'hono-rate-limiter';
import userRoutes from './routes/user.js';
import characterRoutes from './routes/characters.js';
import comicRoutes from './routes/comics.js';
import favouriteRoutes from './routes/favourites.js';

const app = new Hono();

app.use(logger());
app.use(secureHeaders());
app.use(cors({
  origin: (origin) =>
    process.env.FRONTEND_URL
      ? origin === process.env.FRONTEND_URL ? origin : null
      : /^http:\/\/localhost(:\d+)?$/.test(origin) ? origin : null,
  credentials: true,
}));
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  keyGenerator: (c) => c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown',
}));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

app.notFound((c) => c.json({ error: 'Route introuvable' }, 404));

app.route('/', userRoutes);
app.route('/', characterRoutes);
app.route('/', comicRoutes);
app.route('/', favouriteRoutes);

export default app;
