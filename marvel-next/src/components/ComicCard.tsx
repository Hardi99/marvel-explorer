'use client';

import Link from 'next/link';
import type { Comic } from '@/types';
import { FavouriteButton } from './FavouriteButton';
import { useFavourites } from '@/hooks/useFavourites';
import { thumbnailUrl } from '@/utils/thumbnail';

interface Props {
  comic: Comic;
  /** Cartes visibles dès l'ouverture : image chargée tout de suite (meilleur LCP). */
  priority?: boolean;
}

export function ComicCard({ comic, priority = false }: Props) {
  const imgUrl = thumbnailUrl(comic.thumbnail.path, comic.thumbnail.extension, 'portrait_uncanny');
  const { isFavourite } = useFavourites();

  return (
    <Link href={`/comic/${comic._id}`} className="panel group relative block aspect-[2/3] overflow-hidden bg-panel border-4 border-white">
      <img
        src={imgUrl}
        alt=""
        className="w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

      <FavouriteButton
        itemId={comic._id}
        itemType="comic"
        name={comic.title}
        thumbnailPath={comic.thumbnail.path}
        thumbnailExtension={comic.thumbnail.extension}
        isFavourite={isFavourite(comic._id)}
        className="absolute top-2 right-2"
      />

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h2 className="text-white font-bold text-base leading-tight line-clamp-2">{comic.title}</h2>
      </div>
    </Link>
  );
}
