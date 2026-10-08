'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useFavouritesStore } from '@/store/favourites';

export function useFavourites() {
  const { isLoggedIn } = useAuthStore();
  const items = useFavouritesStore((s) => s.items);
  const load = useFavouritesStore((s) => s.load);

  useEffect(() => {
    if (isLoggedIn) void load();
  }, [isLoggedIn, load]);

  const favourites = isLoggedIn ? (items ?? []) : [];
  const isFavourite = (itemId: string) => favourites.some((f) => f.itemId === itemId);

  return { favourites, isFavourite };
}
