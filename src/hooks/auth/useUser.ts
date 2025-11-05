import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth/auth.service";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: AuthService.me,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
