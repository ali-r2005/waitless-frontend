"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { branchSchema, BranchInput, Branch } from "@/types/branch"
import { useCreateBranch } from "@/hooks/branch/useCreateBranch"
import { useUpdateBranch } from "@/hooks/branch/useUpdateBranch"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useBranches } from "@/hooks/branch/useBranches"

interface BranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: Branch | null
}

export function BranchDialog({ open, onOpenChange, branch }: BranchDialogProps) {
  const { mutate: createBranch, isPending: isCreating } = useCreateBranch()
  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch()
  const { data: branchesResponse } = useBranches()
  const isPending = isCreating || isUpdating

  const branches = branchesResponse?.data || []

  // Get all child branches (direct and nested) to exclude from parent selection
  const getChildBranchIds = (parentId: number): number[] => {
    if (!branches.length) return []
    const children = branches.filter(b => b.parent_id === parentId)
    const childIds = children.map(c => c.id)
    // Recursively get nested children
    children.forEach(child => {
      childIds.push(...getChildBranchIds(child.id))
    })
    return childIds
  }

  // Filter branches that can be selected as parent
  const availableParentBranches = branches.filter((b) => {
    if (!branch) return true // When creating, all branches are available
    if (b.id === branch.id) return false // Can't be parent of itself
    const childIds = getChildBranchIds(branch.id)
    return !childIds.includes(b.id) // Exclude all child branches
  })

  const form = useForm<BranchInput>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  })

  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name,
        address: branch.address,
        parent_id: branch.parent_id,
      })
    } else {
      form.reset({
        name: "",
        address: "",
        parent_id: undefined,
      })
    }
  }, [branch, form])

  const onSubmit = (data: BranchInput) => {
    if (branch) {
      updateBranch(
        { id: branch.id, data },
        {
          onSuccess: () => {
            toast.success("Branch updated successfully!")
            onOpenChange(false)
            form.reset()
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data.message || "Failed to update branch"
            toast.error(errorMessage)
          },
        }
      )
    } else {
      createBranch(data, {
        onSuccess: () => {
          toast.success("Branch created successfully!")
          onOpenChange(false)
          form.reset()
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data.message || "Failed to create branch"
          toast.error(errorMessage)
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Create New Branch"}</DialogTitle>
          <DialogDescription>
            {branch
              ? "Update the branch information below."
              : "Fill in the details to create a new branch."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Downtown Branch" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Branch (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? undefined : Number(value))}
                    value={field.value?.toString() || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {availableParentBranches?.map((b) => (
                        <SelectItem key={b.id} value={b.id.toString()}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {branch ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
