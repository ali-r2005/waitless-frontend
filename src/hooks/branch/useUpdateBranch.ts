import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchService } from "@/services/branches/branches.service";
import { BranchForm } from "@/types/branch";

export function useUpdateBranch() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BranchForm }) =>
      BranchService.update(data, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}
