'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { getFavourites } from '@/lib/api/favourites';

export function useFavourites() {
  const { isLoggedIn } = useAuthStore();

  const { data: favourites = [] } = useQuery({
    queryKey: ['favourites'],
    queryFn: getFavourites,
    enabled: isLoggedIn,
  });

  const isFavourite = (itemId: string) =>
    favourites.some((f) => f.itemId === itemId);

  return { favourites, isFavourite };
}
