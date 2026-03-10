import { pgTable, serial, varchar, timestamp, pgEnum, integer, unique } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hash: varchar('hash', { length: 255 }).notNull(),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const itemTypeEnum = pgEnum('item_type', ['character', 'comic']);

export const favouritesTable = pgTable('favourites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  itemId: varchar('item_id', { length: 100 }).notNull(),
  itemType: itemTypeEnum('item_type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  thumbnailPath: varchar('thumbnail_path', { length: 500 }).notNull(),
  thumbnailExtension: varchar('thumbnail_extension', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [unique().on(t.userId, t.itemId)]);

export const favouriteSchema = createInsertSchema(favouritesTable).omit({ id: true, userId: true, createdAt: true });

export const signupSchema = createInsertSchema(usersTable).omit({ id: true, hash: true, createdAt: true, resetToken: true, resetTokenExpiry: true }).extend({
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});
