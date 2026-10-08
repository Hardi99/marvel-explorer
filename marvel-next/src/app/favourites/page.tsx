import type { Metadata } from 'next';
import Favourites from '@/components/account/Favourites';

export const metadata: Metadata = { title: 'Mes favoris', robots: { index: false } };

export default function FavouritesPage() {
  return <Favourites />;
}
