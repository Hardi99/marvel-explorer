import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { getCharacters } from '../api/characters';
import { getComics } from '../api/comics';
import { thumbnailUrl } from '../utils/thumbnail';
import { Button } from '../components/ui/Button';
import { ChevronRight } from 'lucide-react';

// Carousels Embla chargés à la demande : ils ne rendent que côté connecté, donc
// embla-carousel reste hors du bundle initial de la landing anonyme (/).
const HeroCarousel = lazy(() => import('../components/home/HeroCarousel'));
const ComicsCarousel = lazy(() => import('../components/home/ComicsCarousel'));

export default function Home() {
  const { isLoggedIn } = useAuthStore();

  const { data: charsData } = useQuery({
    queryKey: ['characters', 'home'],
    queryFn: () => getCharacters({ limit: 6 }),
    enabled: isLoggedIn,
  });

  const { data: comicsData } = useQuery({
    queryKey: ['comics', 'home'],
    queryFn: () => getComics({ limit: 10 }),
    enabled: isLoggedIn,
  });

  const heroCharacters = charsData?.results?.slice(0, 6) ?? [];
  const featuredComics = comicsData?.results?.slice(0, 10) ?? [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden bg-zinc-950">
        {/* Background comic texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Red gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ec1d24]/20 via-transparent to-[#111111]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

        {/* Carousel (arrière-plan décoratif, chargé à la demande) */}
        {heroCharacters.length > 0 && (
          <Suspense fallback={null}>
            <HeroCarousel characters={heroCharacters} />
          </Suspense>
        )}

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="bg-[#ec1d24] text-white font-black text-5xl md:text-7xl px-4 py-2 inline-block mb-6 tracking-tighter">
              MARVEL
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight uppercase">
              Tout l'univers<br />
              <span className="text-[#ec1d24]">Marvel</span>
            </h1>
            <p className="text-white/60 text-lg mb-8 max-w-lg">
              Explorez des milliers de personnages et comics de l'univers Marvel.
            </p>
            <div className="flex flex-wrap gap-4">
              {isLoggedIn ? (
                <>
                  <Link to="/characters">
                    <Button size="lg">Personnages</Button>
                  </Link>
                  <Link to="/comics">
                    <Button variant="outline" size="lg">Comics</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/user/signup">
                    <Button size="lg">Commencer</Button>
                  </Link>
                  <Link to="/user/login">
                    <Button variant="outline" size="lg">Se connecter</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Characters section */}
      {isLoggedIn && heroCharacters.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-wide text-white">
              Personnages
            </h2>
            <Link
              to="/characters"
              className="flex items-center gap-1 text-[#ec1d24] text-sm font-semibold hover:gap-2 transition-all"
            >
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {heroCharacters.slice(0, 10).map((char) => {
              const imgUrl = thumbnailUrl(char.thumbnail.path, char.thumbnail.extension);
              return (
                <Link
                  key={char._id}
                  to={`/character/${char._id}`}
                  className="group relative overflow-hidden rounded-lg bg-zinc-900 aspect-[3/4]"
                >
                  <img
                    src={imgUrl}
                    alt={char.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ec1d24] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-xs uppercase tracking-wide">{char.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Comics carousel */}
      {isLoggedIn && featuredComics.length > 0 && (
        <section className="py-16 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-wide text-white">
                Comics
              </h2>
              <Link
                to="/comics"
                className="flex items-center gap-1 text-[#ec1d24] text-sm font-semibold hover:gap-2 transition-all"
              >
                Voir tout <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <Suspense fallback={<div className="h-[264px] md:h-[264px]" />}>
            <ComicsCarousel comics={featuredComics} />
          </Suspense>
        </section>
      )}

      {/* CTA si non connecté */}
      {!isLoggedIn && (
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-12">
            <div className="bg-[#ec1d24] text-white font-black text-3xl px-3 py-1 inline-block mb-6 tracking-tighter">
              MARVEL
            </div>
            <h2 className="text-3xl font-black uppercase mb-4">
              Rejoignez l'univers Marvel
            </h2>
            <p className="text-white/50 mb-8">
              Créez un compte pour accéder à tous les personnages et comics.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/user/signup">
                <Button size="lg">Créer un compte</Button>
              </Link>
              <Link to="/user/login">
                <Button variant="outline" size="lg">Se connecter</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
