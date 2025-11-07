"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { addStaffSchema, AddStaffInput } from "@/types/staff"
import { useSearchUser } from "@/hooks/staff/useSearchUser"
import { useAddToStaff } from "@/hooks/staff/useAddToStaff"
import { useRoles } from "@/hooks/role/useRoles"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2, Search, UserPlus } from "lucide-react"

interface AddStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStaffDialog({ open, onOpenChange }: AddStaffDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string>("")
  const [enableSearch, setEnableSearch] = useState(false)

  const { data: searchResults, isLoading: isSearching } = useSearchUser(searchQuery, enableSearch)
  const { mutate: addToStaff, isPending: isAdding } = useAddToStaff()
  const { data: rolesResponse } = useRoles(1)
  const { data: branchesResponse } = useBranches(1)

  const roles = rolesResponse?.data || []
  const branches = branchesResponse?.data || []

  const form = useForm<AddStaffInput>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      role_id: 0,
      branch_id: 0,
    },
  })

  const handleDialogClose = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      setSearchQuery("")
      setSelectedUserId(null)
      setSelectedUserName("")
      setEnableSearch(false)
      form.reset()
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      setEnableSearch(true)
    } else {
      toast.error("Please enter at least 2 characters to search")
    }
  }

  const handleSelectUser = (userId: number, userName: string) => {
    setSelectedUserId(userId)
    setSelectedUserName(userName)
    setEnableSearch(false)
  }

  const onSubmit = (data: AddStaffInput) => {
    if (!selectedUserId) {
      toast.error("Please search and select a user first")
      return
    }

    addToStaff(
      { userId: selectedUserId, data },
      {
        onSuccess: () => {
          toast.success(`${selectedUserName} added to staff successfully!`)
          handleDialogClose(false)
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to add user to staff"
          toast.error(errorMessage)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add User to Staff
          </DialogTitle>
          <DialogDescription>
            Search for a user and assign them a role and branch
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Search Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search User</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter user name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || searchQuery.trim().length < 2}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Search Results */}
            {enableSearch && searchResults && searchResults.data.length > 0 && (
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
                {searchResults.data.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user.id, user.name)}
                    className="w-full text-left p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </button>
                ))}
              </div>
            )}

            {enableSearch && searchResults && searchResults.data.length === 0 && (
              <p className="text-sm text-muted-foreground">No users found</p>
            )}

            {/* Selected User Display */}
            {selectedUserId && (
              <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
                <p className="text-sm font-medium">Selected User:</p>
                <p className="text-sm text-muted-foreground">{selectedUserName}</p>
              </div>
            )}
          </div>

          {/* Staff Assignment Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value > 0 ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value > 0 ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
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
                  onClick={() => handleDialogClose(false)}
                  disabled={isAdding}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding || !selectedUserId}>
                  {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add to Staff
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
