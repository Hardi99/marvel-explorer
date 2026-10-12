'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { notify } from '@/lib/notify';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useFavouritesStore } from '@/store/favourites';
import { useAuthStore } from '@/store/auth';
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

/** Pastille carrée des cartes (accueil, listes, favoris), connecté ou non. */
export const squareClass = 'w-10 h-10 flex items-center justify-center border-2 border-white text-white';

export function FavouriteButton({
  itemId, itemType, name, thumbnailPath, thumbnailExtension, isFavourite: isFavouriteProp, className, variant = 'icon',
}: Props) {
  const favourites = useFavourites();
  const isFavourite = isFavouriteProp ?? favourites.isFavourite(itemId);
  const { isLoggedIn } = useAuthStore();
  const pathname = usePathname();
  const add = useFavouritesStore((s) => s.add);
  const remove = useFavouritesStore((s) => s.remove);

  const mutation = useAsyncAction({
    mutationFn: () =>
      isFavourite ? remove(itemId) : add({ itemId, itemType, name, thumbnailPath, thumbnailExtension }),
    onSuccess: () => {
      void notify(isFavourite ? 'info' : 'success', isFavourite ? 'Retiré des favoris' : 'Ajouté aux favoris', name);
    },
    onError: (err) => {
      void notify('error', err.message);
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

  // Sans compte : même pastille carrée, purement décorative (la carte entière reste le lien).
  if (!isLoggedIn) {
    return (
      <span aria-hidden="true" className={clsx(squareClass, 'bg-black/60', className)}>
        <Heart size={18} strokeWidth={2.5} />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutation.mutate();
      }}
      disabled={mutation.isPending}
      aria-pressed={isFavourite}
      aria-label={isFavourite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={clsx(
        squareClass,
        'cursor-pointer transition-colors disabled:opacity-50',
        isFavourite ? 'bg-marvel-dark hover:bg-marvel' : 'bg-black/60 hover:bg-black/80',
        className
      )}
    >
      <Heart size={18} strokeWidth={2.5} fill={isFavourite ? 'currentColor' : 'none'} />
    </button>
  );
}
