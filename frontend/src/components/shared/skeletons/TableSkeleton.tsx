import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TableRow, TableCell } from '@/components/ui/table'

export interface TableSkeletonProps {
  rows?: number
  cols?: number
  hasCheckbox?: boolean
  hasActionColumn?: boolean
  className?: string
}

export function TableSkeleton({
  rows = 5,
  cols = 6,
  hasCheckbox = false,
  hasActionColumn = true,
  className = '',
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <TableRow key={rIdx} className={className} aria-busy="true">
          {Array.from({ length: cols }).map((_, cIdx) => {
            const isCheckbox = hasCheckbox && cIdx === 0
            const isTitle = (hasCheckbox && cIdx === 1) || (!hasCheckbox && cIdx === 0)
            const isLast = cIdx === cols - 1 && hasActionColumn

            if (isCheckbox) {
              return (
                <TableCell key={cIdx} className="pl-4 py-3.5 w-10">
                  <Skeleton className="h-4 w-4 rounded" />
                </TableCell>
              )
            }

            if (isTitle) {
              return (
                <TableCell key={cIdx} className="p-3.5">
                  <Skeleton className="h-5 w-44 mb-1.5" />
                  <Skeleton className="h-3.5 w-24" />
                </TableCell>
              )
            }

            if (isLast) {
              return (
                <TableCell key={cIdx} className="p-3.5 text-right pr-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </TableCell>
              )
            }

            return (
              <TableCell key={cIdx} className="p-3.5">
                <Skeleton className="h-4 w-24 rounded-md" />
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </>
  )
}

