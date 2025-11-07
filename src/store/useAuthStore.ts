import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { setToken as saveTokenToStorage, removeToken } from "@/lib/token";
import { AuthService } from "@/services/auth/auth.service";

type User = { id: string; name: string; email: string } | null;

type AuthState = {
  token: string | null;
  user: User;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: typeof window !== "undefined" ? localStorage.getItem("app_token") : null,
        user: null,
        setAuth: (token, user) => {
          saveTokenToStorage(token);
          set({ token, user });
        },
        clearAuth: () => {
          removeToken();
          set({ token: null, user: null });
        },
      }),
      { name: "auth-storage" }
    )
  )
);

// helper exported for api.ts to call on 401 without circular imports:
export function logout() {
  // AuthService.logout();
  const store = useAuthStore.getState();
  store.clearAuth();
}
