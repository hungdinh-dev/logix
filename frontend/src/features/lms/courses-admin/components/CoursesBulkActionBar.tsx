'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, Archive, Trash2 } from 'lucide-react'
import type { CourseStatus } from '../types/courses-admin.types'

interface CoursesBulkActionBarProps {
  selectedCount: number
  onBulkStatus: (status: CourseStatus) => void
  onBulkDelete: () => void
  onDeselectAll: () => void
}

export function CoursesBulkActionBar({
  selectedCount,
  onBulkStatus,
  onBulkDelete,
  onDeselectAll,
}: CoursesBulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-1 bg-primary/10 border border-primary/25 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2">
        <Badge variant="default" className="text-xs px-2.5 py-0.5 font-bold">
          Đã chọn {selectedCount} khóa học
        </Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Áp dụng thao tác đồng loạt trên danh sách đã chọn:
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatus('PUBLISHED')}
          className="h-7 px-2.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 cursor-pointer"
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          Xuất bản
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatus('DRAFT')}
          className="h-7 px-2.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 cursor-pointer"
        >
          <Clock className="h-3.5 w-3.5 mr-1" />
          Chuyển nháp
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatus('ARCHIVED')}
          className="h-7 px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border-slate-300 cursor-pointer"
        >
          <Archive className="h-3.5 w-3.5 mr-1" />
          Lưu trữ
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          className="h-7 px-2.5 text-xs font-medium cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Xóa
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Bỏ chọn
        </Button>
      </div>
    </div>
  )
}
