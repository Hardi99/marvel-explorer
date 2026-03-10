import 'dotenv/config';
import { z } from 'zod';
import { serve } from '@hono/node-server';
import app from './app.js';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  MARVEL_API_KEY: z.string().min(1),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  console.error('Variables d\'environnement manquantes :', env.error.flatten().fieldErrors);
  process.exit(1);
}

serve({ fetch: app.fetch, port: 3000 });
console.log('Server running on http://localhost:3000');
