import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getCharacter, getCharacterExtras, getComicsByCharacter } from '../api/characters';
import { thumbnailUrl } from '../utils/thumbnail';
import { splitCharacterName } from '../utils/characterName';
import { parseComic } from '../utils/comicInfo';
import { PageSpinner } from '../components/ui/Spinner';
import { FavouriteButton } from '../components/FavouriteButton';
import { ComicsWall } from '../components/ComicsWall';
import { MovieStrip } from '../components/character/MovieStrip';
import { useFavourites } from '../hooks/useFavourites';

// Onomatopée par défaut pour les personnages hors sélection, stable d'une visite à l'autre.
const SOUNDS = ['POW!', 'BAM!', 'WHAM!', 'KRAK!', 'ZAP!', 'BOOM!'];
const soundFor = (id: string) => SOUNDS[parseInt(id.slice(-4), 16) % SOUNDS.length]!;

export default function Character() {
  const { id } = useParams<{ id: string }>();
  const { isFavourite } = useFavourites();

  const { data: character, isLoading, isError } = useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacter(id!),
    enabled: !!id,
  });

  const { data: comicsData } = useQuery({
    queryKey: ['character-comics', id],
    queryFn: () => getComicsByCharacter(id!),
    enabled: !!id,
  });

  const { data: extras } = useQuery({
    queryKey: ['character-extras', id],
    queryFn: () => getCharacterExtras(id!),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000,
  });

  if (isLoading) return <PageSpinner />;

  if (isError || !character) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center">
        <p className="bg-caption text-ink border-[3px] border-ink px-4 py-2 font-bold text-lg uppercase -rotate-2">
          Ce personnage a disparu dans le multivers…
        </p>
        <Link to="/characters" className="font-bold text-lg tracking-[2px] uppercase underline underline-offset-[6px]">
          Tous les personnages →
        </Link>
      </div>
    );
  }

  const { name, detail } = splitCharacterName(character.name);
  const comics = comicsData?.results;
  const movies = extras?.movies ?? [];

  return (
    <div>
      {/* EN-TÊTE DE FICHE : case de BD */}
      <section className="relative bg-marvel overflow-hidden [clip-path:polygon(0_0,100%_0,100%_94%,0_100%)]">
        <div className="dots absolute inset-0 opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(260deg,#0b0b0b_0%,rgb(11_11_11/0.9)_40%,rgb(11_11_11/0)_70%)]" />

        <div className="relative max-w-[1320px] mx-auto px-6 pt-7 pb-[120px] flex flex-col gap-7">
          <Link to="/characters" className="self-start flex items-center gap-2 font-bold text-[17px] tracking-[2px] uppercase hover:text-caption transition-colors">
            <ArrowLeft size={18} strokeWidth={3} aria-hidden="true" />
            Tous les personnages
          </Link>

          <div className="flex flex-wrap items-center gap-14">
            {/* Portrait */}
            <div className="flex-[0_1_420px] min-w-0 relative mx-auto md:mx-0">
              <div className="relative aspect-[3/4] border-[5px] border-ink shadow-[14px_14px_0_#0b0b0b] -rotate-2 overflow-hidden bg-panel">
                <img
                  src={thumbnailUrl(character.thumbnail.path, character.thumbnail.extension)}
                  alt=""
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-cover object-[40%_20%]"
                />
                <div className="dots absolute inset-0 opacity-15" />
              </div>
              <div
                aria-hidden="true"
                className="starburst absolute -top-[26px] -left-[30px] w-[140px] h-[140px] bg-caption text-ink flex items-center justify-center font-comic text-[clamp(22px,2.6vw,34px)] tracking-[2px] -rotate-12"
              >
                {extras?.sound ?? soundFor(character._id)}
              </div>
            </div>

            {/* Identité */}
            <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-[22px]">
              <p className="self-start bg-caption text-ink border-[3px] border-ink shadow-[6px_6px_0_#0b0b0b] px-4 py-2 font-bold text-lg tracking-[1px] uppercase -rotate-2">
                {extras?.alias ? `Identité secrète : ${extras.alias}` : 'Dossier personnage'}
              </p>
              <h1 className="font-display font-normal text-[clamp(56px,8vw,132px)] leading-[0.95] uppercase tracking-[-1px] break-words">
                {name}
              </h1>
              {detail && !extras?.alias && (
                <p className="-mt-3 font-display text-[clamp(22px,2.5vw,32px)] uppercase text-neutral-200">{detail}</p>
              )}

              {/* Description dans une case de narration */}
              <div className="relative bg-white text-ink border-4 border-ink shadow-[8px_8px_0_#0b0b0b] px-[26px] pt-[26px] pb-[22px] max-w-[640px]">
                <span className="absolute -top-4 left-[18px] bg-caption border-[3px] border-ink px-2.5 py-0.5 font-bold text-sm tracking-[1.5px] uppercase">
                  Le dossier
                </span>
                <p className="text-[21px] leading-[1.4] font-medium">
                  {character.description?.trim() ||
                    'Les archives restent muettes sur ce personnage… Ses exploits parlent pour lui dans les comics ci-dessous.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-[18px]">
                <FavouriteButton
                  variant="label"
                  itemId={character._id}
                  itemType="character"
                  name={name}
                  thumbnailPath={character.thumbnail.path}
                  thumbnailExtension={character.thumbnail.extension}
                  isFavourite={isFavourite(character._id)}
                />
                <ul className="flex flex-wrap gap-2.5">
                  {comicsData && (
                    <li className="bg-ink border-2 border-white px-3 py-1.5 font-bold text-base tracking-[1px] uppercase">
                      {comicsData.count} comic{comicsData.count > 1 ? 's' : ''}
                    </li>
                  )}
                  {movies.length > 0 && (
                    <li className="bg-ink border-2 border-white px-3 py-1.5 font-bold text-base tracking-[1px] uppercase">
                      {movies.length} film{movies.length > 1 ? 's' : ''}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APPARITIONS */}
      {comics && comics.length === 0 ? (
        <p className="max-w-[1320px] mx-auto px-6 py-16 text-xl text-neutral-400">
          Aucun comic n’est encore référencé pour ce personnage.
        </p>
      ) : (
        <ComicsWall
          className="pt-6 pb-[72px]"
          titleId="character-comics"
          title={<>Ses <span className="text-marvel">apparitions</span></>}
          items={comics?.map((comic) => {
            const info = parseComic(comic.title);
            return { ...comic, title: info.issue ? `${info.title} #${info.issue}` : info.title };
          })}
        />
      )}

      {/* AU CINÉMA : seulement si TMDB a des films pour ce personnage */}
      {movies.length > 0 && <MovieStrip movies={movies} />}
    </div>
  );
}
