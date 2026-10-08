'use client';

import Link from 'next/link';
import type { Character } from '@/types';
import { FavouriteButton } from './FavouriteButton';
import { useFavourites } from '@/hooks/useFavourites';
import { thumbnailUrl } from '@/utils/thumbnail';

interface Props {
  character: Character;
  /** Cartes visibles dès l'ouverture : image chargée tout de suite (meilleur LCP). */
  priority?: boolean;
}

export function CharacterCard({ character, priority = false }: Props) {
  const imgUrl = thumbnailUrl(character.thumbnail.path, character.thumbnail.extension, 'portrait_uncanny');
  const { isFavourite } = useFavourites();

  return (
    <Link
      href={`/character/${character._id}`}
      className="panel group relative block aspect-[3/4] overflow-hidden bg-panel border-4 border-ink outline-[3px] outline-solid outline-white shadow-[6px_6px_0_#0b0b0b]"
    >
      <img
        src={imgUrl}
        alt=""
        className="w-full h-full object-cover object-top"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <FavouriteButton
        itemId={character._id}
        itemType="character"
        name={character.name}
        thumbnailPath={character.thumbnail.path}
        thumbnailExtension={character.thumbnail.extension}
        isFavourite={isFavourite(character._id)}
        className="absolute top-2 right-2"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-1 w-9 bg-marvel mb-2" />
        <h2 className="font-display text-xl leading-none uppercase text-white">{character.name}</h2>
        {character.description && (
          <p className="text-neutral-300 text-sm mt-1.5 line-clamp-2">{character.description}</p>
        )}
      </div>
    </Link>
  );
}
