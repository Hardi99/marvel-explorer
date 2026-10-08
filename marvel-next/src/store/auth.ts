import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  username: string | null;
  isLoggedIn: boolean;
  setAuth: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      isLoggedIn: false,
      setAuth: (username) => set({ username, isLoggedIn: true }),
      logout: () => set({ username: null, isLoggedIn: false }),
    }),
    {
      name: 'marvel-auth',
      // Lu après le premier affichage (voir Providers) : le serveur ne connaît pas le
      // localStorage, relire avant provoquerait un écart entre HTML serveur et navigateur.
      skipHydration: true,
    }
  )
);

/** Vrai une fois l'état de connexion relu depuis le localStorage (évite un faux « déconnecté »). */
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
