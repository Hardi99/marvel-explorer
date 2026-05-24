import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import type { AppVariables } from '../types/context.js';

export const authMiddleware = createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
  const token = getCookie(c, 'auth_token');
  if (!token) {
    return c.json({ error: 'Token manquant' }, 401);
  }

  try {
    const payload = await verify(token, process.env.JWT_SECRET!, 'HS256');
    c.set('userId', payload['userId'] as number);
    c.set('email', payload['email'] as string);
    await next();
  } catch {
    return c.json({ error: 'Token invalide' }, 401);
  }
});
