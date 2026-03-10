import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/auth.api";
import { AuthRequest } from "../types";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const router = useRouter();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: (data: { email: string; password: string }) => authApi.login(data),
        onSuccess: (response) => {
            const { user, token } = response.data;
            setAuth(user, token);
            localStorage.setItem("token", token);
            toast.success("Welcome back!");
            router.push("/projects"); // Or whatever the home page is
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: AuthRequest) => authApi.register(data),
        onSuccess: (response) => {
            const { user, token } = response.data;
            setAuth(user, token);
            localStorage.setItem("token", token);
            toast.success("Account created successfully!");
            router.push("/projects");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Registration failed";
            toast.error(message);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            clearAuth();
            queryClient.clear();
            toast.info("Logged out successfully");
            router.push("/auth/login");
        },
    });

    return {
        loading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
        error: null, // Errors handled by toasts
        login: async (email: string, password: string) => {
            await loginMutation.mutateAsync({ email, password });
        },
        register: async (data: AuthRequest) => {
            await registerMutation.mutateAsync(data);
        },
        logout: async () => {
            await logoutMutation.mutateAsync();
        },
        me: async () => {
            const res = await authApi.me();
            return res.data;
        },
    };
};
