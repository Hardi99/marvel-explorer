import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// Session = cookie httpOnly contenant un jeton signé (JWT HS256) : { userId, email }, valable 24 h.
// Même format qu'avant la migration : les sessions déjà ouvertes restent valides.

const COOKIE = 'auth_token';
const MAX_AGE_SECONDS = 60 * 60 * 24;
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function createSession(user: { id: number; email: string }) {
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === 'production',
  });
}

/** Identifiant de l'utilisateur connecté, ou null (pas de cookie, jeton expiré ou falsifié). */
export async function getSessionUserId(): Promise<number | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
    return typeof payload.userId === 'number' ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}
