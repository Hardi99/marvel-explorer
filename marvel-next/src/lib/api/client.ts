import { useAuthStore } from '@/store/auth';

// Même origine que le site : proxy Vite en local, redirection Vercel → Railway en production.
const BASE_URL = '/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 401 && useAuthStore.getState().isLoggedIn) {
      useAuthStore.getState().logout();
    }
    // Les erreurs de validation renvoient un objet (zod), pas un message lisible.
    const message = typeof body.error === 'string' ? body.error : res.status === 400 ? 'Données invalides.' : `Erreur ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}
