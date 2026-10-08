import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Les images viennent des CDN Marvel et TMDB, déjà redimensionnées (portrait_uncanny, w342) :
      // l'optimisation d'images de Vercel n'apporterait rien et consommerait le quota gratuit.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Anciennes versions et projets annexes présents en local (hors dépôt)
    "marvel-frontend/**",
    "marvel-backend/**",
    "marvel-frontend-v2/**",
    "marvel-backend-v2/**",
    "marvel-backend-graphql/**",
  ]),
]);

export default eslintConfig;
