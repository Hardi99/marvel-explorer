import type { ActionResult } from '@/server/actions/result';
import { useAuthStore } from '@/store/auth';

// Côté navigateur : renvoie la donnée d'une Server Action ou lève une erreur lisible.
// Si le serveur répond « non connecté » (session expirée), l'état local est remis à zéro.
export async function unwrap<T>(pending: Promise<ActionResult<T>>): Promise<T> {
  const result = await pending;
  if (result.ok) return result.data;
  if (result.code === 'unauthorized' && useAuthStore.getState().isLoggedIn) useAuthStore.getState().logout();
  throw new Error(result.error);
}
