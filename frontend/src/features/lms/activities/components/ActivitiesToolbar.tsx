'use client'

import React from 'react'
import { Search, X, RotateCcw, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ActivityType, ActivityStatus } from '../types/activities.types'

interface ActivitiesToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  type: ActivityType
  onTypeChange: (val: ActivityType) => void
  status: ActivityStatus
  onStatusChange: (val: ActivityStatus) => void
  hasActiveFilters: boolean
  onResetFilters: () => void
}

export function ActivitiesToolbar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  hasActiveFilters,
  onResetFilters,
}: ActivitiesToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border/80 shadow-xs">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Tìm theo tên học viên, email, bài học hoặc khóa học..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-8 text-xs h-9 bg-background"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <Select value={type} onValueChange={(val) => onTypeChange(val as ActivityType)}>
          <SelectTrigger className="w-full sm:w-[170px] text-xs h-9 bg-background">
            <SelectValue placeholder="Loại hoạt động" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">Tất cả loại hoạt động</SelectItem>
            <SelectItem value="QUIZ" className="text-xs">Bài kiểm tra Quiz</SelectItem>
            <SelectItem value="LESSON" className="text-xs">Tiến trình Bài học</SelectItem>
            <SelectItem value="COURSE" className="text-xs">Ghi danh Khóa học</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={status} onValueChange={(val) => onStatusChange(val as ActivityStatus)}>
          <SelectTrigger className="w-full sm:w-[160px] text-xs h-9 bg-background">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">Tất cả kết quả</SelectItem>
            <SelectItem value="SUCCESS" className="text-xs">Thành công / Đạt</SelectItem>
            <SelectItem value="ACTIVE" className="text-xs">Đang thực hiện</SelectItem>
            <SelectItem value="FAILED" className="text-xs">Chưa đạt điểm</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Xóa lọc
          </Button>
        )}
      </div>
    </div>
  )
}
