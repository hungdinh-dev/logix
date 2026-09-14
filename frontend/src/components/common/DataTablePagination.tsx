'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'

export interface DataTablePaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  selectedCount?: number
  pageSizeOptions?: number[]
  itemLabel?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function DataTablePagination({
  currentPage,
  pageSize,
  totalItems,
  selectedCount = 0,
  pageSizeOptions = [10, 20, 30, 50],
  itemLabel = 'mục',
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const from = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const to = Math.min(safeCurrentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground px-1 py-1">
      {/* Selection / Item summary */}
      <div className="flex items-center gap-2">
        <span>
          {selectedCount > 0 ? (
            <strong className="text-foreground">
              Đã chọn {selectedCount} trên {totalItems} {itemLabel}
            </strong>
          ) : (
            <>
              Hiển thị{' '}
              <strong className="text-foreground">
                {from} - {to}
              </strong>{' '}
              trên tổng số <strong className="text-foreground">{totalItems}</strong> {itemLabel}
            </>
          )}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-4">
        {/* Rows per page selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs">Dòng / trang:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              onPageSizeChange(Number(val))
            }}
          >
            <SelectTrigger className="h-8 w-18 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page counter */}
        <div className="font-medium text-foreground">
          Trang {safeCurrentPage} / {totalPages}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => onPageChange(1)}
            disabled={safeCurrentPage === 1}
            title="Trang đầu tiên"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
            disabled={safeCurrentPage === 1}
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => onPageChange(Math.min(totalPages, safeCurrentPage + 1))}
            disabled={safeCurrentPage === totalPages}
            title="Trang kế tiếp"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => onPageChange(totalPages)}
            disabled={safeCurrentPage === totalPages}
            title="Trang cuối cùng"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
