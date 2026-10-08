import type { MetadataRoute } from 'next';
import { FEATURED_CHARACTER_IDS, FEATURED_COMIC_IDS } from '@/server/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marvel-explorer-app.vercel.app';

// Plan du site : pages principales et fiches mises en avant. Les autres fiches sont
// découvertes par Google en suivant les liens des listes (désormais rendues côté serveur).
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${SITE_URL}${path}`, priority });
  return [
    page('/', 1),
    page('/characters', 0.9),
    page('/comics', 0.9),
    ...FEATURED_CHARACTER_IDS.map((id) => page(`/character/${id}`, 0.8)),
    ...FEATURED_COMIC_IDS.map((id) => page(`/comic/${id}`, 0.7)),
    page('/mentions-legales', 0.1),
    page('/confidentialite', 0.1),
  ];
}
