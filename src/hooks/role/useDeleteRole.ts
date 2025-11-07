import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleService } from "@/services/roles/roles.service";

export function useDeleteRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: RoleService.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
