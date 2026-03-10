import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { proxyFetch } from '../utils/proxy.js';
import type { AppVariables } from '../types/context.js';

const comicRoutes = new Hono<{ Variables: AppVariables }>();

comicRoutes.use(authMiddleware);

comicRoutes.get('/comics', async (c) => {
  const { name = '', skip = '0', limit = '100' } = c.req.query();
  // L'API externe utilise "title" pour les comics (≠ "name" pour les characters)
  const data = await proxyFetch(`/comics?title=${name}&skip=${skip}&limit=${limit}`);
  return c.json(data);
});

comicRoutes.get('/comic/:id', async (c) => {
  const { id } = c.req.param();
  const data = await proxyFetch(`/comic/${id}`);
  return c.json(data);
});

comicRoutes.get('/comics/:characterId', async (c) => {
  const { characterId } = c.req.param();
  const data = await proxyFetch(`/comics/${characterId}`) as { comics?: unknown[] };

  // L'API externe retourne { thumbnail, comics: [] } — on normalise vers { count, results }
  if (data.comics) {
    return c.json({ count: data.comics.length, results: data.comics });
  }

  return c.json({ count: 0, results: [] });
});

export default comicRoutes;
