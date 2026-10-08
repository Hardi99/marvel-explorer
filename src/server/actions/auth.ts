'use server';

import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { db } from '../db';
import { usersTable, signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../db/schema';
import { sendWelcomeEmail, sendResetEmail } from '../utils/email';
import { createSession, deleteSession } from '../session';
import { clientIp, isRateLimited } from '../rate-limit';
import { fail, ok, type ActionResult } from './result';

// Comptes : inscription, connexion, déconnexion, mot de passe oublié.
// Chaque action est aussi joignable directement (POST) : on valide toujours les données ici.

const MIN = 60 * 1000;

// Hash factice comparé quand l'e-mail est inconnu : la réponse prend le même temps
// qu'un mauvais mot de passe, on ne peut donc pas deviner quels comptes existent.
const DUMMY_HASH = bcrypt.hashSync('marvel-explorer-timing-guard', 10);

// Le jeton de réinitialisation n'est stocké qu'en empreinte : une fuite de la base
// ne permet pas de changer le mot de passe des comptes.
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

const TOO_MANY = 'Trop de tentatives. Réessaie dans quelques minutes.';

export async function signupAction(input: unknown): Promise<ActionResult> {
  if (isRateLimited(`signup:${await clientIp()}`, 5, 60 * MIN)) return fail(TOO_MANY, 'rate_limited');

  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    const message =
      field === 'username' ? 'Nom d’utilisateur : 3 à 30 lettres, chiffres, « _ », « . » ou « - ».'
      : field === 'email' ? 'Adresse e-mail invalide.'
      : field === 'password' ? 'Mot de passe : 8 caractères minimum.'
      : 'Données invalides.';
    return fail(message, 'invalid');
  }
  const { username, email, password } = parsed.data;

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(or(eq(usersTable.email, email), eq(usersTable.username, username)))
    .limit(1);
  if (existing) return fail('Email ou nom d’utilisateur déjà utilisé.', 'invalid');

  const hash = await bcrypt.hash(password, 10);
  await db.insert(usersTable).values({ username, email, hash });
  sendWelcomeEmail(email, username).catch(console.error);
  return ok(null);
}

export async function loginAction(input: unknown): Promise<ActionResult<{ username: string }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail('Email ou mot de passe invalide.', 'invalid');
  const { email, password } = parsed.data;

  // Double limite : par visiteur (IP) et par compte visé (e-mail), quelle que soit l'IP.
  const ip = await clientIp();
  if (isRateLimited(`login:ip:${ip}`, 10, 15 * MIN) || isRateLimited(`login:email:${email.toLowerCase()}`, 8, 15 * MIN)) {
    return fail(TOO_MANY, 'rate_limited');
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  const valid = await bcrypt.compare(password, user?.hash ?? DUMMY_HASH);
  if (!user || !valid) return fail('Email ou mot de passe invalide.', 'invalid');

  await createSession(user);
  return ok({ username: user.username });
}

export async function logoutAction(): Promise<ActionResult> {
  await deleteSession();
  return ok(null);
}

export async function forgotPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return fail('Adresse e-mail invalide.', 'invalid');
  const { email } = parsed.data;

  if (isRateLimited(`forgot:ip:${await clientIp()}`, 5, 60 * MIN) || isRateLimited(`forgot:email:${email.toLowerCase()}`, 3, 60 * MIN)) {
    return fail(TOO_MANY, 'rate_limited');
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  // Même réponse que l'e-mail existe ou non : on ne révèle pas quels comptes existent.
  if (user) {
    const token = randomBytes(32).toString('hex');
    await db
      .update(usersTable)
      .set({ resetToken: hashToken(token), resetTokenExpiry: new Date(Date.now() + 60 * MIN) })
      .where(eq(usersTable.id, user.id));
    sendResetEmail(email, user.username, token).catch(console.error);
  }
  return ok(null);
}

export async function resetPasswordAction(input: unknown): Promise<ActionResult> {
  if (isRateLimited(`reset:${await clientIp()}`, 10, 15 * MIN)) return fail(TOO_MANY, 'rate_limited');

  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return fail('Lien invalide ou mot de passe trop court (8 caractères minimum).', 'invalid');
  const { token, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.resetToken, hashToken(token))).limit(1);
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return fail('Lien invalide ou expiré.', 'invalid');
  }

  await db
    .update(usersTable)
    .set({ hash: await bcrypt.hash(password, 10), resetToken: null, resetTokenExpiry: null })
    .where(eq(usersTable.id, user.id));
  return ok(null);
}
