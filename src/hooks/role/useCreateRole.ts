import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleService } from "@/services/roles/roles.service";

export function useCreateRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: RoleService.store,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
