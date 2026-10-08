// Next.js charge .env.local ; drizzle-kit non : on le lit ici.
try {
  process.loadEnvFile('.env.local');
} catch {
  // Variables déjà présentes dans l'environnement.
}
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
