'use client'

import React from 'react'
import {
  FileQuestion,
  BookCheck,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Inbox,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { LearningActivityItem } from '../types/activities.types'

interface ActivitiesTableProps {
  items: LearningActivityItem[]
  isLoading: boolean
  hasActiveFilters: boolean
  onResetFilters: () => void
}

function formatTimestamp(isoString: string) {
  try {
    const d = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`

    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export function ActivitiesTable({
  items,
  isLoading,
  hasActiveFilters,
  onResetFilters,
}: ActivitiesTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/80 bg-card p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">Không có hoạt động nào</h3>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">
          {hasActiveFilters
            ? 'Không tìm thấy nhật ký hoạt động nào phù hợp với bộ lọc hiện tại.'
            : 'Hệ thống chưa ghi nhận hoạt động học tập nào từ nhân viên.'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Đặt lại bộ lọc tìm kiếm
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Học viên & Nhân sự</th>
              <th className="py-3 px-4">Hành động đào tạo</th>
              <th className="py-3 px-4">Đối tượng & Khóa học</th>
              <th className="py-3 px-4">Kết quả / Điểm</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4 text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items.map((act) => {
              const formattedTime = formatTimestamp(act.timestamp)

              // Activity icon
              let Icon = BookCheck
              let iconColor = 'text-sky-500 bg-sky-500/10'
              if (act.type === 'QUIZ') {
                Icon = FileQuestion
                iconColor = act.status === 'SUCCESS' ? 'text-emerald-600 bg-emerald-500/10' : 'text-amber-600 bg-amber-500/10'
              } else if (act.type === 'COURSE') {
                Icon = GraduationCap
                iconColor = 'text-purple-600 bg-purple-500/10'
              }

              return (
                <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                  {/* Học viên */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                        {act.avatar || <User className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate">{act.user}</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="truncate max-w-[140px]">{act.email}</span>
                          {act.department && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[120px] text-muted-foreground/80">{act.department}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Hành động */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${iconColor}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium text-foreground">{act.action}</span>
                    </div>
                  </td>

                  {/* Đối tượng & Khóa học */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-foreground truncate" title={act.target}>
                        {act.target}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate" title={act.courseTitle}>
                        {act.courseTitle}
                      </span>
                    </div>
                  </td>

                  {/* Kết quả / Điểm */}
                  <td className="py-3.5 px-4">
                    {act.type === 'QUIZ' && act.score !== undefined && act.score !== null ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${act.status === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {act.score}%
                        </span>
                        <span className="text-[11px] text-muted-foreground">điểm bài thi</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">—</span>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4">
                    {act.status === 'SUCCESS' && (
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] gap-1">
                        <CheckCircle2 className="h-3 w-3 inline" />
                        <span>{act.statusLabel}</span>
                      </Badge>
                    )}
                    {act.status === 'ACTIVE' && (
                      <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-medium text-[11px] gap-1">
                        <Clock className="h-3 w-3 inline" />
                        <span>{act.statusLabel}</span>
                      </Badge>
                    )}
                    {act.status === 'FAILED' && (
                      <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive font-medium text-[11px] gap-1">
                        <AlertCircle className="h-3 w-3 inline" />
                        <span>{act.statusLabel}</span>
                      </Badge>
                    )}
                  </td>

                  {/* Thời gian */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap" title={new Date(act.timestamp).toLocaleString('vi-VN')}>
                      {formattedTime}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
