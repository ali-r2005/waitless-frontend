import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffService } from "@/services/staffs/staffs.service";

export function useMakeBranchManager() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, branchId }: { userId: number; branchId: number }) =>
      StaffService.make_staff_branch_manager(userId, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
