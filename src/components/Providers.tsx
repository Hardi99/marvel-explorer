'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/store/auth';

// Zone d'affichage des notifications, chargée après l'affichage de la page (hors du JavaScript initial).
const Toaster = dynamic(() => import('sonner').then((m) => m.Toaster), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  // État de connexion (localStorage) relu une fois la page affichée.
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return (
    <>
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
    </>
  );
}
