import { Suspense } from 'react';
import type { Metadata } from 'next';
import ResetPassword from '@/components/account/ResetPassword';

export const metadata: Metadata = { title: 'Nouveau mot de passe', robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
