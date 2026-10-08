import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';
import { db } from '../db/index';
import { favouritesTable, favouriteSchema } from '../db/schema';
import type { AppVariables } from '../types/context';

const favouriteRoutes = new Hono<{ Variables: AppVariables }>();

// Limité aux chemins /favourites : un `use()` sans chemin s'appliquerait à toutes les routes
// montées après (et transformerait chaque 404 en 401).
favouriteRoutes.use('/favourites', authMiddleware);
favouriteRoutes.use('/favourites/*', authMiddleware);

favouriteRoutes.get('/favourites', async (c) => {
  const userId = c.get('userId');

  const favourites = await db
    .select()
    .from(favouritesTable)
    .where(eq(favouritesTable.userId, userId))
    .orderBy(favouritesTable.createdAt);

  return c.json(favourites);
});

favouriteRoutes.post('/favourites', zValidator('json', favouriteSchema), async (c) => {
  const userId = c.get('userId');
  const body = c.req.valid('json');

  try {
    await db.insert(favouritesTable).values({ userId, ...body });
    return c.json({ message: 'Ajouté aux favoris' }, 201);
  } catch (err) {
    if ((err as { code?: string }).code === '23505') {
      return c.json({ error: 'Déjà dans les favoris' }, 409);
    }
    throw err;
  }
});

favouriteRoutes.delete('/favourites/:itemId', async (c) => {
  const userId = c.get('userId');
  const { itemId } = c.req.param();

  await db
    .delete(favouritesTable)
    .where(and(eq(favouritesTable.userId, userId), eq(favouritesTable.itemId, itemId)));

  return c.json({ message: 'Retiré des favoris' });
});

export default favouriteRoutes;
