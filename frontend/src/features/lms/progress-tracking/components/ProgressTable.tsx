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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CheckCircle2,
  Clock,
  BookOpen,
  XCircle,
  MoreVertical,
  Mail,
  ExternalLink,
  User,
  Inbox,
  Award,
  Calendar,
} from 'lucide-react'
import type { AdminProgressItem } from '../types/progress-tracking.types'
import type { ProgressColumnVisibility } from './ProgressToolbar'

interface ProgressTableProps {
  items: AdminProgressItem[]
  isLoading: boolean
  selectedIds: string[]
  isAllSelected: boolean
  onToggleSelectAll: () => void
  onToggleSelectRow: (id: string) => void
  columnVisibility: ProgressColumnVisibility
  hasActiveFilters: boolean
  onResetFilters: () => void
  onViewDetail: (item: AdminProgressItem) => void
  onSendReminder: (item: AdminProgressItem) => void
  onNavigateToCourse: (courseId: string) => void
}

function getAvatarInitials(name: string) {
  if (!name) return 'NV'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatDate(isoDate?: string | null) {
  if (!isoDate) return null
  try {
    return new Date(isoDate).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

export function ProgressTable({
  items,
  isLoading,
  selectedIds,
  isAllSelected,
  onToggleSelectAll,
  onToggleSelectRow,
  columnVisibility,
  hasActiveFilters,
  onResetFilters,
  onViewDetail,
  onSendReminder,
  onNavigateToCourse,
}: ProgressTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">Không có dữ liệu tiến độ</h3>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">
          {hasActiveFilters
            ? 'Không tìm thấy lượt ghi danh hoặc học viên nào phù hợp với bộ lọc hiện tại.'
            : 'Hệ thống chưa có lượt ghi danh nào vào các khóa học.'}
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
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent border-b">
            {/* Checkbox All */}
            <TableHead className="w-10 pl-4 py-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onToggleSelectAll}
                aria-label="Chọn tất cả học viên"
                className="cursor-pointer"
              />
            </TableHead>

            {/* Nhân sự / Học viên */}
            <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
              Nhân Sự / Học Viên
            </TableHead>

            {/* Phòng ban & Điểm làm việc */}
            {columnVisibility.department && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                Phòng Ban & Chi Nhánh
              </TableHead>
            )}

            {/* Khóa học đào tạo */}
            {columnVisibility.course && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                Khóa Học Đào Tạo
              </TableHead>
            )}

            {/* Tiến độ hoàn thành */}
            {columnVisibility.progress && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground min-w-[140px]">
                Tiến Độ Hoàn Thành
              </TableHead>
            )}

            {/* Điểm thi Quiz */}
            {columnVisibility.quizScore && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                Điểm Thi Cao Nhất
              </TableHead>
            )}

            {/* Ngày ghi danh / Hạn chót */}
            {columnVisibility.dates && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                Hạn Chót / Ngày Ghi Danh
              </TableHead>
            )}

            {/* Trạng thái */}
            {columnVisibility.status && (
              <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
                Trạng Thái
              </TableHead>
            )}

            {/* Thao tác */}
            {columnVisibility.actions && (
              <TableHead className="py-3 pr-4 text-xs font-semibold text-muted-foreground text-right">
                Thao Tác
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id)
            const initials = getAvatarInitials(item.user.fullName)
            const enrolledDateStr = formatDate(item.enrolledAt)
            const completedDateStr = formatDate(item.completedAt)
            const dueDateStr = formatDate(item.dueDate)

            return (
              <TableRow
                key={item.id}
                data-state={isSelected ? 'selected' : undefined}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* Checkbox Row */}
                <TableCell className="pl-4 py-3.5">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelectRow(item.id)}
                    aria-label={`Chọn học viên ${item.user.fullName}`}
                    className="cursor-pointer"
                  />
                </TableCell>

                {/* Nhân sự / Học viên */}
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-foreground truncate">
                        {item.user.fullName}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        {item.user.employeeCode && (
                          <>
                            <span className="font-mono">{item.user.employeeCode}</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="truncate max-w-[150px]">{item.user.email}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Phòng ban & Chi nhánh */}
                {columnVisibility.department && (
                  <TableCell className="py-3.5">
                    <div className="flex flex-col text-xs">
                      <span className="font-medium text-foreground">
                        {item.user.department?.deptName || 'Chưa gán phòng ban'}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {item.user.store?.storeName || 'Toàn hệ thống'}
                      </span>
                    </div>
                  </TableCell>
                )}

                {/* Khóa học đào tạo */}
                {columnVisibility.course && (
                  <TableCell className="py-3.5 max-w-[240px]">
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-foreground truncate" title={item.course.title}>
                        {item.course.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                        <span className="font-mono">{item.course.code}</span>
                        {item.course.category && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal">
                              {item.course.category.name}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                )}

                {/* Tiến độ hoàn thành */}
                {columnVisibility.progress && (
                  <TableCell className="py-3.5">
                    <div className="space-y-1.5 max-w-[130px]">
                      <div className="flex justify-between items-center text-[11px] font-medium">
                        <span className="text-foreground font-semibold">{item.completionPercentage}%</span>
                        <span className="text-muted-foreground text-[10px]">
                          {item.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang học'}
                        </span>
                      </div>
                      <Progress
                        value={item.completionPercentage}
                        className="h-1.5 bg-muted"
                      />
                    </div>
                  </TableCell>
                )}

                {/* Điểm thi Quiz */}
                {columnVisibility.quizScore && (
                  <TableCell className="py-3.5">
                    {item.highestQuizScore !== null && item.highestQuizScore !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-amber-500" />
                        <span className="font-bold text-xs text-foreground">
                          {item.highestQuizScore}%
                        </span>
                        {item.course.passScorePercentage && (
                          <span className="text-[10px] text-muted-foreground">
                            (Đạt: {item.course.passScorePercentage}%)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Chưa thi</span>
                    )}
                  </TableCell>
                )}

                {/* Ngày ghi danh & Hạn chót */}
                {columnVisibility.dates && (
                  <TableCell className="py-3.5">
                    <div className="flex flex-col text-[11px]">
                      {dueDateStr ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          Hạn: {dueDateStr}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Không có hạn</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        Ghi danh: {enrolledDateStr || '—'}
                      </span>
                    </div>
                  </TableCell>
                )}

                {/* Trạng thái */}
                {columnVisibility.status && (
                  <TableCell className="py-3.5">
                    {item.status === 'COMPLETED' && (
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] gap-1">
                        <CheckCircle2 className="h-3 w-3 inline" />
                        <span>Đã Hoàn Thành</span>
                      </Badge>
                    )}
                    {item.status === 'IN_PROGRESS' && (
                      <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-medium text-[11px] gap-1">
                        <Clock className="h-3 w-3 inline" />
                        <span>Đang Học</span>
                      </Badge>
                    )}
                    {item.status === 'ENROLLED' && (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium text-[11px] gap-1">
                        <BookOpen className="h-3 w-3 inline" />
                        <span>Mới Ghi Danh</span>
                      </Badge>
                    )}
                    {item.status === 'CANCELLED' && (
                      <Badge variant="outline" className="border-muted bg-muted text-muted-foreground font-medium text-[11px] gap-1">
                        <XCircle className="h-3 w-3 inline" />
                        <span>Đã Hủy</span>
                      </Badge>
                    )}
                  </TableCell>
                )}

                {/* Thao tác */}
                {columnVisibility.actions && (
                  <TableCell className="py-3.5 pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs">
                        <DropdownMenuItem
                          onClick={() => onViewDetail(item)}
                          className="cursor-pointer gap-2"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-primary" />
                          <span>Xem chi tiết học tập</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSendReminder(item)}
                          className="cursor-pointer gap-2"
                        >
                          <Mail className="h-3.5 w-3.5 text-amber-600" />
                          <span>Gửi email nhắc nhở</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onNavigateToCourse(item.courseId)}
                          className="cursor-pointer gap-2"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Đến trang khóa học</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
