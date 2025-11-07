import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffService } from "@/services/staffs/staffs.service";

export function useRemoveBranchManager() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => StaffService.remove_staff_branch_manager(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
