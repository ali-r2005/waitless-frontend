import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffService } from "@/services/staffs/staffs.service";
import { StaffRequest } from "@/types/staff";

export function useAddToStaff() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: StaffRequest }) =>
      StaffService.add_to_staff(userId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
