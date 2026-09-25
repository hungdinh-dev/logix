'use client'

import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  Archive,
  Edit,
  Users,
  Copy,
  Trash2,
  Unlock,
  Link2,
  Package,
  History,
} from 'lucide-react'
import type { BackendCourse } from '@/features/lms/types/course.types'
import type {
  ColumnVisibility,
  CourseStatus,
  ProgressionMode,
} from '../types/courses-admin.types'
import { routePath } from '@/config/route-path'
import { StatusBadgeDropdown, type StatusBadgeOption } from '@/components/common/StatusBadgeDropdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const COURSE_STATUS_OPTIONS: StatusBadgeOption<CourseStatus>[] = [
  {
    value: 'PUBLISHED',
    label: 'Đang phát hành',
    description: 'Mở cho học viên',
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
    dotColor: 'bg-emerald-500',
    badgeClassName:
      'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    itemClassName:
      'text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/30',
  },
  {
    value: 'DRAFT',
    label: 'Bản nháp (Draft)',
    description: 'Tạm ẩn với học viên',
    icon: <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
    dotColor: 'bg-amber-500',
    badgeClassName:
      'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    itemClassName:
      'text-amber-600 focus:text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-950/30',
  },
  {
    value: 'ARCHIVED',
    label: 'Lưu trữ (Archived)',
    description: 'Đóng & cất kho',
    icon: <Archive className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />,
    dotColor: 'bg-slate-400',
    badgeClassName:
      'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    itemClassName:
      'text-slate-600 focus:text-slate-700 focus:bg-slate-50 dark:focus:bg-slate-800/50',
  },
]

const PROGRESSION_MODE_OPTIONS: StatusBadgeOption<ProgressionMode>[] = [
  {
    value: 'FREE',
    label: 'Tự do',
    badgeLabel: '🔓 Tự do',
    description: 'Học không giới hạn thứ tự',
    icon: <Unlock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />,
    badgeClassName:
      'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 bg-blue-50/50 hover:bg-blue-100/60',
    itemClassName:
      'text-blue-600 focus:text-blue-700 focus:bg-blue-50 dark:focus:bg-blue-950/30',
  },
  {
    value: 'LINEAR_LESSON',
    label: 'Tuần tự bài',
    badgeLabel: '🔗 Tuần tự bài',
    description: 'Mở bài tiếp sau khi hoàn thành',
    icon: <Link2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
    badgeClassName:
      'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 hover:bg-emerald-100/60',
    itemClassName:
      'text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/30',
  },
  {
    value: 'LINEAR_MODULE',
    label: 'Tuần tự chương',
    badgeLabel: '📦 Tuần tự chương',
    description: 'Mở theo từng chương học',
    icon: <Package className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />,
    badgeClassName:
      'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/60 bg-purple-50/50 hover:bg-purple-100/60',
    itemClassName:
      'text-purple-600 focus:text-purple-700 focus:bg-purple-50 dark:focus:bg-purple-950/30',
  },
]

interface CourseTableRowProps {
  course: BackendCourse
  isSelected: boolean
  columnVisibility: ColumnVisibility
  onToggleSelect: (id: string) => void
  onNavigate: (path: string) => void
  onRequestStatusChange: (course: BackendCourse, nextStatus: CourseStatus) => void
  onRequestProgressionChange: (course: BackendCourse, nextMode: ProgressionMode) => void
  onRequestClone: (course: BackendCourse) => void
  onRequestDelete: (course: BackendCourse) => void
  onRequestViewAudit?: (course: BackendCourse) => void
  onRequestViewEnrollments?: (course: BackendCourse) => void
}

export function CourseTableRow({
  course,
  isSelected,
  columnVisibility,
  onToggleSelect,
  onNavigate,
  onRequestStatusChange,
  onRequestProgressionChange,
  onRequestClone,
  onRequestDelete,
  onRequestViewAudit,
  onRequestViewEnrollments,
}: CourseTableRowProps) {
  return (
    <TableRow data-state={isSelected ? 'selected' : undefined} className="hover:bg-muted/30 transition-colors">
      {/* Row Checkbox */}
      <TableCell className="pl-4 py-3.5">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(course.id)}
          aria-label={`Chọn khóa học ${course.title}`}
          className="cursor-pointer"
        />
      </TableCell>

      {/* Tên Khóa Học */}
      <TableCell className="py-3.5 max-w-[220px] sm:max-w-[280px] lg:max-w-[340px]">
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <div
              className="font-semibold text-foreground text-sm hover:text-primary transition-colors cursor-pointer truncate block"
              onClick={() => onNavigate(`${routePath.lmsAdminCourses}/${course.id}`)}
            >
              {course.title}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="start" sideOffset={4} className="max-w-md font-medium text-xs">
            <span>{course.title}</span>
          </TooltipContent>
        </Tooltip>
        {!columnVisibility.code && (
          <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{course.code}</div>
        )}
      </TableCell>

      {/* Mã Khóa */}
      {columnVisibility.code && (
        <TableCell className="py-3.5">
          <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50">
            {course.code}
          </code>
        </TableCell>
      )}

      {/* Danh Mục */}
      {columnVisibility.category && (
        <TableCell className="py-3.5">
          <Badge variant="outline" className="text-xs font-normal bg-muted/20">
            {course.category?.name || 'Chưa phân loại'}
          </Badge>
        </TableCell>
      )}

      {/* Phân Loại */}
      {columnVisibility.type && (
        <TableCell className="py-3.5">
          <div className="flex items-center gap-1.5">
            {course.isMandatory ? (
              <Badge variant="destructive" className="text-[10px] font-bold">
                Bắt buộc
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">
                Tùy chọn
              </Badge>
            )}
            <span className="text-xs text-muted-foreground capitalize">({course.courseType})</span>
          </div>
        </TableCell>
      )}

      {/* Hạn / Chế Độ Học */}
      {columnVisibility.progression && (
        <TableCell className="py-3.5 text-center text-xs">
          <div className="flex flex-col items-center gap-1">
            <span className="font-medium text-foreground">{course.durationDays || 30} ngày</span>
            <StatusBadgeDropdown
              value={course.progressionMode || 'LINEAR_LESSON'}
              options={PROGRESSION_MODE_OPTIONS}
              onChange={(nextMode) => onRequestProgressionChange(course, nextMode)}
              menuLabel="Chế độ tiến trình học"
              title="Bấm để đổi chế độ tiến trình học"
              variant="badge"
              size="xs"
              contentWidth="w-56"
            />
          </div>
        </TableCell>
      )}

      {/* Trạng Thái */}
      {columnVisibility.status && (
        <TableCell className="py-3.5 text-center">
          <StatusBadgeDropdown
            value={course.status}
            options={COURSE_STATUS_OPTIONS}
            onChange={(nextStatus) => onRequestStatusChange(course, nextStatus)}
            menuLabel="Đổi trạng thái khóa học"
            title="Bấm để thay đổi trạng thái khóa học"
            variant="pill"
            size="sm"
            contentWidth="w-48"
          />
        </TableCell>
      )}

      {/* Ghi Danh */}
      {columnVisibility.enrollment && (
        <TableCell className="py-3.5 text-center">
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRequestViewEnrollments?.(course)}
                className="h-7 gap-1.5 px-2.5 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-full border border-border/70 hover:border-primary/40 group"
                aria-label="Xem danh sách học viên ghi danh"
              >
                <Users className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-bold text-foreground group-hover:text-primary">
                  {course._count?.enrollments || 0}
                </span>
                <span className="text-muted-foreground text-[11px] group-hover:text-primary/80">học viên</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4} className="font-medium text-xs">
              <span>Xem danh sách học viên ghi danh (Side Peek)</span>
            </TooltipContent>
          </Tooltip>
        </TableCell>
      )}

      {/* Ngày Cập Nhật */}
      {columnVisibility.updatedAt && (
        <TableCell className="py-3.5 text-center text-xs text-muted-foreground">
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onRequestViewAudit?.(course)}
                className="inline-flex flex-col items-center hover:text-primary transition-colors cursor-pointer group"
                aria-label="Xem lịch sử chỉnh sửa chi tiết"
              >
                <span className="font-medium text-foreground group-hover:text-primary">
                  {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </span>
                {course.updatedByUser && (
                  <span className="text-[10px] text-muted-foreground group-hover:text-primary/80 truncate max-w-[120px]">
                    bởi {course.updatedByUser.fullName}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4} className="font-medium text-xs">
              <span>Xem chi tiết nhật ký kiểm toán (Side Peek)</span>
            </TooltipContent>
          </Tooltip>
        </TableCell>
      )}

      {/* Thao Tác */}
      {columnVisibility.actions && (
        <TableCell className="py-3.5 pr-4 text-right">
          <div className="flex items-center justify-end gap-1">
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                  onClick={() => onRequestViewAudit?.(course)}
                  aria-label="Xem lịch sử chỉnh sửa"
                >
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="font-medium text-xs">
                <span>Xem lịch sử chỉnh sửa</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:bg-primary/10 cursor-pointer"
                  onClick={() => onNavigate(`${routePath.lmsAdminCourses}/${course.id}`)}
                  aria-label="Soạn giáo trình & bài học"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="font-medium text-xs">
                <span>Soạn giáo trình & bài học</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                  onClick={() => onNavigate(`${routePath.lmsAdminCourses}/${course.id}/targeting`)}
                  aria-label="Phân bổ nhân sự tự động"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="font-medium text-xs">
                <span>Phân bổ nhân sự tự động</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  onClick={() => onRequestClone(course)}
                  aria-label="Sao chép khóa học"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="font-medium text-xs">
                <span>Sao chép khóa học (Clone)</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                  onClick={() => onRequestDelete(course)}
                  aria-label="Xóa khóa học"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="font-medium text-xs">
                <span>Xóa khóa học</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}
