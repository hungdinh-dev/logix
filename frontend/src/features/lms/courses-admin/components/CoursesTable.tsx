'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/shared/skeletons'
import { BookOpen, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { CourseTableRow } from './CourseTableRow'
import type { BackendCourse } from '@/features/lms/types/course.types'
import type {
  ColumnVisibility,
  CourseStatus,
  ProgressionMode,
  SortField,
  SortDirection,
} from '../types/courses-admin.types'

interface CoursesTableProps {
  courses: BackendCourse[]
  isLoading: boolean
  isAllPageSelected: boolean
  selectedCourseIds: string[]
  columnVisibility: ColumnVisibility
  sortField: SortField
  sortDirection: SortDirection
  hasActiveFilters: boolean
  onToggleSelectAllPage: () => void
  onToggleSelectRow: (id: string) => void
  onSort: (field: SortField) => void
  onResetFilters: () => void
  onNavigate: (path: string) => void
  onRequestStatusChange: (course: BackendCourse, nextStatus: CourseStatus) => void
  onRequestProgressionChange: (course: BackendCourse, nextMode: ProgressionMode) => void
  onRequestClone: (course: BackendCourse) => void
  onRequestDelete: (course: BackendCourse) => void
}

export function    CoursesTable({
  courses,
  isLoading,
  isAllPageSelected,
  selectedCourseIds,
  columnVisibility,
  sortField,
  sortDirection,
  hasActiveFilters,
  onToggleSelectAllPage,
  onToggleSelectRow,
  onSort,
  onResetFilters,
  onNavigate,
  onRequestStatusChange,
  onRequestProgressionChange,
  onRequestClone,
  onRequestDelete,
}: CoursesTableProps) {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-40" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    )
  }

  const visibleColumnCount =
    1 + // Checkbox
    1 + // Tên Khóa Học
    (columnVisibility.code ? 1 : 0) +
    (columnVisibility.category ? 1 : 0) +
    (columnVisibility.type ? 1 : 0) +
    (columnVisibility.progression ? 1 : 0) +
    (columnVisibility.status ? 1 : 0) +
    (columnVisibility.enrollment ? 1 : 0) +
    (columnVisibility.updatedAt ? 1 : 0) +
    (columnVisibility.actions ? 1 : 0)

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent border-b">
            {/* Checkbox All */}
            <TableHead className="w-10 pl-4 py-3">
              <Checkbox
                checked={isAllPageSelected}
                onCheckedChange={onToggleSelectAllPage}
                aria-label="Chọn tất cả khóa học trên trang"
                className="cursor-pointer"
              />
            </TableHead>

            {/* Tên Khóa Học (Sortable) */}
            <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
              <button
                type="button"
                onClick={() => onSort('title')}
                className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer text-left font-semibold"
              >
                <span>Tên Khóa Học</span>
                {renderSortIcon('title')}
              </button>
            </TableHead>

            {/* Mã Khóa */}
            {columnVisibility.code && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                <button
                  type="button"
                  onClick={() => onSort('code')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer font-semibold"
                >
                  <span>Mã Khóa</span>
                  {renderSortIcon('code')}
                </button>
              </TableHead>
            )}

            {/* Danh Mục */}
            {columnVisibility.category && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                Danh Mục
              </TableHead>
            )}

            {/* Phân Loại */}
            {columnVisibility.type && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                Phân Loại
              </TableHead>
            )}

            {/* Hạn & Chế Độ Học */}
            {columnVisibility.progression && (
              <TableHead className="py-3 text-xs font-semibold text-center text-muted-foreground">
                Hạn & Chế Độ Học
              </TableHead>
            )}

            {/* Trạng Thái (Sortable) */}
            {columnVisibility.status && (
              <TableHead className="py-3 text-xs font-semibold text-center text-muted-foreground">
                <button
                  type="button"
                  onClick={() => onSort('status')}
                  className="mx-auto flex items-center justify-center gap-1 hover:text-foreground transition-colors cursor-pointer font-semibold"
                >
                  <span>Trạng Thái</span>
                  {renderSortIcon('status')}
                </button>
              </TableHead>
            )}

            {/* Ghi Danh (Sortable) */}
            {columnVisibility.enrollment && (
              <TableHead className="py-3 text-xs font-semibold text-center text-muted-foreground">
                <button
                  type="button"
                  onClick={() => onSort('enrollments')}
                  className="mx-auto flex items-center justify-center gap-1 hover:text-foreground transition-colors cursor-pointer font-semibold"
                >
                  <span>Ghi Danh</span>
                  {renderSortIcon('enrollments')}
                </button>
              </TableHead>
            )}

            {/* Ngày Cập Nhật */}
            {columnVisibility.updatedAt && (
              <TableHead className="py-3 text-xs font-semibold text-center text-muted-foreground">
                <button
                  type="button"
                  onClick={() => onSort('updatedAt')}
                  className="mx-auto flex items-center justify-center gap-1 hover:text-foreground transition-colors cursor-pointer font-semibold"
                >
                  <span>Cập Nhật</span>
                  {renderSortIcon('updatedAt')}
                </button>
              </TableHead>
            )}

            {/* Thao Tác */}
            {columnVisibility.actions && (
              <TableHead className="pr-4 py-3 text-xs font-semibold text-right text-muted-foreground">
                Thao Tác
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={6} cols={visibleColumnCount} hasCheckbox />
          ) : courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumnCount} className="h-56 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <div className="p-3 rounded-full bg-muted/60 border border-border">
                    <BookOpen className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Không tìm thấy khóa học nào</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Thử điều chỉnh lại từ khóa tìm kiếm hoặc xóa bớt các bộ lọc hiện tại.
                    </p>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onResetFilters}
                      className="text-xs mt-1 cursor-pointer"
                    >
                      Đặt lại bộ lọc
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <CourseTableRow
                key={course.id}
                course={course}
                isSelected={selectedCourseIds.includes(course.id)}
                columnVisibility={columnVisibility}
                onToggleSelect={onToggleSelectRow}
                onNavigate={onNavigate}
                onRequestStatusChange={onRequestStatusChange}
                onRequestProgressionChange={onRequestProgressionChange}
                onRequestClone={onRequestClone}
                onRequestDelete={onRequestDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
