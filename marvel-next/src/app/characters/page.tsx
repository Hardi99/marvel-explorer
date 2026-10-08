import type { Metadata } from 'next';
import { CatalogPage } from '@/components/catalog/CatalogPage';

export const metadata: Metadata = {
  title: 'Personnages',
  description: 'Tous les personnages Marvel : héros, vilains et équipes, avec leurs apparitions dans les comics.',
  alternates: { canonical: '/characters' },
};

export default function CharactersPage({ searchParams }: PageProps<'/characters'>) {
  return <CatalogPage kind="characters" searchParams={searchParams} />;
}
