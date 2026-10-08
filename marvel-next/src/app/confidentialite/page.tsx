import type { Metadata } from 'next';
import { PrivacyPolicy } from '@/components/Legal';

export const metadata: Metadata = { title: 'Confidentialité', alternates: { canonical: '/confidentialite' } };

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
