'use server';

import { and, asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { favouritesTable, favouriteSchema } from '../db/schema';
import { getSessionUserId } from '../session';
import { fail, ok, type ActionResult } from './result';
import type { Favourite } from '@/types';

// Favoris du visiteur connecté. La session est revérifiée dans chaque action : une action
// est joignable directement, la protection de la page ne suffit pas. Chaque requête est
// filtrée sur l'utilisateur de la session (on ne touche jamais aux favoris d'un autre).

const NOT_LOGGED_IN = 'Connecte-toi pour gérer tes favoris.';
const itemIdSchema = z.string().regex(/^[a-f0-9]{24}$/);

export async function listFavouritesAction(): Promise<ActionResult<Favourite[]>> {
  const userId = await getSessionUserId();
  if (!userId) return fail(NOT_LOGGED_IN, 'unauthorized');

  const rows = await db
    .select({
      id: favouritesTable.id,
      itemId: favouritesTable.itemId,
      itemType: favouritesTable.itemType,
      name: favouritesTable.name,
      thumbnailPath: favouritesTable.thumbnailPath,
      thumbnailExtension: favouritesTable.thumbnailExtension,
    })
    .from(favouritesTable)
    .where(eq(favouritesTable.userId, userId))
    .orderBy(asc(favouritesTable.createdAt));
  return ok(rows);
}

export async function addFavouriteAction(input: unknown): Promise<ActionResult> {
  const userId = await getSessionUserId();
  if (!userId) return fail(NOT_LOGGED_IN, 'unauthorized');

  const parsed = favouriteSchema.safeParse(input);
  if (!parsed.success) return fail('Favori invalide.', 'invalid');

  // Déjà présent : sans erreur (double clic, deux onglets).
  await db.insert(favouritesTable).values({ userId, ...parsed.data }).onConflictDoNothing();
  return ok(null);
}

export async function removeFavouriteAction(itemId: unknown): Promise<ActionResult> {
  const userId = await getSessionUserId();
  if (!userId) return fail(NOT_LOGGED_IN, 'unauthorized');

  const parsed = itemIdSchema.safeParse(itemId);
  if (!parsed.success) return fail('Favori invalide.', 'invalid');

  await db
    .delete(favouritesTable)
    .where(and(eq(favouritesTable.userId, userId), eq(favouritesTable.itemId, parsed.data)));
  return ok(null);
}
