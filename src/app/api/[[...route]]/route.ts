import { handle } from 'hono/vercel';
import app from '@/server/app';

// Toute l'API (/api/*) est servie par l'application Hono.
const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
