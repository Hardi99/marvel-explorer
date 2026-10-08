'use client';

import { useState } from 'react';

interface Options<TVars, TData> {
  mutationFn: (vars: TVars) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (err: Error) => void;
}

// Exécute une action asynchrone (envoi de formulaire…) en suivant son état : en cours, erreur.
// Remplace useMutation de TanStack Query, dont le site n'utilisait que cette partie.
export function useAsyncAction<TVars = void, TData = unknown>({ mutationFn, onSuccess, onError }: Options<TVars, TData>) {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = (vars: TVars) => {
    setPending(true);
    setError(null);
    mutationFn(vars)
      .then((data) => onSuccess?.(data))
      .catch((err: unknown) => {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        onError?.(e);
      })
      .finally(() => setPending(false));
  };

  return { mutate, isPending, isError: error !== null, error };
}
