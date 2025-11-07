import { useQuery } from "@tanstack/react-query";
import { BranchService } from "@/services/branches/branches.service";

export function useBranches(page: number = 1) {
  return useQuery({
    queryKey: ["branches", page],
    queryFn: () => BranchService.index(page),
  });
}
