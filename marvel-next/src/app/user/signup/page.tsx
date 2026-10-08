import type { Metadata } from 'next';
import Signup from '@/components/account/Signup';

export const metadata: Metadata = { title: 'Créer un compte', robots: { index: false } };

export default function SignupPage() {
  return <Signup />;
}
