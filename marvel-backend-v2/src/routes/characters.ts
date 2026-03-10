import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { proxyFetch } from '../utils/proxy.js';
import type { AppVariables } from '../types/context.js';

const characterRoutes = new Hono<{ Variables: AppVariables }>();

characterRoutes.use(authMiddleware);

characterRoutes.get('/characters', async (c) => {
  const { name = '', skip = '0', limit = '100' } = c.req.query();
  const data = await proxyFetch(`/characters?name=${name}&skip=${skip}&limit=${limit}`);
  return c.json(data);
});

characterRoutes.get('/character/:id', async (c) => {
  const { id } = c.req.param();
  const data = await proxyFetch(`/character/${id}`);
  return c.json(data);
});

export default characterRoutes;
