import { useQuery } from "@tanstack/react-query";
import { BranchService } from "@/services/branches/branches.service";

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: BranchService.index,
  });
}
