import type { Context } from 'hono';

// IP du visiteur pour la limite anti-abus. On ne prend jamais la valeur brute de
// `x-forwarded-for` : un client peut l'écrire lui-même et changer d'identité à chaque requête.
// - Derrière la redirection /api de Vercel : `x-vercel-forwarded-for`, posé par Vercel.
// - En accès direct à Railway : `x-real-ip`, posé par le proxy de Railway.
// - Sinon : la dernière entrée de `x-forwarded-for`, ajoutée par le dernier proxy.
export function clientIp(c: Context): string {
  const vercel = c.req.header('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (vercel) return vercel;

  const realIp = c.req.header('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwarded = c.req.header('x-forwarded-for')?.split(',').at(-1)?.trim();
  return forwarded || 'unknown';
}
