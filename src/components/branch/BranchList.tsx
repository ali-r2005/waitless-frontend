"use client"

import { useState } from "react"
import { Branch } from "@/types/branch"
import { useDeleteBranch } from "@/hooks/branch/useDeleteBranch"
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
import { BranchDialog } from "./BranchDialog"
import { BranchHierarchyDialog } from "./BranchHierarchyDialog"
import { Edit, Trash2, Plus, MapPin, GitBranch } from "lucide-react"
import { toast } from "sonner"

interface BranchListProps {
  branches: Branch[]
}

export function BranchList({ branches }: BranchListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [hierarchyDialogOpen, setHierarchyDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const { mutate: deleteBranch } = useDeleteBranch()

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedBranch(null)
    setDialogOpen(true)
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteBranch(id, {
        onSuccess: () => {
          toast.success("Branch deleted successfully!")
        },
        onError: (error: Error) => {
          const errorMessage = error?.message || "Failed to delete branch"
          toast.error(errorMessage)
        },
      })
    }
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setSelectedBranch(null)
    }
  }

  const handleViewHierarchy = (branch: Branch) => {
    setSelectedBranch(branch)
    setHierarchyDialogOpen(true)
  }

  const handleHierarchyDialogClose = (open: boolean) => {
    setHierarchyDialogOpen(open)
    if (!open) {
      setSelectedBranch(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Branches
            </CardTitle>
            <CardDescription>Manage your business branches</CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </CardHeader>
        <CardContent>
          {branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No branches yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first branch
              </p>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>{branch.address}</TableCell>
                    <TableCell>
                      {new Date(branch.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewHierarchy(branch)}
                          title="View hierarchy"
                        >
                          <GitBranch className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(branch)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(branch.id, branch.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      <BranchDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        branch={selectedBranch}
      />

      {selectedBranch && (
        <BranchHierarchyDialog
          open={hierarchyDialogOpen}
          onOpenChange={handleHierarchyDialogClose}
          branch={selectedBranch}
          allBranches={branches}
        />
      )}
    </>
  )
}
