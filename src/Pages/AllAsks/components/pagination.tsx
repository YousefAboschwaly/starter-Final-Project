"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Convert 0-based currentPage to 1-based for display
    const displayCurrentPage = currentPage + 1

    for (let i = Math.max(1, displayCurrentPage - delta); i <= Math.min(totalPages, displayCurrentPage + delta); i++) {
      range.push(i)
    }

    if (displayCurrentPage - delta > 1) {
      rangeWithDots.push(1)
      if (displayCurrentPage - delta > 2) {
        rangeWithDots.push("...")
      }
    }

    rangeWithDots.push(...range)

    if (displayCurrentPage + delta < totalPages) {
      if (displayCurrentPage + delta < totalPages - 1) {
        rangeWithDots.push("...")
      }
      rangeWithDots.push(totalPages)
    }

    // Remove duplicates
    return rangeWithDots.filter((item, index, arr) => index === 0 || item !== arr[index - 1])
  }

  if (totalPages <= 1) return null

  const displayCurrentPage = currentPage + 1

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 mt-6 md:mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex items-center gap-1 w-full sm:w-auto"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-1 order-first sm:order-none">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 sm:px-3 py-2 text-gray-500 text-sm">...</span>
            ) : (
              <Button
                variant={displayCurrentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange((page as number) - 1)}
                className={`min-w-[32px] sm:min-w-[40px] text-sm ${
                  displayCurrentPage === page ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-50"
                }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex items-center gap-1 w-full sm:w-auto"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
