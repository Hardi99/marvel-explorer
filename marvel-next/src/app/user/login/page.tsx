import { Suspense } from 'react';
import type { Metadata } from 'next';
import Login from '@/components/account/Login';

export const metadata: Metadata = { title: 'Connexion', robots: { index: false } };

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
