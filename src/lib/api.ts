import axios, { AxiosInstance } from "axios";
import { getToken, removeToken } from "./token";
import { logout } from "@/store/useAuthStore"; // avoid circular import - see note

export function createApi(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: false, // true if you use cookies across domains
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor: attach token
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor: handle 401 globally
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;
      // If 401 you can attempt refresh token here if your backend supports it
      if (status === 401) {
        // fallback: remove token & force logout
        removeToken();
        // call logout action in store (importing here is okay if you export a function)
        try {
          // optional: trigger an app-wide logout action
          // If circular import is problematic, rework to use an event emitter or set a window flag.
          logout();
        } catch {}
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
