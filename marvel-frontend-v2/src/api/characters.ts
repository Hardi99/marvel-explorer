import { apiFetch } from './client';
import type { Character, ApiResponse } from '../types';

export const getCharacters = (token: string, params: { name?: string; skip?: number; limit?: number }) => {
  const qs = new URLSearchParams({
    ...(params.name ? { name: params.name } : {}),
    skip: String(params.skip ?? 0),
    limit: String(params.limit ?? 20),
  });
  return apiFetch<ApiResponse<Character>>(`/characters?${qs}`, token);
};

export const getCharacter = (token: string, id: string) =>
  apiFetch<Character>(`/character/${id}`, token);

export const getComicsByCharacter = (token: string, characterId: string) =>
  apiFetch<ApiResponse<import('../types').Comic>>(`/comics/${characterId}`, token);
