// Formats d'image du CDN Marvel (même image, recadrée et allégée côté serveur) :
// https://developer.marvel.com/documentation/images
// 'portrait_uncanny' = 300×450 : cartes, couvertures et vignettes de l'intro.
export type ThumbnailVariant = 'portrait_uncanny';

export const thumbnailUrl = (path: string, extension: string, variant?: ThumbnailVariant) =>
  `${path}${variant ? `/${variant}` : ''}.${extension}`.replace('http://', 'https://');
