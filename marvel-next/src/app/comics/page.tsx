import type { Metadata } from 'next';
import { CatalogPage } from '@/components/catalog/CatalogPage';

export const metadata: Metadata = {
  title: 'Comics',
  description: 'Des milliers de comics Marvel : numéros, recueils et éditions reliées, avec leurs couvertures.',
  alternates: { canonical: '/comics' },
};

export default function ComicsPage({ searchParams }: PageProps<'/comics'>) {
  return <CatalogPage kind="comics" searchParams={searchParams} />;
}
