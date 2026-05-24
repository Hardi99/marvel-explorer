import { apiFetch } from './client';

export interface Favourite {
  id: number;
  itemId: string;
  itemType: 'character' | 'comic';
  name: string;
  thumbnailPath: string;
  thumbnailExtension: string;
}

export interface AddFavouritePayload {
  itemId: string;
  itemType: 'character' | 'comic';
  name: string;
  thumbnailPath: string;
  thumbnailExtension: string;
}

export const getFavourites = () =>
  apiFetch<Favourite[]>('/favourites');

export const addFavourite = (payload: AddFavouritePayload) =>
  apiFetch<{ message: string }>('/favourites', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const removeFavourite = (itemId: string) =>
  apiFetch<{ message: string }>(`/favourites/${itemId}`, {
    method: 'DELETE',
  });
