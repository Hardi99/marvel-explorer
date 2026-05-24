import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../store/auth';
import { addFavourite, removeFavourite } from '../api/favourites';
import { clsx } from 'clsx';

interface Props {
  itemId: string;
  itemType: 'character' | 'comic';
  name: string;
  thumbnailPath: string;
  thumbnailExtension: string;
  isFavourite: boolean;
  className?: string;
}

export function FavouriteButton({
  itemId, itemType, name, thumbnailPath, thumbnailExtension, isFavourite, className,
}: Props) {
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      isFavourite
        ? removeFavourite(itemId)
        : addFavourite({ itemId, itemType, name, thumbnailPath, thumbnailExtension }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
      if (isFavourite) {
        toast(`Retiré des favoris`, { description: name });
      } else {
        toast.success(`Ajouté aux favoris`, { description: name });
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutation.mutate();
      }}
      disabled={mutation.isPending}
      aria-label={isFavourite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={clsx(
        'p-2 rounded-full transition-all duration-200',
        isFavourite
          ? 'bg-[#ec1d24] text-white hover:bg-[#c5151b]'
          : 'bg-black/50 text-white/60 hover:text-white hover:bg-black/70',
        'disabled:opacity-50',
        className
      )}
    >
      <Heart size={16} fill={isFavourite ? 'currentColor' : 'none'} />
    </button>
  );
}
