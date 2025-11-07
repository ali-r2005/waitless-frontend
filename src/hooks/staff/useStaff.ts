import { useQuery } from "@tanstack/react-query";
import { StaffService } from "@/services/staffs/staffs.service";

export function useStaff(page: number = 1) {
  return useQuery({
    queryKey: ["staff", page],
    queryFn: () => StaffService.get_staff(page),
  });
}
