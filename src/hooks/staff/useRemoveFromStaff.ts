import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StaffService } from "@/services/staffs/staffs.service";

export function useRemoveFromStaff() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => StaffService.remove_from_staff(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
