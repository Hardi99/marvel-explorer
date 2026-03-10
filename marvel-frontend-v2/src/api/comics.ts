import { apiFetch } from './client';
import type { Comic, ApiResponse } from '../types';

export const getComics = (token: string, params: { name?: string; skip?: number; limit?: number }) => {
  const qs = new URLSearchParams({
    ...(params.name ? { name: params.name } : {}),
    skip: String(params.skip ?? 0),
    limit: String(params.limit ?? 20),
  });
  return apiFetch<ApiResponse<Comic>>(`/comics?${qs}`, token);
};

export const getComic = (token: string, id: string) =>
  apiFetch<Comic>(`/comic/${id}`, token);
