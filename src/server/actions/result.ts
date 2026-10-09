// Résultat renvoyé par chaque Server Action. Les erreurs sont des valeurs (et non des exceptions) :
// en production, Next.js masque le message des exceptions levées dans une action.
export type ActionResult<T = null> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: 'unauthorized' | 'invalid' | 'rate_limited' };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });

export const fail = (error: string, code?: 'unauthorized' | 'invalid' | 'rate_limited'): ActionResult<never> => ({
  ok: false,
  error,
  code,
});
