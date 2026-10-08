# Marvel Explorer (Next.js)

Site et API réunis dans une seule application Next.js 16, déployée sur Vercel.

- **Pages** rendues côté serveur à partir de données en cache (`use cache`) : accueil, listes
  (`/characters`, `/comics`, recherche et pagination par l'URL), fiches (`/character/[id]`, `/comic/[id]`).
- **API** Hono sous `/api` (`src/app/api/[[...route]]/route.ts`, code dans `src/server/`) : comptes,
  favoris, catalogue pour les parties interactives.
- **Données** : API Marvel (lereacteur), films TMDB (`src/server/curation.ts`), base PostgreSQL Neon
  (Drizzle, `src/server/db/schema.ts`).

## Développement

```bash
cp .env.example .env.local   # puis remplir les valeurs
npm install
npm run dev
```

Vérifications : `npm run lint` et `npx tsc --noEmit`. Schéma de base : `npx drizzle-kit push`.
