import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { sign } from 'hono/jwt';
import { db } from '../db/index.js';
import { usersTable, signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../db/schema.js';
import { sendWelcomeEmail, sendResetEmail } from '../utils/email.js';
import type { AppVariables } from '../types/context.js';

const JWT_EXPIRY_SECONDS = 60 * 60 * 24; // 24h

const userRoutes = new Hono<{ Variables: AppVariables }>();

userRoutes.post('/user/signup', zValidator('json', signupSchema), async (c) => {
  const { username, email, password } = c.req.valid('json');

  const existing = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.email, email), eq(usersTable.username, username)))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: 'Email ou username déjà utilisé' }, 400);
  }

  const hash = await bcrypt.hash(password, 10);
  await db.insert(usersTable).values({ username, email, hash });

  sendWelcomeEmail(email, username).catch(console.error);

  return c.json({ message: 'Compte créé avec succès' }, 201);
});

userRoutes.post('/user/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return c.json({ error: 'Email ou mot de passe invalide' }, 401);
  }

  const valid = await bcrypt.compare(password, user.hash);
  if (!valid) {
    return c.json({ error: 'Email ou mot de passe invalide' }, 401);
  }

  const token = await sign(
    { userId: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY_SECONDS },
    process.env.JWT_SECRET!
  );

  return c.json({ token, username: user.username });
});

userRoutes.post('/user/forgot-password', zValidator('json', forgotPasswordSchema), async (c) => {
  const { email } = c.req.valid('json');

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  // Réponse identique que l'email existe ou non (sécurité)
  if (!user) {
    return c.json({ message: 'Si cet email existe, un lien a été envoyé.' });
  }

  const token = randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

  await db
    .update(usersTable)
    .set({ resetToken: token, resetTokenExpiry: expiry })
    .where(eq(usersTable.id, user.id));

  sendResetEmail(email, user.username, token).catch(console.error);

  return c.json({ message: 'Si cet email existe, un lien a été envoyé.' });
});

userRoutes.post('/user/reset-password', zValidator('json', resetPasswordSchema), async (c) => {
  const { token, password } = c.req.valid('json');

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.resetToken, token))
    .limit(1);

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return c.json({ error: 'Lien invalide ou expiré.' }, 400);
  }

  const hash = await bcrypt.hash(password, 10);

  await db
    .update(usersTable)
    .set({ hash, resetToken: null, resetTokenExpiry: null })
    .where(eq(usersTable.id, user.id));

  return c.json({ message: 'Mot de passe mis à jour.' });
});

export default userRoutes;
