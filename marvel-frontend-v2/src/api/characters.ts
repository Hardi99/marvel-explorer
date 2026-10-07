import { apiFetch } from './client';
import type { Character, ApiResponse } from '../types';

export const getCharacters = (params: { name?: string; skip?: number; limit?: number }) => {
  const qs = new URLSearchParams({
    ...(params.name ? { name: params.name } : {}),
    skip: String(params.skip ?? 0),
    limit: String(params.limit ?? 20),
  });
  return apiFetch<ApiResponse<Character>>(`/characters?${qs}`);
};

export const getCharacter = (id: string) =>
  apiFetch<Character>(`/character/${id}`);

export const getComicsByCharacter = (characterId: string) =>
  apiFetch<ApiResponse<import('../types').Comic>>(`/comics/${characterId}`);

export interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string | null;
  /** Identifiant de vidéo YouTube de la bande-annonce. */
  trailer: string | null;
  url: string;
}

export interface CharacterExtras {
  alias: string | null;
  sound: string | null;
  movies: Movie[];
}

/** Identité secrète, onomatopée et films (TMDB) : vides pour les personnages hors sélection. */
export const getCharacterExtras = (id: string) =>
  apiFetch<CharacterExtras>(`/character/${id}/extras`);
