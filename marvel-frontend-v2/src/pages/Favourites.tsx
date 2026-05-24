import { Link } from 'react-router-dom';
import { useFavourites } from '../hooks/useFavourites';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { removeFavourite } from '../api/favourites';
import type { Favourite } from '../api/favourites';
import { Heart, User, BookOpen } from 'lucide-react';

function FavouriteCard({ fav }: { fav: Favourite }) {
  const queryClient = useQueryClient();
  const imgUrl = `${fav.thumbnailPath}.${fav.thumbnailExtension}`;
  const href = fav.itemType === 'character' ? `/character/${fav.itemId}` : `/comic/${fav.itemId}`;

  const remove = useMutation({
    mutationFn: () => removeFavourite(fav.itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favourites'] }),
  });

  return (
    <div className="group relative overflow-hidden rounded-lg bg-zinc-900 aspect-[3/4]">
      <Link to={href} className="block w-full h-full">
        <img
          src={imgUrl}
          alt={fav.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#ec1d24] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
            {fav.itemType === 'character' ? 'Personnage' : 'Comic'}
          </p>
          <h3 className="text-white font-bold text-sm uppercase tracking-wide leading-tight line-clamp-2">
            {fav.name}
          </h3>
        </div>
      </Link>

      {fav.itemType === 'character' && (
        <Link
          to={`/character/${fav.itemId}#comics`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Voir les comics"
        >
          <BookOpen size={14} />
        </Link>
      )}

      <button
        onClick={() => remove.mutate()}
        disabled={remove.isPending}
        className="absolute top-2 right-2 p-2 rounded-full bg-[#ec1d24] text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#c5151b] disabled:opacity-50"
        aria-label="Retirer des favoris"
      >
        <Heart size={14} fill="currentColor" />
      </button>
    </div>
  );
}

export default function Favourites() {
  const { favourites } = useFavourites();
  const { isLoggedIn } = useAuthStore();

  const characters = favourites.filter((f) => f.itemType === 'character');
  const comics = favourites.filter((f) => f.itemType === 'comic');

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <p className="text-white/50 mb-4">Connecte-toi pour voir tes favoris.</p>
        <Link to="/user/login" className="text-[#ec1d24] hover:underline">Se connecter</Link>
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">Favoris</h1>
          <div className="h-1 w-12 bg-[#ec1d24]" />
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={48} className="text-white/10 mb-4" />
          <p className="text-white/40 text-lg">Aucun favori pour l'instant.</p>
          <p className="text-white/20 text-sm mt-2">
            Clique sur le ❤ sur une carte pour sauvegarder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-wide text-white mb-1">Favoris</h1>
        <div className="h-1 w-12 bg-[#ec1d24]" />
      </div>

      {/* Personnages */}
      {characters.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <User size={16} className="text-[#ec1d24]" />
            <h2 className="text-lg font-black uppercase tracking-wide text-white">
              Personnages
            </h2>
            <span className="text-white/30 text-sm">{characters.length}</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {characters.map((fav) => (
              <FavouriteCard key={fav.id} fav={fav} />
            ))}
          </div>
        </section>
      )}

      {/* Comics */}
      {comics.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={16} className="text-[#ec1d24]" />
            <h2 className="text-lg font-black uppercase tracking-wide text-white">
              Comics
            </h2>
            <span className="text-white/30 text-sm">{comics.length}</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {comics.map((fav) => (
              <FavouriteCard key={fav.id} fav={fav} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
