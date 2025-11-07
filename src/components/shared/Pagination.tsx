"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  total?: number
  perPage?: number
}

export function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  total,
  perPage,
}: PaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < lastPage

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5 // Maximum number of page buttons to show

    if (lastPage <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(lastPage - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < lastPage - 2) {
        pages.push("...")
      }

      // Always show last page
      pages.push(lastPage)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Info Section */}
      <div className="text-sm text-muted-foreground">
        {total !== undefined && perPage !== undefined && (
          <span>
            Showing {Math.min((currentPage - 1) * perPage + 1, total)} to{" "}
            {Math.min(currentPage * perPage, total)} of {total} results
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon-sm"
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(lastPage)}
          disabled={!canGoNext}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
