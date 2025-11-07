"use client"

import { Branch } from "@/types/branch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GitBranch, Building2 } from "lucide-react"

interface BranchHierarchyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch: Branch
  allBranches: Branch[]
}

interface TreeNodeProps {
  branch: Branch
  allBranches: Branch[]
  level: number
}

function TreeNode({ branch, allBranches, level }: TreeNodeProps) {
  const children = allBranches.filter((b) => b.parent_id === branch.id)
  const hasChildren = children.length > 0

  return (
    <div className="relative">
      <div className="flex items-center gap-2 py-2">
        {/* Indentation */}
        {level > 0 && (
          <div className="flex items-center">
            {Array.from({ length: level }).map((_, i) => (
              <div key={i} className="w-6" />
            ))}
            <div className="w-6 h-6 border-l-2 border-b-2 border-border rounded-bl-md" />
          </div>
        )}
        
        {/* Branch Icon */}
        <div className={`flex items-center justify-center w-8 h-8 rounded-md ${
          hasChildren ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        }`}>
          {hasChildren ? <GitBranch className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
        </div>

        {/* Branch Info */}
        <div className="flex-1">
          <div className="font-medium">{branch.name}</div>
          <div className="text-sm text-muted-foreground">{branch.address}</div>
        </div>

        {/* Children Count Badge */}
        {hasChildren && (
          <div className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {children.length} {children.length === 1 ? 'child' : 'children'}
          </div>
        )}
      </div>

      {/* Render Children */}
      {hasChildren && (
        <div className="ml-3">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              branch={child}
              allBranches={allBranches}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function BranchHierarchyDialog({
  open,
  onOpenChange,
  branch,
  allBranches,
}: BranchHierarchyDialogProps) {
  // Get all descendants (children, grandchildren, etc.)
  const getDescendants = (parentId: number): Branch[] => {
    const children = allBranches.filter((b) => b.parent_id === parentId)
    const descendants: Branch[] = [...children]
    children.forEach((child) => {
      descendants.push(...getDescendants(child.id))
    })
    return descendants
  }

  const descendants = getDescendants(branch.id)
  const hasDescendants = descendants.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branch Hierarchy
          </DialogTitle>
          <DialogDescription>
            {hasDescendants
              ? `Showing the hierarchy tree for "${branch.name}" and its ${descendants.length} descendant${descendants.length === 1 ? '' : 's'}`
              : `"${branch.name}" has no child branches`}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {hasDescendants ? (
            <div className="border rounded-lg p-4 bg-muted/30">
              <TreeNode branch={branch} allBranches={allBranches} level={0} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/30">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Child Branches</h3>
              <p className="text-sm text-muted-foreground">
                This branch doesn&apos;t have any child branches yet.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
