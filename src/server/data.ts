import 'server-only';
import { cacheLife } from 'next/cache';
import { proxyFetch } from './utils/proxy';
import { getMovies, type Movie } from './utils/tmdb';
import { CURATED, HEROES_OF_THE_DAY, FEATURED_CHARACTERS, FEATURED_COMICS } from './curation';
import type { ApiResponse, Character, Comic, Thumbnail } from '@/types';

// Données publiques (Marvel, TMDB) mises en cache par Next.js (`use cache`) : les pages
// les intègrent à leur version statique, servie par le CDN, et l'API les réutilise.
// Les erreurs ne sont gardées que quelques secondes, pour ne pas figer une panne passagère.

export interface HomeData {
  hero: { _id: string; name: string; alias: string; sound: string; thumbnail: Thumbnail };
  characters: { _id: string; name: string; alias: string; thumbnail: Thumbnail }[];
  comics: { _id: string; title: string; thumbnail: Thumbnail }[];
}

export interface CharacterExtras {
  alias: string | null;
  sound: string | null;
  movies: Movie[];
}

export interface ListParams {
  name: string;
  skip: number;
  limit: number;
}

const thumbnailOf = async (path: string) => ((await proxyFetch(path)) as { thumbnail: Thumbnail }).thumbnail;

export async function getHome(): Promise<HomeData> {
  'use cache';
  // Le héros du jour change chaque jour : le cache est rafraîchi toutes les heures.
  cacheLife('hours');
  const day = Math.floor(Date.now() / 86_400_000);
  const heroId = HEROES_OF_THE_DAY[day % HEROES_OF_THE_DAY.length]!;
  const pick = CURATED[heroId]!;

  const [heroThumbnail, characters, comics] = await Promise.all([
    thumbnailOf(`/character/${heroId}`),
    Promise.all(FEATURED_CHARACTERS.map(async (id) => ({
      _id: id, name: CURATED[id]!.label, alias: CURATED[id]!.alias, thumbnail: await thumbnailOf(`/character/${id}`),
    }))),
    Promise.all(FEATURED_COMICS.map(async (c) => ({
      _id: c.id, title: c.label, thumbnail: await thumbnailOf(`/comic/${c.id}`),
    }))),
  ]);

  return {
    hero: { _id: heroId, name: pick.label, alias: pick.alias, sound: pick.sound, thumbnail: heroThumbnail },
    characters,
    comics,
  };
}

export async function getCharacter(id: string): Promise<Character | null> {
  'use cache';
  try {
    const character = (await proxyFetch(`/character/${id}`)) as Character;
    cacheLife('days');
    return character?._id ? character : null;
  } catch {
    cacheLife('seconds');
    return null;
  }
}

export async function getCharacterComics(id: string): Promise<ApiResponse<Comic>> {
  'use cache';
  try {
    const data = (await proxyFetch(`/comics/${id}`)) as { comics?: Comic[] };
    cacheLife('days');
    const results = data.comics ?? [];
    return { count: results.length, results };
  } catch {
    cacheLife('seconds');
    return { count: 0, results: [] };
  }
}

export async function getCharacterExtras(id: string): Promise<CharacterExtras> {
  'use cache';
  const curated = CURATED[id];
  const movies = curated ? await getMovies(curated.films) : [];
  // Des films étaient attendus mais aucun n'a répondu (TMDB indisponible) : on réessaie vite.
  if (curated && movies.length === 0) cacheLife('minutes');
  else cacheLife('days');
  return { alias: curated?.alias ?? null, sound: curated?.sound ?? null, movies };
}

export async function getComic(id: string): Promise<Comic | null> {
  'use cache';
  try {
    const comic = (await proxyFetch(`/comic/${id}`)) as Comic;
    cacheLife('days');
    return comic?._id ? comic : null;
  } catch {
    cacheLife('seconds');
    return null;
  }
}

export async function listCharacters({ name, skip, limit }: ListParams): Promise<ApiResponse<Character>> {
  'use cache';
  cacheLife('hours');
  return (await proxyFetch('/characters', { name, skip, limit })) as ApiResponse<Character>;
}

export async function listComics({ name, skip, limit }: ListParams): Promise<ApiResponse<Comic>> {
  'use cache';
  cacheLife('hours');
  // L'API externe utilise "title" pour les comics (≠ "name" pour les personnages)
  return (await proxyFetch('/comics', { title: name, skip, limit })) as ApiResponse<Comic>;
}

/** Identifiants mis en avant : prérendus au déploiement (fiches et plan du site). */
export const FEATURED_CHARACTER_IDS = Object.keys(CURATED);
export const FEATURED_COMIC_IDS = FEATURED_COMICS.map((c) => c.id);
