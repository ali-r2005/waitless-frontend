import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleService } from "@/services/roles/roles.service";
import { RoleForm } from "@/types/role";

export function useUpdateRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleForm }) =>
      RoleService.update(data, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
