import { useAuthStore } from './auth';
import { create } from 'zustand';
import { addFavourite, getFavourites, removeFavourite } from '@/lib/api/favourites';
import type { AddFavouritePayload, Favourite } from '@/lib/api/favourites';

// Favoris du visiteur connecté, chargés une seule fois puis tenus à jour localement
// (remplace TanStack Query, trop lourd pour ce seul usage).
interface FavouritesState {
  items: Favourite[] | null; // null = pas encore chargés
  loading: boolean;
  load: () => Promise<void>;
  add: (payload: AddFavouritePayload) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  reset: () => void;
}

export const useFavouritesStore = create<FavouritesState>()((set, get) => ({
  items: null,
  loading: false,
  load: async () => {
    if (get().loading || get().items) return;
    set({ loading: true });
    try {
      set({ items: await getFavourites() });
    } catch {
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },
  add: async (payload) => {
    await addFavourite(payload);
    // Rechargé depuis le serveur : récupère l'identifiant et l'ordre réels.
    set({ items: await getFavourites() });
  },
  remove: async (itemId) => {
    await removeFavourite(itemId);
    set({ items: (get().items ?? []).filter((f) => f.itemId !== itemId) });
  },
  reset: () => set({ items: null, loading: false }),
}));

// Déconnexion (bouton, ou session expirée détectée par l'API) : on oublie les favoris du compte.
useAuthStore.subscribe((state, previous) => {
  if (previous.isLoggedIn && !state.isLoggedIn) useFavouritesStore.getState().reset();
});
