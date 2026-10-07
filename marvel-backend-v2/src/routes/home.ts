import { Hono } from 'hono';
import { proxyFetch } from '../utils/proxy.js';
import { publicCache } from '../utils/cache.js';
import { CURATED, HEROES_OF_THE_DAY, FEATURED_CHARACTERS, FEATURED_COMICS } from '../curation.js';

type Thumbnail = { path: string; extension: string };
type MarvelItem = { _id: string; thumbnail: Thumbnail };

export interface HomePayload {
  hero: { _id: string; name: string; alias: string; sound: string; thumbnail: Thumbnail };
  characters: { _id: string; name: string; alias: string; thumbnail: Thumbnail }[];
  comics: { _id: string; title: string; thumbnail: Thumbnail }[];
}

const CACHE_MS = 6 * 60 * 60 * 1000;
let cache: { day: number; expires: number; payload: HomePayload } | null = null;

async function buildHome(day: number): Promise<HomePayload> {
  const heroId = HEROES_OF_THE_DAY[day % HEROES_OF_THE_DAY.length]!;
  const pick = CURATED[heroId]!;
  const thumbnailOf = async (path: string) => ((await proxyFetch(path)) as MarvelItem).thumbnail;

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

const homeRoutes = new Hono();

// Une seule requête pour tout l'accueil, gardée en mémoire 6 h : 18 appels à
// l'API externe au plus par jour et par "héros du jour", au lieu de 18 par visiteur.
homeRoutes.get('/home', async (c) => {
  const day = Math.floor(Date.now() / 86_400_000);
  if (!cache || cache.day !== day || cache.expires < Date.now()) {
    cache = { day, expires: Date.now() + CACHE_MS, payload: await buildHome(day) };
  }
  publicCache(c, 3600);
  return c.json(cache.payload);
});

export default homeRoutes;
