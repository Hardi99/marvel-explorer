import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.js';
import { proxyFetch } from '../utils/proxy.js';
import type { AppVariables } from '../types/context.js';

const comicRoutes = new Hono<{ Variables: AppVariables }>();

comicRoutes.use(authMiddleware);

const listQuerySchema = z.object({
  name: z.string().optional().default(''),
  skip: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(100).default(20),
});

comicRoutes.get('/comics', zValidator('query', listQuerySchema), async (c) => {
  const { name, skip, limit } = c.req.valid('query');
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
