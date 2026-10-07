import { apiFetch } from './client';

interface Thumbnail {
  path: string;
  extension: string;
}

export interface HomeData {
  hero: { _id: string; name: string; alias: string; sound: string; thumbnail: Thumbnail };
  characters: { _id: string; name: string; alias: string; thumbnail: Thumbnail }[];
  comics: { _id: string; title: string; thumbnail: Thumbnail }[];
}

export const getHome = () => apiFetch<HomeData>('/home');
