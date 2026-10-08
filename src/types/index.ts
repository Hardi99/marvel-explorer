export interface Thumbnail {
  path: string;
  extension: string;
}

export interface Character {
  _id: string;
  name: string;
  description: string;
  thumbnail: Thumbnail;
}

export interface Comic {
  _id: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
}

export interface ApiResponse<T> {
  count: number;
  results: T[];
}

export interface User {
  username: string;
}

export interface Favourite {
  id: number;
  itemId: string;
  itemType: 'character' | 'comic';
  name: string;
  thumbnailPath: string;
  thumbnailExtension: string;
}

export type AddFavouritePayload = Omit<Favourite, 'id'>;
