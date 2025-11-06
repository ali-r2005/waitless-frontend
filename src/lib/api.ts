import axios, { AxiosInstance } from "axios";
import { getToken, setToken } from "./token";
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
      const originalRequest = error.config;
      
      // If 401 and not already retried, attempt refresh token
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Attempt to refresh the token
          const refreshRes = await instance.post("/api/refresh");
          const newToken = refreshRes.data.access_token;
          
          // Save new token
          setToken(newToken);
          
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry the original request
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          logout();
          return Promise.reject(refreshError);
        }
      }
      
      // If 401 and already retried, or refresh endpoint itself failed
      if (status === 401) {
        logout();
      }
      
      // For all other errors, just reject without logging out
      return Promise.reject(error);
    }
  );

  return instance;
}
