"use client"

import { Staff } from "@/types/staff"
import { useRemoveFromStaff } from "@/hooks/staff/useRemoveFromStaff"
import { useRemoveBranchManager } from "@/hooks/staff/useRemoveBranchManager"
import { useMakeBranchManager } from "@/hooks/staff/useMakeBranchManager"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShieldMinus, UserMinus, ArrowUpCircle } from "lucide-react"
import { toast } from "sonner"

interface StaffListProps {
  staff: Staff[]
}

export function StaffList({ staff }: StaffListProps) {
  const { mutate: removeFromStaff } = useRemoveFromStaff()
  const { mutate: removeBranchManager } = useRemoveBranchManager()
  const { mutate: makeBranchManager } = useMakeBranchManager()

  const handlePromote = (staffMember: Staff) => {
    if (
      confirm(
        `Are you sure you want to promote ${staffMember.name} to Branch Manager of ${staffMember.branch.name}?`
      )
    ) {
      makeBranchManager(
        { userId: staffMember.id, branchId: staffMember.branch.id },
        {
          onSuccess: () => {
            toast.success(`${staffMember.name} promoted to Branch Manager!`)
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || "Failed to promote to branch manager"
            toast.error(errorMessage)
          },
        }
      )
    }
  }

  const handleDemote = (staffMember: Staff) => {
    if (confirm(`Are you sure you want to demote ${staffMember.name} from Branch Manager to Staff?`)) {
      removeBranchManager(staffMember.id, {
        onSuccess: () => {
          toast.success(`${staffMember.name} demoted to staff successfully!`)
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to demote branch manager"
          toast.error(errorMessage)
        },
      })
    }
  }

  const handleRemove = (staffMember: Staff) => {
    const roleText = staffMember.role === "branch_manager" ? "Branch Manager" : "Staff"
    if (
      confirm(
        `Are you sure you want to remove ${staffMember.name} from ${roleText}? They will become a regular user.`
      )
    ) {
      removeFromStaff(staffMember.id, {
        onSuccess: () => {
          toast.success(`${staffMember.name} removed from staff successfully!`)
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "Failed to remove from staff"
          toast.error(errorMessage)
        },
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Members
          </CardTitle>
          <CardDescription>Manage your business staff and branch managers</CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No staff members yet</h3>
              <p className="text-sm text-muted-foreground">
                Add users to your staff to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Staff Role</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.phone}</TableCell>
                    <TableCell>
                      <Badge variant={staffMember.role === "branch_manager" ? "default" : "secondary"}>
                        {staffMember.role === "branch_manager" ? "Branch Manager" : "Staff"}
                      </Badge>
                    </TableCell>
                    <TableCell>{staffMember.staff?.role?.name}</TableCell>
                    <TableCell>{staffMember.branch.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Promote to Branch Manager - Only for staff role */}
                        {staffMember.role === "staff" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePromote(staffMember)}
                            title="Promote to Branch Manager"
                          >
                            <ArrowUpCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}

                        {/* Demote from Branch Manager - Only for branch_manager role */}
                        {staffMember.role === "branch_manager" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDemote(staffMember)}
                            title="Demote to Staff"
                          >
                            <ShieldMinus className="h-4 w-4 text-orange-600" />
                          </Button>
                        )}

                        {/* Remove from Staff */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(staffMember)}
                          title="Remove from Staff"
                        >
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}
