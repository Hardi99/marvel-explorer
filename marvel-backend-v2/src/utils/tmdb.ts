import type { Film } from '../curation.js';

// TMDB (The Movie Database) : affiches et bandes-annonces des films.
// TMDB_TOKEN accepte la « clé d'API » (v3, 32 caractères) ou le « jeton de lecture » (v4).
// Sans elle, aucune requête n'est faite et la section cinéma reste simplement masquée côté site.

const TMDB_BASE = 'https://api.themoviedb.org/3';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';
const CACHE_MS = 24 * 60 * 60 * 1000;

export interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string | null;
  trailer: string | null; // identifiant de vidéo YouTube
  url: string;
}

interface TmdbMovie {
  title: string;
  release_date?: string;
  poster_path: string | null;
  videos?: { results: { site: string; type: string; key: string; iso_639_1: string; official: boolean }[] };
}

const cache = new Map<number, { expires: number; movie: Movie | null }>();

async function fetchMovie([id, title, year]: Film, token: string): Promise<Movie | null> {
  const hit = cache.get(id);
  if (hit && hit.expires > Date.now()) return hit.movie;

  const qs = new URLSearchParams({ language: 'fr-FR', append_to_response: 'videos', include_video_language: 'fr,en' });
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (/^[a-f0-9]{32}$/i.test(token)) qs.set('api_key', token);
  else headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${TMDB_BASE}/movie/${id}?${qs}`, { headers, signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`TMDB error ${res.status} for movie ${id}`);
  const data = (await res.json()) as TmdbMovie;

  // Garde-fou : un identifiant erroné dans la sélection ne doit pas afficher un autre film.
  const tmdbYear = Number(data.release_date?.slice(0, 4));
  let movie: Movie | null = null;
  if (tmdbYear === year) {
    const youtube = (data.videos?.results ?? []).filter((v) => v.site === 'YouTube' && v.type === 'Trailer');
    const trailer = youtube.find((v) => v.iso_639_1 === 'fr') ?? youtube.find((v) => v.official) ?? youtube[0];
    movie = {
      id,
      title: data.title || title,
      year,
      poster: data.poster_path ? `${POSTER_BASE}${data.poster_path}` : null,
      trailer: trailer?.key ?? null,
      url: `https://www.themoviedb.org/movie/${id}`,
    };
  } else {
    console.warn(`TMDB: film ${id} écarté (année ${tmdbYear} ≠ ${year} attendue pour « ${title} »)`);
  }

  cache.set(id, { expires: Date.now() + CACHE_MS, movie });
  return movie;
}

export async function getMovies(films: readonly Film[]): Promise<Movie[]> {
  const token = process.env.TMDB_TOKEN;
  if (!token || films.length === 0) return [];

  const results = await Promise.allSettled(films.map((film) => fetchMovie(film, token)));
  return results
    .flatMap((r) => (r.status === 'fulfilled' && r.value ? [r.value] : []))
    .sort((a, b) => a.year - b.year);
}
