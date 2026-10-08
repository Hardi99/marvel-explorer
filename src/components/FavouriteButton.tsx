'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';
import { addFavourite, removeFavourite } from '@/lib/api/favourites';
import { useFavourites } from '@/hooks/useFavourites';
import { clsx } from 'clsx';

interface Props {
  itemId: string;
  itemType: 'character' | 'comic';
  name: string;
  thumbnailPath: string;
  thumbnailExtension: string;
  /** Facultatif : sinon lu dans la liste des favoris du visiteur (utile depuis une page serveur). */
  isFavourite?: boolean;
  className?: string;
  /** `icon` : pastille sur les cartes · `label` : gros bouton des fiches (visible aussi sans compte). */
  variant?: 'icon' | 'label';
}

const labelClass =
  'btn-comic inline-flex items-center gap-2.5 bg-white text-ink font-display text-[22px] tracking-[1px] uppercase px-6 py-3.5 border-[3px] border-ink shadow-[6px_6px_0_#0b0b0b] cursor-pointer disabled:opacity-60';

export function FavouriteButton({
  itemId, itemType, name, thumbnailPath, thumbnailExtension, isFavourite: isFavouriteProp, className, variant = 'icon',
}: Props) {
  const favourites = useFavourites();
  const isFavourite = isFavouriteProp ?? favourites.isFavourite(itemId);
  const { isLoggedIn } = useAuthStore();
  const pathname = usePathname();
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

  if (variant === 'label') {
    // Sans compte : le bouton mène à la connexion, qui ramène ensuite sur cette fiche.
    if (!isLoggedIn) {
      return (
        <Link href={`/user/login?from=${encodeURIComponent(pathname)}`} className={clsx(labelClass, className)}>
          <Heart size={20} strokeWidth={2.5} aria-hidden="true" />
          Ajouter aux favoris
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        aria-pressed={isFavourite}
        className={clsx(labelClass, className)}
      >
        <Heart size={20} strokeWidth={2.5} fill={isFavourite ? 'currentColor' : 'none'} aria-hidden="true" className={isFavourite ? 'text-marvel' : ''} />
        {isFavourite ? 'Dans tes favoris' : 'Ajouter aux favoris'}
      </button>
    );
  }

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
          ? 'bg-marvel text-white hover:bg-[#c5151b]'
          : 'bg-black/50 text-white/60 hover:text-white hover:bg-black/70',
        'disabled:opacity-50',
        className
      )}
    >
      <Heart size={16} fill={isFavourite ? 'currentColor' : 'none'} />
    </button>
  );
}
