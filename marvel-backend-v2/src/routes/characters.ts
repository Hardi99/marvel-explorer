import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.js';
import { proxyFetch } from '../utils/proxy.js';
import type { AppVariables } from '../types/context.js';

const characterRoutes = new Hono<{ Variables: AppVariables }>();

characterRoutes.use(authMiddleware);

const listQuerySchema = z.object({
  name: z.string().optional().default(''),
  skip: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(100).default(20),
});

characterRoutes.get('/characters', zValidator('query', listQuerySchema), async (c) => {
  const { name, skip, limit } = c.req.valid('query');
  const data = await proxyFetch(`/characters?name=${name}&skip=${skip}&limit=${limit}`);
  return c.json(data);
});

characterRoutes.get('/character/:id', async (c) => {
  const { id } = c.req.param();
  const data = await proxyFetch(`/character/${id}`);
  return c.json(data);
});

export default characterRoutes;
