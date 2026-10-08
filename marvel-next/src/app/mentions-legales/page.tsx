import type { Metadata } from 'next';
import { LegalNotice } from '@/components/Legal';

export const metadata: Metadata = { title: 'Mentions légales', alternates: { canonical: '/mentions-legales' } };

export default function LegalNoticePage() {
  return <LegalNotice />;
}
