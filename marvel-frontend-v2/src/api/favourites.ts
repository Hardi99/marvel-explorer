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

export const getFavourites = (token: string) =>
  apiFetch<Favourite[]>('/favourites', token);

export const addFavourite = (token: string, payload: AddFavouritePayload) =>
  apiFetch<{ message: string }>('/favourites', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const removeFavourite = (token: string, itemId: string) =>
  apiFetch<{ message: string }>(`/favourites/${itemId}`, token, {
    method: 'DELETE',
  });
