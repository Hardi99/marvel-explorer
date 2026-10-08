import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  getCharacter, getCharacterComics, getCharacterExtras, FEATURED_CHARACTER_IDS,
} from '@/server/data';
import { MARVEL_ID } from '@/server/utils/proxy';
import { thumbnailUrl } from '@/utils/thumbnail';
import { splitCharacterName } from '@/utils/characterName';
import { parseComic } from '@/utils/comicInfo';
import { FavouriteButton } from '@/components/FavouriteButton';
import { ComicsWall } from '@/components/ComicsWall';
import { MovieStrip } from '@/components/character/MovieStrip';

// Onomatopée par défaut pour les personnages hors sélection, stable d'une visite à l'autre.
const SOUNDS = ['POW!', 'BAM!', 'WHAM!', 'KRAK!', 'ZAP!', 'BOOM!'];
const soundFor = (id: string) => SOUNDS[parseInt(id.slice(-4), 16) % SOUNDS.length]!;

// Les héros mis en avant sont prérendus au déploiement ; les autres le sont à la première visite.
export async function generateStaticParams() {
  return FEATURED_CHARACTER_IDS.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<'/character/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const character = MARVEL_ID.test(id) ? await getCharacter(id) : null;
  if (!character) return { title: 'Personnage introuvable' };

  const { name } = splitCharacterName(character.name);
  const description = character.description?.trim() || `${name} : fiche, apparitions dans les comics et films Marvel.`;
  const image = thumbnailUrl(character.thumbnail.path, character.thumbnail.extension);
  return {
    title: name,
    description: description.slice(0, 160),
    alternates: { canonical: `/character/${id}` },
    openGraph: { title: name, description: description.slice(0, 200), images: [{ url: image, alt: name }] },
  };
}

async function CharacterDetails({ params }: { params: PageProps<'/character/[id]'>['params'] }) {
  const { id } = await params;
  if (!MARVEL_ID.test(id)) notFound();

  const [character, comicsData, extras] = await Promise.all([
    getCharacter(id),
    getCharacterComics(id),
    getCharacterExtras(id),
  ]);
  if (!character) notFound();

  const { name, detail } = splitCharacterName(character.name);
  const comics = comicsData.results;
  const movies = extras.movies;

  return (
    <>
      {/* EN-TÊTE DE FICHE : case de BD */}
      <section className="relative bg-marvel overflow-hidden [clip-path:polygon(0_0,100%_0,100%_94%,0_100%)]">
        <div className="dots absolute inset-0 opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(260deg,#0b0b0b_0%,rgb(11_11_11/0.9)_40%,rgb(11_11_11/0)_70%)]" />

        <div className="relative max-w-[1320px] mx-auto px-6 pt-7 pb-[120px] flex flex-col gap-7">
          <Link href="/characters" className="self-start flex items-center gap-2 font-bold text-[17px] tracking-[2px] uppercase hover:text-caption transition-colors">
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
                {extras.sound ?? soundFor(character._id)}
              </div>
            </div>

            {/* Identité */}
            <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-[22px]">
              <p className="self-start bg-caption text-ink border-[3px] border-ink shadow-[6px_6px_0_#0b0b0b] px-4 py-2 font-bold text-lg tracking-[1px] uppercase -rotate-2">
                {extras.alias ? `Identité secrète : ${extras.alias}` : 'Dossier personnage'}
              </p>
              <h1 className="font-display font-normal text-[clamp(56px,8vw,132px)] leading-[0.95] uppercase tracking-[-1px] break-words">
                {name}
              </h1>
              {detail && !extras.alias && (
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
                />
                <ul className="flex flex-wrap gap-2.5">
                  <li className="bg-ink border-2 border-white px-3 py-1.5 font-bold text-base tracking-[1px] uppercase">
                    {comicsData.count} comic{comicsData.count > 1 ? 's' : ''}
                  </li>
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
      {comics.length === 0 ? (
        <p className="max-w-[1320px] mx-auto px-6 py-16 text-xl text-neutral-400">
          Aucun comic n’est encore référencé pour ce personnage.
        </p>
      ) : (
        <ComicsWall
          className="pt-6 pb-[72px]"
          titleId="character-comics"
          title={<>Ses <span className="text-marvel">apparitions</span></>}
          items={comics.map((comic) => {
            const info = parseComic(comic.title);
            return { ...comic, title: info.issue ? `${info.title} #${info.issue}` : info.title };
          })}
        />
      )}

      {/* AU CINÉMA : seulement si TMDB a des films pour ce personnage */}
      {movies.length > 0 && <MovieStrip movies={movies} />}
    </>
  );
}

function DetailsSkeleton() {
  return (
    <div className="bg-marvel/20 min-h-[720px]" aria-hidden="true">
      <div className="max-w-[1320px] mx-auto px-6 pt-20 flex flex-wrap gap-14">
        <div className="w-[min(100%,420px)] aspect-[3/4] bg-panel border-[5px] border-ink -rotate-2" />
        <div className="flex-1 min-w-[280px] flex flex-col gap-6 pt-10">
          <div className="h-10 w-72 bg-caption/40" />
          <div className="h-28 w-full max-w-[520px] bg-white/10" />
          <div className="h-40 w-full max-w-[640px] bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function CharacterPage({ params }: PageProps<'/character/[id]'>) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <CharacterDetails params={params} />
    </Suspense>
  );
}
