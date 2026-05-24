export const thumbnailUrl = (path: string, extension: string) =>
  `${path}.${extension}`.replace('http://', 'https://');
