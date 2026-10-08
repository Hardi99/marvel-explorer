import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import { sign } from 'hono/jwt';
import { setCookie, deleteCookie } from 'hono/cookie';
import { db } from '../db/index';
import { usersTable, signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../db/schema';
import { sendWelcomeEmail, sendResetEmail } from '../utils/email';
import type { AppVariables } from '../types/context';

const JWT_EXPIRY_SECONDS = 60 * 60 * 24; // 24h

// Hash factice comparé quand l'e-mail est inconnu : la réponse prend le même temps
// qu'un mauvais mot de passe, on ne peut donc pas deviner quels comptes existent.
const DUMMY_HASH = bcrypt.hashSync('marvel-explorer-timing-guard', 10);

// Le jeton de réinitialisation n'est stocké qu'en empreinte : une fuite de la base
// ne permet pas de changer le mot de passe des comptes.
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

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

  const valid = await bcrypt.compare(password, user?.hash ?? DUMMY_HASH);
  if (!user || !valid) {
    return c.json({ error: 'Email ou mot de passe invalide' }, 401);
  }

  const token = await sign(
    { userId: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY_SECONDS },
    process.env.JWT_SECRET!
  );

  // Le front appelle l'API via sa propre adresse (/api, redirigé par Vercel) : le cookie est
  // interne au site, donc `Lax` suffit et Safari ne le bloque plus comme cookie tiers.
  setCookie(c, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: JWT_EXPIRY_SECONDS,
    secure: process.env.NODE_ENV === 'production',
  });

  return c.json({ username: user.username });
});

userRoutes.post('/user/logout', (c) => {
  deleteCookie(c, 'auth_token', { path: '/' });
  return c.json({ message: 'Déconnecté' });
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
    .set({ resetToken: hashToken(token), resetTokenExpiry: expiry })
    .where(eq(usersTable.id, user.id));

  sendResetEmail(email, user.username, token).catch(console.error);

  return c.json({ message: 'Si cet email existe, un lien a été envoyé.' });
});

userRoutes.post('/user/reset-password', zValidator('json', resetPasswordSchema), async (c) => {
  const { token, password } = c.req.valid('json');

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.resetToken, hashToken(token)))
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
