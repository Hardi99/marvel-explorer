import 'server-only';
import { headers } from 'next/headers';

// Limite anti-abus des actions sensibles (connexion, inscription, mot de passe).
// Mémoire propre à chaque instance de fonction Vercel : c'est une protection d'appoint
// contre les essais en boucle, pas une garantie absolue sur l'ensemble des instances.

const hits = new Map<string, number[]>();

/** IP du visiteur : sur Vercel, ces en-têtes sont posés par la plateforme (non falsifiables). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/** true si la clé a déjà atteint `limit` essais dans la fenêtre ; sinon enregistre l'essai. */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Nettoyage occasionnel pour que la mémoire ne grossisse pas indéfiniment.
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return false;
}
