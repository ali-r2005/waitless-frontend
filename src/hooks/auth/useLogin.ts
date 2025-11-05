import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
