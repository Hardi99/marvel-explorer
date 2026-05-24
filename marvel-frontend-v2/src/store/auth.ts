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
    { name: 'marvel-auth' }
  )
);
