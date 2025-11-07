import { useQuery } from "@tanstack/react-query";
import { RoleService } from "@/services/roles/roles.service";

export function useRoles(page: number = 1) {
  return useQuery({
    queryKey: ["roles", page],
    queryFn: () => RoleService.index(page),
  });
}
