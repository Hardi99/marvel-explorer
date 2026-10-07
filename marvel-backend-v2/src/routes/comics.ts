import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { proxyFetch, MARVEL_ID } from '../utils/proxy.js';
import { publicCache } from '../utils/cache.js';

const comicRoutes = new Hono();

const listQuerySchema = z.object({
  name: z.string().max(100).optional().default(''),
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const idParamSchema = z.object({ id: z.string().regex(MARVEL_ID) });
const characterIdParamSchema = z.object({ characterId: z.string().regex(MARVEL_ID) });

comicRoutes.get('/comics', zValidator('query', listQuerySchema), async (c) => {
  const { name, skip, limit } = c.req.valid('query');
  // L'API externe utilise "title" pour les comics (≠ "name" pour les characters)
  const data = await proxyFetch('/comics', { title: name, skip, limit });
  publicCache(c, 600);
  return c.json(data);
});

comicRoutes.get('/comic/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const data = await proxyFetch(`/comic/${id}`);
  publicCache(c, 3600);
  return c.json(data);
});

comicRoutes.get('/comics/:characterId', zValidator('param', characterIdParamSchema), async (c) => {
  const { characterId } = c.req.valid('param');
  const data = await proxyFetch(`/comics/${characterId}`) as { comics?: unknown[] };
  publicCache(c, 3600);

  // L'API externe retourne { thumbnail, comics: [] } — on normalise vers { count, results }
  if (data.comics) {
    return c.json({ count: data.comics.length, results: data.comics });
  }

  return c.json({ count: 0, results: [] });
});

export default comicRoutes;
