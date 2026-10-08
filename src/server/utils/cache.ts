import type { Context } from 'hono';

// Réponses publiques (identiques pour tous) : le CDN de Vercel peut les garder
// `seconds` secondes, puis servir l'ancienne version pendant qu'il rafraîchit.
export function publicCache(c: Context, seconds: number) {
  c.header('Cache-Control', `public, max-age=60, s-maxage=${seconds}, stale-while-revalidate=86400`);
}
