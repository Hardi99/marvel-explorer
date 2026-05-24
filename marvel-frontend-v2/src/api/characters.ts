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
