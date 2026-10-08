import type { Metadata } from 'next';
import ForgotPassword from '@/components/account/ForgotPassword';

export const metadata: Metadata = { title: 'Mot de passe oublié', robots: { index: false } };

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
