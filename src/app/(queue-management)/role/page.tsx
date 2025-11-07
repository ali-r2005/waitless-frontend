"use client"

import { useState } from "react"
import { useRoles } from "@/hooks/role/useRoles"
import { RoleList } from "@/components/role/RoleList"
import { Pagination } from "@/components/shared/Pagination"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RolePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, error } = useRoles(currentPage)

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
            Failed to load roles. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-4">
      <RoleList roles={data?.data || []} />
      
      {data && data.pagination.last_page > 1 && (
        <Pagination
          currentPage={data.pagination.current_page}
          lastPage={data.pagination.last_page}
          total={data.pagination.total}
          perPage={data.pagination.per_page}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
