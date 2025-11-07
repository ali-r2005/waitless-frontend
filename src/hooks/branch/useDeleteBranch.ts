import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchService } from "@/services/branches/branches.service";

export function useDeleteBranch() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: BranchService.destroy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}
