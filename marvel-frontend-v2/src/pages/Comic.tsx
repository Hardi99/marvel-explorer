import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { getComic } from '../api/comics';
import { thumbnailUrl } from '../utils/thumbnail';
import { PageSpinner } from '../components/ui/Spinner';
import { FavouriteButton } from '../components/FavouriteButton';
import { useFavourites } from '../hooks/useFavourites';
import { ChevronLeft } from 'lucide-react';

export default function Comic() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuthStore();
  const { isFavourite } = useFavourites();

  const { data: comic, isLoading, isError } = useQuery({
    queryKey: ['comic', id],
    queryFn: () => getComic(id!),
    enabled: isLoggedIn && !!id,
  });

  if (isLoading) return <PageSpinner />;

  if (isError || !comic) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400">Comic introuvable.</p>
        <Link to="/comics" className="text-[#ec1d24] mt-4 inline-flex items-center gap-1">
          <ChevronLeft size={16} /> Retour
        </Link>
      </div>
    );
  }

  const imgUrl = thumbnailUrl(comic.thumbnail.path, comic.thumbnail.extension);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link
        to="/comics"
        className="inline-flex items-center gap-1 text-white/40 hover:text-white text-sm transition-colors mb-8"
      >
        <ChevronLeft size={16} /> Comics
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Cover */}
        <div className="flex-shrink-0 w-48 md:w-72">
          <div className="relative">
            <img
              src={imgUrl}
              alt={comic.title}
              className="w-full rounded-lg shadow-2xl shadow-black/50 border border-white/5 object-cover"
            />
            <FavouriteButton
              itemId={comic._id}
              itemType="comic"
              name={comic.title}
              thumbnailPath={comic.thumbnail.path}
              thumbnailExtension={comic.thumbnail.extension}
              isFavourite={isFavourite(comic._id)}
              className="absolute top-3 right-3"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="h-1 w-12 bg-[#ec1d24] mb-4" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white mb-4">
            {comic.title}
          </h1>

          {comic.description ? (
            <p className="text-white/60 leading-relaxed max-w-2xl">{comic.description}</p>
          ) : (
            <p className="text-white/30 italic">Aucune description disponible.</p>
          )}

          {/* Characters */}
          {comic.characters?.items && comic.characters.items.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white mb-3">
                Personnages
              </h2>
              <div className="flex flex-wrap gap-2">
                {comic.characters.items.map((ch, i) => (
                  <span
                    key={i}
                    className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1.5 rounded-full"
                  >
                    {ch.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
