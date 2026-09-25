'use client'

import React from 'react'
import { Search, X, FolderTree, Building2, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '@/components/common/DataTableViewOptions'

export interface ProgressColumnVisibility {
  department: boolean
  course: boolean
  progress: boolean
  quizScore: boolean
  dates: boolean
  status: boolean
  actions: boolean
}

interface ProgressToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  selectedCourseId: string
  onCourseChange: (val: string) => void
  coursesList: Array<{ id: string; title: string; code: string }>
  selectedDepartmentId: string
  onDepartmentChange: (val: string) => void
  departmentsList: Array<{ id: string; deptName: string; deptCode: string }>
  hasActiveFilters: boolean
  onResetFilters: () => void
  columnVisibility: ProgressColumnVisibility
  onToggleColumn: (key: string, visible: boolean) => void
}

export function ProgressToolbar({
  search,
  onSearchChange,
  selectedCourseId,
  onCourseChange,
  coursesList,
  selectedDepartmentId,
  onDepartmentChange,
  departmentsList,
  hasActiveFilters,
  onResetFilters,
  columnVisibility,
  onToggleColumn,
}: ProgressToolbarProps) {
  const columnOptions = [
    { key: 'department', label: 'Phòng ban & Điểm làm việc', visible: columnVisibility.department },
    { key: 'course', label: 'Khóa học đào tạo', visible: columnVisibility.course },
    { key: 'progress', label: 'Tiến độ hoàn thành', visible: columnVisibility.progress },
    { key: 'quizScore', label: 'Điểm thi Quiz', visible: columnVisibility.quizScore },
    { key: 'dates', label: 'Ngày & Hạn chót', visible: columnVisibility.dates },
    { key: 'status', label: 'Trạng thái', visible: columnVisibility.status },
    { key: 'actions', label: 'Cột Thao tác', visible: columnVisibility.actions },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border shadow-2xs">
      {/* Left: Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên học viên, email, mã NV hoặc khóa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 h-9 text-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Right: Filters & Column Visibility */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Course Filter */}
        <Select value={selectedCourseId} onValueChange={onCourseChange}>
          <SelectTrigger className="w-[180px] h-9 text-xs">
            <SelectValue placeholder="Tất cả khóa học" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="ALL" className="text-xs">Tất cả khóa học</SelectItem>
            {coursesList.map((c) => (
              <SelectItem key={c.id} value={c.id} className="text-xs">
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select value={selectedDepartmentId} onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-[170px] h-9 text-xs">
            <SelectValue placeholder="Tất cả phòng ban" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="ALL" className="text-xs">Tất cả phòng ban</SelectItem>
            {departmentsList.map((d) => (
              <SelectItem key={d.id} value={d.id} className="text-xs">
                {d.deptName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Filter */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
            title="Xóa tất cả bộ lọc"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa lọc</span>
          </Button>
        )}

        {/* Column Visibility Menu */}
        <DataTableViewOptions columns={columnOptions} onToggleColumn={onToggleColumn} />
      </div>
    </div>
  )
}
