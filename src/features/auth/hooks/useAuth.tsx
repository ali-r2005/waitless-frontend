import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/auth.api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,

    onSuccess: (data) => {
      const token = data.access_token;
      const user = data.user;
      const business = data.business;

      setAuth(user, token, business);
      localStorage.setItem("token", token);

      toast.success("Welcome back!");
      router.push("/profile");
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,

    onSuccess: (data) => {
      console.log("data of the register mutation", data);
      const token = data.access_token;
      const user = data.user;
      const business = data.business;

      setAuth(user, token, business);
      localStorage.setItem("token", token);

      toast.success("Account created successfully!");
      router.push("/");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Registration failed";

      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      clearAuth();
      queryClient.clear();

      toast.info("Logged out successfully");
      router.push("/auth/login");
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    loading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,

    error: // errore will be handelede by toaster
      loginMutation.error ||
      registerMutation.error ||
      logoutMutation.error,
  };
};