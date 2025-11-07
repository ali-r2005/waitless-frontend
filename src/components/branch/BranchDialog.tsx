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
import { Loader2 } from "lucide-react"

interface BranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: Branch | null
}

export function BranchDialog({ open, onOpenChange, branch }: BranchDialogProps) {
  const { mutate: createBranch, isPending: isCreating } = useCreateBranch()
  const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch()
  const isPending = isCreating || isUpdating

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
        // parent_id: branch.parent_id,
      })
    } else {
      form.reset({
        name: "",
        address: "",
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
