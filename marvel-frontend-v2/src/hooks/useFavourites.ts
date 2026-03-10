import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { getFavourites } from '../api/favourites';

export function useFavourites() {
  const { token } = useAuthStore();

  const { data: favourites = [] } = useQuery({
    queryKey: ['favourites'],
    queryFn: () => getFavourites(token!),
    enabled: !!token,
  });

  const isFavourite = (itemId: string) =>
    favourites.some((f) => f.itemId === itemId);

  return { favourites, isFavourite };
}
