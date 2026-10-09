# Marvel Explorer

Catalogue de l'univers Marvel — personnages, comics et films — consultable sans compte, avec des favoris pour les
membres. En ligne sur **https://marvel-explorer-app.vercel.app**.

Une seule application **Next.js 16** : pages rendues côté serveur et Server Actions, déployée sur Vercel, base PostgreSQL Neon.

- **Pages** rendues côté serveur à partir de données en cache (`use cache`) : accueil, listes
  (`/characters`, `/comics`, recherche et pagination par l'URL), fiches (`/character/[id]`, `/comic/[id]`).
- **Server Actions** (`src/server/actions/`) : comptes (inscription, connexion, mot de passe oublié) et favoris,
  avec session par cookie signé (`src/server/session.ts`) et limite anti-abus.
- **Données** : API Marvel (Le Reacteur), films TMDB (sélection dans `src/server/curation.ts`), base Neon
  (Drizzle, `src/server/db/schema.ts`).

## Développement

```bash
cp .env.example .env.local   # puis remplir les valeurs
npm install
npm run dev
```

Vérifications : `npm run lint` et `npx tsc --noEmit`. Schéma de base : `npx drizzle-kit push`.

## Historique

Les versions précédentes (front React/Vite et API Hono hébergée sur Railway) sont conservées dans le tag Git
[`legacy-v2`](https://github.com/Hardi99/marvel-explorer/tree/legacy-v2).

---

Projet de fan non officiel. Data provided by Marvel. © Marvel. Films : This product uses the TMDB API but is not
endorsed or certified by TMDB.
