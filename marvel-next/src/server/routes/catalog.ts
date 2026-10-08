import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { MARVEL_ID } from '../utils/proxy';
import { publicCache } from '../utils/cache';
import {
  getHome, getCharacter, getCharacterComics, getCharacterExtras, getComic, listCharacters, listComics,
} from '../data';

// Catalogue public : les données Marvel sont publiques, seule la clé d'API reste cachée côté serveur.
// Utilisé par les parties interactives du site (recherche, pagination côté navigateur).
const catalogRoutes = new Hono();

const listQuerySchema = z.object({
  name: z.string().max(100).optional().default(''),
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const idParam = z.object({ id: z.string().regex(MARVEL_ID) });

catalogRoutes.get('/home', async (c) => {
  publicCache(c, 3600);
  return c.json(await getHome());
});

catalogRoutes.get('/characters', zValidator('query', listQuerySchema), async (c) => {
  publicCache(c, 600);
  return c.json(await listCharacters(c.req.valid('query')));
});

catalogRoutes.get('/character/:id', zValidator('param', idParam), async (c) => {
  const character = await getCharacter(c.req.valid('param').id);
  if (!character) return c.json({ error: 'Personnage introuvable' }, 404);
  publicCache(c, 3600);
  return c.json(character);
});

catalogRoutes.get('/character/:id/extras', zValidator('param', idParam), async (c) => {
  publicCache(c, 86_400);
  return c.json(await getCharacterExtras(c.req.valid('param').id));
});

catalogRoutes.get('/comics', zValidator('query', listQuerySchema), async (c) => {
  publicCache(c, 600);
  return c.json(await listComics(c.req.valid('query')));
});

catalogRoutes.get('/comic/:id', zValidator('param', idParam), async (c) => {
  const comic = await getComic(c.req.valid('param').id);
  if (!comic) return c.json({ error: 'Comic introuvable' }, 404);
  publicCache(c, 3600);
  return c.json(comic);
});

catalogRoutes.get('/comics/:id', zValidator('param', idParam), async (c) => {
  publicCache(c, 3600);
  return c.json(await getCharacterComics(c.req.valid('param').id));
});

export default catalogRoutes;
