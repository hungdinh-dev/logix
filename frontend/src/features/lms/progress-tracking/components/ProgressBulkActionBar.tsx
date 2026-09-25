'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Mail, Download, X } from 'lucide-react'

interface ProgressBulkActionBarProps {
  selectedCount: number
  onSendReminder: () => void
  onExportSelected: () => void
  onDeselectAll: () => void
}

export function ProgressBulkActionBar({
  selectedCount,
  onSendReminder,
  onExportSelected,
  onDeselectAll,
}: ProgressBulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-primary/10 border border-primary/25 rounded-xl animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2">
        <Badge variant="default" className="text-xs px-2.5 py-0.5 font-bold">
          Đã chọn {selectedCount} học viên
        </Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Thao tác đôn đốc & xử lý học viên đã chọn:
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onSendReminder}
          className="h-7 px-2.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 cursor-pointer"
        >
          <Bell className="h-3.5 w-3.5 mr-1 text-amber-600" />
          Gửi thông báo nhắc nhở
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportSelected}
          className="h-7 px-2.5 text-xs font-medium cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          Xuất dữ liệu
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Bỏ chọn
        </Button>
      </div>
    </div>
  )
}
