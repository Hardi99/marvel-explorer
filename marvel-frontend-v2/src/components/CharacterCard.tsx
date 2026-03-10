import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { Character } from '../types';
import { FavouriteButton } from './FavouriteButton';
import { useFavourites } from '../hooks/useFavourites';
import { useAuthStore } from '../store/auth';
import { getCharacter, getComicsByCharacter } from '../api/characters';

interface Props {
  character: Character;
}

const STALE = 5 * 60 * 1000;

export function CharacterCard({ character }: Props) {
  const imgUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`;
  const { isFavourite } = useFavourites();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const prefetch = () => {
    if (!token) return;
    queryClient.prefetchQuery({ queryKey: ['character', character._id], queryFn: () => getCharacter(token, character._id), staleTime: STALE });
    queryClient.prefetchQuery({ queryKey: ['character-comics', character._id], queryFn: () => getComicsByCharacter(token, character._id), staleTime: STALE });
  };

  return (
    <Link
      to={`/character/${character._id}`}
      onMouseEnter={prefetch}
      className="group relative overflow-hidden rounded-lg bg-zinc-900 aspect-[3/4] block"
    >
      <img
        src={imgUrl}
        alt={character.name}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#ec1d24] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

      <FavouriteButton
        itemId={character._id}
        itemType="character"
        name={character.name}
        thumbnailPath={character.thumbnail.path}
        thumbnailExtension={character.thumbnail.extension}
        isFavourite={isFavourite(character._id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-tight">
          {character.name}
        </h3>
        {character.description && (
          <p className="text-white/60 text-xs mt-1 line-clamp-2">{character.description}</p>
        )}
      </div>
    </Link>
  );
}
