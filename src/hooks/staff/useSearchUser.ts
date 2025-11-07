import { useQuery } from "@tanstack/react-query";
import { StaffService } from "@/services/staffs/staffs.service";

export function useSearchUser(name: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ["users", "search", name],
    queryFn: () => StaffService.searchUser(name),
    enabled: enabled && name.length >= 2, // Only search if enabled and name has at least 2 characters
  });
}
