import type { Context } from 'hono';

// IP du visiteur pour la limite anti-abus. Sur Vercel, `x-vercel-forwarded-for` et
// `x-forwarded-for` sont posés par la plateforme (une valeur envoyée par le client est écrasée).
export function clientIp(c: Context): string {
  const vercel = c.req.header('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (vercel) return vercel;
  const forwarded = c.req.header('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || 'unknown';
}
