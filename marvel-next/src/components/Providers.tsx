'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/auth';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } } }),
  );

  // État de connexion (localStorage) relu une fois la page affichée.
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffd23f',
            border: '3px solid #0b0b0b',
            borderRadius: 0,
            boxShadow: '6px 6px 0 #0b0b0b',
            color: '#0b0b0b',
            fontFamily: 'var(--font-sans)',
            fontSize: '17px',
          },
        }}
      />
    </QueryClientProvider>
  );
}
