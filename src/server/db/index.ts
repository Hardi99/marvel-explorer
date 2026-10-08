import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Une seule connexion partagée par instance (et conservée entre les rechargements en développement).
const globalForDb = globalThis as unknown as { pool?: Pool };
const pool = globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export const db = drizzle({ client: pool });
