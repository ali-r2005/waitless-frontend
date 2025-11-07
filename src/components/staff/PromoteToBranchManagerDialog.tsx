"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Staff } from "@/types/staff"
import { useMakeBranchManager } from "@/hooks/staff/useMakeBranchManager"
import { useBranches } from "@/hooks/branch/useBranches"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, ShieldCheck } from "lucide-react"

interface PromoteToBranchManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: Staff | null
}

export function PromoteToBranchManagerDialog({
  open,
  onOpenChange,
  staff,
}: PromoteToBranchManagerDialogProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<number>(0)
  const { mutate: makeBranchManager, isPending } = useMakeBranchManager()
  const { data: branchesResponse } = useBranches(1)

  const branches = branchesResponse?.data || []

  const handlePromote = () => {
    if (!staff || selectedBranchId === 0) {
      toast.error("Please select a branch")
      return
    }

    makeBranchManager(
      { userId: staff.id, branchId: selectedBranchId },
      {
        onSuccess: () => {
          toast.success(`${staff.name} promoted to Branch Manager!`)
          onOpenChange(false)
          setSelectedBranchId(0)
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to promote to branch manager"
          toast.error(errorMessage)
        },
      }
    )
  }

  const handleDialogClose = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      setSelectedBranchId(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Promote to Branch Manager
          </DialogTitle>
          <DialogDescription>
            Select a branch for {staff?.name} to manage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Branch</label>
            <Select
              value={selectedBranchId > 0 ? selectedBranchId.toString() : ""}
              onValueChange={(value) => setSelectedBranchId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleDialogClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handlePromote} disabled={isPending || selectedBranchId === 0}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Promote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
