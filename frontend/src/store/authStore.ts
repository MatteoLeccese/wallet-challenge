import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user.interfaces';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          sessionStorage.setItem('wallet_token', token);
        } else {
          sessionStorage.removeItem('wallet_token');
        }
        set({ token });
      },
      login: (user, token) => {
        sessionStorage.setItem('wallet_token', token);
        set({ user, token, loading: false });
      },
      logout: () => {
        sessionStorage.removeItem('wallet_token');
        set({ user: null, token: null });
      },
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
