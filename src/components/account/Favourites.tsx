'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import { useFavourites } from '@/hooks/useFavourites';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useFavouritesStore } from '@/store/favourites';
import { useAuthStore, useAuthHydrated } from '@/store/auth';
import { thumbnailUrl } from '@/utils/thumbnail';
import { notify } from '@/lib/notify';
import { squareClass } from '../FavouriteButton';
import type { Favourite } from '@/types';
import { Heart, BookOpen } from 'lucide-react';

// Même modèle de case que les listes (CharacterCard / ComicCard) : bordure, contour et ombre décalée.
function FavouriteCard({ fav }: { fav: Favourite }) {
  const removeFavourite = useFavouritesStore((s) => s.remove);
  const isCharacter = fav.itemType === 'character';
  const imgUrl = thumbnailUrl(fav.thumbnailPath, fav.thumbnailExtension, 'portrait_uncanny');
  const href = isCharacter ? `/character/${fav.itemId}` : `/comic/${fav.itemId}`;

  const remove = useAsyncAction({
    mutationFn: () => removeFavourite(fav.itemId),
    onSuccess: () => void notify('info', 'Retiré des favoris', fav.name),
    onError: (err) => void notify('error', err.message),
  });

  return (
    <div
      className={clsx(
        'panel relative overflow-hidden bg-panel',
        isCharacter
          ? 'aspect-[3/4] border-4 border-ink outline-[3px] outline-solid outline-white shadow-[6px_6px_0_#0b0b0b]'
          : 'aspect-[2/3] border-4 border-white'
      )}
    >
      <Link href={href} className="block w-full h-full">
        <img src={imgUrl} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="h-1 w-9 bg-marvel mb-2" />
          <h3 className={clsx('text-white', isCharacter ? 'font-display text-xl leading-none uppercase' : 'font-bold text-base leading-tight line-clamp-2')}>
            {fav.name}
          </h3>
        </div>
      </Link>

      {isCharacter && (
        <Link
          href={`/character/${fav.itemId}#comics`}
          className={clsx(squareClass, 'absolute top-2 left-2 bg-black/60 hover:bg-black/80 transition-colors')}
          aria-label={`Voir les comics de ${fav.name}`}
        >
          <BookOpen size={18} strokeWidth={2.5} />
        </Link>
      )}

      <button
        type="button"
        onClick={() => remove.mutate()}
        disabled={remove.isPending}
        className={clsx(squareClass, 'absolute top-2 right-2 bg-marvel-dark hover:bg-marvel cursor-pointer transition-colors disabled:opacity-50')}
        aria-label={`Retirer ${fav.name} des favoris`}
      >
        <Heart size={18} strokeWidth={2.5} fill="currentColor" />
      </button>
    </div>
  );
}

function Section({ title, items }: { title: string; items: Favourite[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-14">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="font-display font-normal text-3xl uppercase text-white">{title}</h2>
        <span className="font-display text-xl text-caption">{items.length}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 3xl:grid-cols-10 gap-5">
        {items.map((fav) => (
          <FavouriteCard key={fav.id} fav={fav} />
        ))}
      </div>
    </section>
  );
}

export default function Favourites() {
  const { favourites } = useFavourites();
  const { isLoggedIn } = useAuthStore();
  const hydrated = useAuthHydrated();

  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (!isLoggedIn) {
    return (
      <div className="page-x py-24 text-center">
        <p className="text-white/50 mb-4">Connecte-toi pour voir tes favoris.</p>
        <Link href="/user/login?from=/favourites" className="text-marvel hover:underline">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="page-x py-12">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="font-display font-normal text-5xl md:text-6xl uppercase text-white">Favoris</h1>
        <div className="h-1 w-12 bg-marvel" />
      </div>

      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={48} className="text-white/10 mb-4" />
          <p className="text-neutral-400 text-lg">Aucun favori pour l’instant.</p>
          <p className="text-neutral-500 text-sm mt-2">Clique sur le ❤ d’une carte pour la sauvegarder.</p>
        </div>
      ) : (
        <>
          <Section title="Personnages" items={favourites.filter((f) => f.itemType === 'character')} />
          <Section title="Comics" items={favourites.filter((f) => f.itemType === 'comic')} />
        </>
      )}
    </div>
  );
}
