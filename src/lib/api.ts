import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

console.log('API_BASE_URL', API_BASE_URL);


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/auth/login";

    }
    return Promise.reject(error);
  }
);

export default api;