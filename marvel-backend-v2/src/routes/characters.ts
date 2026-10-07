import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { proxyFetch, MARVEL_ID } from '../utils/proxy.js';
import { publicCache } from '../utils/cache.js';
import { getMovies } from '../utils/tmdb.js';
import { CURATED } from '../curation.js';

// Catalogue public : les données Marvel sont publiques, seule la clé d'API reste cachée côté serveur.
const characterRoutes = new Hono();

const listQuerySchema = z.object({
  name: z.string().max(100).optional().default(''),
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const idParamSchema = z.object({ id: z.string().regex(MARVEL_ID) });

characterRoutes.get('/characters', zValidator('query', listQuerySchema), async (c) => {
  const { name, skip, limit } = c.req.valid('query');
  const data = await proxyFetch('/characters', { name, skip, limit });
  publicCache(c, 600);
  return c.json(data);
});

characterRoutes.get('/character/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const data = await proxyFetch(`/character/${id}`);
  publicCache(c, 3600);
  return c.json(data);
});

// Ce que l'API Marvel ne fournit pas : identité secrète, onomatopée et films (TMDB).
// Personnages hors sélection : tout est vide, le site masque simplement ces éléments.
characterRoutes.get('/character/:id/extras', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const curated = CURATED[id];
  const movies = curated ? await getMovies(curated.films) : [];
  // Cache court si des films étaient attendus mais aucun n'a répondu (TMDB indisponible, jeton absent).
  publicCache(c, curated && movies.length === 0 ? 600 : 86_400);
  return c.json({ alias: curated?.alias ?? null, sound: curated?.sound ?? null, movies });
});

export default characterRoutes;
