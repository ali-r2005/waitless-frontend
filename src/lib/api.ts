import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and it's already the retry or the original request was the refresh itself, logout
    if (error.response?.status === 401 && (originalRequest.url === "/refresh" || originalRequest._retry)) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Use a direct axios call to avoid interceptor loops and circular dependencies
        const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = response.data;
        
        const token = data.access_token;
        const user = useAuthStore.getState().user;
        const business = useAuthStore.getState().business;

        // Save the new token
        useAuthStore.getState().setAuth(user as any, token, business as any);
        localStorage.setItem("token", token);

        // Update the authorization header and replay the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect
        useAuthStore.getState().clearAuth();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;