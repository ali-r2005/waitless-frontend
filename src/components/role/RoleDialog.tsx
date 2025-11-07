"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { roleSchema, RoleInput, Role } from "@/types/role"
import { useCreateRole } from "@/hooks/role/useCreateRole"
import { useUpdateRole } from "@/hooks/role/useUpdateRole"
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

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
}

export function RoleDialog({ open, onOpenChange, role }: RoleDialogProps) {
  const { mutate: createRole, isPending: isCreating } = useCreateRole()
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole()
  const isPending = isCreating || isUpdating

  const form = useForm<RoleInput>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
      })
    } else {
      form.reset({
        name: "",
      })
    }
  }, [role, form])

  const onSubmit = (data: RoleInput) => {
    if (role) {
      updateRole(
        { id: role.id, data },
        {
          onSuccess: () => {
            toast.success("Role updated successfully!")
            onOpenChange(false)
            form.reset()
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data.message || "Failed to update role"
            toast.error(errorMessage)
          },
        }
      )
    } else {
      createRole(data, {
        onSuccess: () => {
          toast.success("Role created successfully!")
          onOpenChange(false)
          form.reset()
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data.message || "Failed to create role"
          toast.error(errorMessage)
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {role
              ? "Update the role information below."
              : "Fill in the details to create a new role."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Administrator" {...field} value={field.value || ""} />
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
                {role ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
