import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

const cookieStorage = {
  getItem: (name: string): string | null => Cookies.get(name) ?? null,
  setItem: (name: string, value: string): void =>
    void Cookies.set(name, value, { expires: 15, sameSite: 'strict' }),
  removeItem: (name: string): void => Cookies.remove(name),
};

interface AuthState {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      setAuth: (token, username) => set({ token, username }),
      logout: () => set({ token: null, username: null }),
    }),
    {
      name: 'marvel-auth',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
