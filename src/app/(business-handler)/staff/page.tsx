"use client"

import { useState, useMemo } from "react"
import { useStaff } from "@/hooks/staff/useStaff"
import { useBranches } from "@/hooks/branch/useBranches"
import { StaffList } from "@/components/staff/StaffList"
import { AddStaffDialog } from "@/components/staff/AddStaffDialog"
import { Pagination } from "@/components/shared/Pagination"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, UserPlus, Filter, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function StaffPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  
  const { data, isLoading, error } = useStaff(currentPage)
  const { data: branchesResponse } = useBranches(1)

  const branches = branchesResponse?.data || []

  // Get unique business roles from staff data
  const businessRoles = useMemo(() => {
    if (!data?.data) return []
    const rolesMap = new Map<number, { id: number; name: string }>()
    data.data.forEach(staff => {
      if (staff.staff?.role) {
        rolesMap.set(staff.staff.role.id, {
          id: staff.staff.role.id,
          name: staff.staff.role.name
        })
      }
    })
    return Array.from(rolesMap.values())
  }, [data])

  // Filter staff based on selected branch and business role
  const filteredStaff = useMemo(() => {
    if (!data?.data) return []
    
    let filtered = data.data

    // Filter by branch
    if (selectedBranch !== "all") {
      filtered = filtered.filter(staff => staff.branch.id === Number(selectedBranch))
    }

    // Filter by business role
    if (selectedRole !== "all") {
      filtered = filtered.filter(staff => staff.staff?.role?.id === Number(selectedRole))
    }

    return filtered
  }, [data, selectedBranch, selectedRole])

  const handleClearFilters = () => {
    setSelectedBranch("all")
    setSelectedRole("all")
  }

  const hasActiveFilters = selectedBranch !== "all" || selectedRole !== "all"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load staff members. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your business staff and branch managers
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Branch Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Branch:</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Business Role Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Business Role:</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {businessRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-muted-foreground">
              Showing {filteredStaff.length} of {data?.data.length || 0} staff members
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <StaffList staff={filteredStaff} />

      {/* Pagination */}
      {data && data.pagination.last_page > 1 && (
        <Pagination
          currentPage={data.pagination.current_page}
          lastPage={data.pagination.last_page}
          total={data.pagination.total}
          perPage={data.pagination.per_page}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Staff Dialog */}
      <AddStaffDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  )
}
