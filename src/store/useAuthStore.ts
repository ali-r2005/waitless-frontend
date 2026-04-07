import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Business } from '@/types';

interface AuthState {
  user: User | null;
  business: Business | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, business: Business) => void;
  isLoading: boolean;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      business: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, token, business) => set({ user, token, business, isAuthenticated: true, isLoading: false }),
      clearAuth: () => {
        localStorage.removeItem('token');
        set({ user: null, business: null, token: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'auth-storage-v1',
    }
  )
);
