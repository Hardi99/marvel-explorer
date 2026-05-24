import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { getCharacter, getComicsByCharacter } from '../api/characters';
import { thumbnailUrl } from '../utils/thumbnail';
import { PageSpinner } from '../components/ui/Spinner';
import { FavouriteButton } from '../components/FavouriteButton';
import { ComicCard } from '../components/ComicCard';
import { useFavourites } from '../hooks/useFavourites';
import { ChevronLeft } from 'lucide-react';

export default function Character() {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuthStore();
  const { isFavourite } = useFavourites();

  const { data: character, isLoading, isError } = useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacter(id!),
    enabled: isLoggedIn && !!id,
  });

  const { data: comicsData, isLoading: comicsLoading } = useQuery({
    queryKey: ['character-comics', id],
    queryFn: () => getComicsByCharacter(id!),
    enabled: isLoggedIn && !!id,
  });

  if (isLoading) return <PageSpinner />;

  if (isError || !character) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-red-400">Personnage introuvable.</p>
        <Link to="/characters" className="text-[#ec1d24] mt-4 inline-flex items-center gap-1">
          <ChevronLeft size={16} /> Retour
        </Link>
      </div>
    );
  }

  const imgUrl = thumbnailUrl(character.thumbnail.path, character.thumbnail.extension);
  const comics = comicsData?.results ?? [];

  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-zinc-900">
        <img
          src={imgUrl}
          alt={character.name}
          className="w-full h-full object-cover object-top opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 -mt-24 relative z-10">
        <Link
          to="/characters"
          className="inline-flex items-center gap-1 text-white/40 hover:text-white text-sm transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Personnages
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Portrait */}
          <div className="flex-shrink-0 w-48 md:w-64">
            <div className="relative">
              <img
                src={imgUrl}
                alt={character.name}
                className="w-full rounded-lg shadow-2xl shadow-black/50 border border-white/5 object-cover aspect-[3/4] object-top"
              />
              <FavouriteButton
                itemId={character._id}
                itemType="character"
                name={character.name}
                thumbnailPath={character.thumbnail.path}
                thumbnailExtension={character.thumbnail.extension}
                isFavourite={isFavourite(character._id)}
                className="absolute top-3 right-3"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="h-1 w-12 bg-[#ec1d24] mb-4" />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wide text-white mb-4">
              {character.name}
            </h1>

            {character.description ? (
              <p className="text-white/60 text-base leading-relaxed max-w-2xl">
                {character.description}
              </p>
            ) : (
              <p className="text-white/30 italic">Aucune description disponible.</p>
            )}
          </div>
        </div>

        {/* Comics du personnage */}
        <div className="mt-14" id="comics">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-black uppercase tracking-wide text-white">Comics</h2>
            <div className="h-px flex-1 bg-white/5" />
            {!comicsLoading && (
              <span className="text-white/30 text-sm">{comics.length} résultat{comics.length > 1 ? 's' : ''}</span>
            )}
          </div>

          {comicsLoading && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-white/20 border-t-[#ec1d24] rounded-full animate-spin" />
            </div>
          )}

          {!comicsLoading && comics.length === 0 && (
            <p className="text-white/30 italic">Aucun comic trouvé pour ce personnage.</p>
          )}

          {comics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {comics.map((comic) => (
                <ComicCard key={comic._id} comic={comic} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
