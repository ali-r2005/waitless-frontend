import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchService } from "@/services/branches/branches.service";

export function useCreateBranch() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: BranchService.store,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}
