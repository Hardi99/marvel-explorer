import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { Comic } from '../types';
import { FavouriteButton } from './FavouriteButton';
import { useFavourites } from '../hooks/useFavourites';
import { getComic } from '../api/comics';
import { thumbnailUrl } from '../utils/thumbnail';

interface Props {
  comic: Comic;
}

const STALE = 5 * 60 * 1000;

export function ComicCard({ comic }: Props) {
  const imgUrl = thumbnailUrl(comic.thumbnail.path, comic.thumbnail.extension);
  const { isFavourite } = useFavourites();
  const queryClient = useQueryClient();

  return (
    <Link
      to={`/comic/${comic._id}`}
      onMouseEnter={() => queryClient.prefetchQuery({ queryKey: ['comic', comic._id], queryFn: () => getComic(comic._id), staleTime: STALE })}
      className="group relative overflow-hidden rounded-lg bg-zinc-900 aspect-[2/3] block"
    >
      <img
        src={imgUrl}
        alt={comic.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#ec1d24] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

      <FavouriteButton
        itemId={comic._id}
        itemType="comic"
        name={comic.title}
        thumbnailPath={comic.thumbnail.path}
        thumbnailExtension={comic.thumbnail.extension}
        isFavourite={isFavourite(comic._id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold text-xs uppercase tracking-wide leading-tight line-clamp-2">
          {comic.title}
        </h3>
      </div>
    </Link>
  );
}
