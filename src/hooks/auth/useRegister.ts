import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export function useRegisterUser() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: AuthService.registerUser,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegisterBusinessOwner() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: AuthService.registerBusinessOwner,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
