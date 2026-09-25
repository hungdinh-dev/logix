'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Building2,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Mail,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import type { AdminProgressItem } from '../types/progress-tracking.types'

interface StudentProgressSidePeekProps {
  isOpen: boolean
  onClose: () => void
  item: AdminProgressItem | null
  onSendReminder: (item: AdminProgressItem) => void
  onNavigateToCourse: (courseId: string) => void
}

function getInitials(name?: string): string {
  if (!name) return 'NV'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatDate(isoDate?: string | null) {
  if (!isoDate) return 'Chưa ghi nhận'
  try {
    return new Date(isoDate).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoDate
  }
}

export function StudentProgressSidePeek({
  isOpen,
  onClose,
  item,
  onSendReminder,
  onNavigateToCourse,
}: StudentProgressSidePeekProps) {
  if (!item) return null

  const initials = getInitials(item.user.fullName)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col bg-background border-l border-border"
      >
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border/80 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base uppercase">
              {initials}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <SheetTitle className="text-base font-bold text-foreground truncate">
                {item.user.fullName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                {item.user.employeeCode && (
                  <>
                    <span className="font-mono">{item.user.employeeCode}</span>
                    <span>•</span>
                  </>
                )}
                <span className="truncate">{item.user.email}</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Thông tin tổ chức & công tác */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Thông Tin Nhân Sự
            </h4>
            <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-lg border border-border/60 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  Phòng ban
                </span>
                <p className="font-semibold text-foreground">
                  {item.user.department?.deptName || 'Chưa gán'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Điểm làm việc
                </span>
                <p className="font-semibold text-foreground">
                  {item.user.store?.storeName || 'Toàn hệ thống'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Khóa học & Tiến trình */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Khóa Học Đang Theo Dõi
            </h4>
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-semibold text-sm text-foreground">
                    {item.course.title}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="font-mono">{item.course.code}</span>
                    {item.course.category && (
                      <>
                        <span>•</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {item.course.category.name}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${
                    item.status === 'COMPLETED'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : item.status === 'IN_PROGRESS'
                      ? 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {item.status === 'COMPLETED'
                    ? 'Đã Hoàn Thành'
                    : item.status === 'IN_PROGRESS'
                    ? 'Đang Học'
                    : 'Mới Ghi Danh'}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-muted-foreground">Tiến độ nội dung:</span>
                  <span className="font-bold text-foreground text-sm">
                    {item.completionPercentage}%
                  </span>
                </div>
                <Progress value={item.completionPercentage} className="h-2" />
              </div>

              {/* Quiz Score Box */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    Điểm thi cao nhất
                  </span>
                  <div className="mt-1 text-base font-bold text-foreground">
                    {item.highestQuizScore !== null && item.highestQuizScore !== undefined
                      ? `${item.highestQuizScore}%`
                      : 'Chưa thi'}
                  </div>
                </div>

                <div className="rounded-lg border border-border/80 bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Tiêu chuẩn đạt
                  </span>
                  <div className="mt-1 text-base font-bold text-foreground">
                    {item.course.passScorePercentage
                      ? `${item.course.passScorePercentage}%`
                      : '100%'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Mốc thời gian */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Lịch Sử & Mốc Thời Gian
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Ngày bắt đầu ghi danh:
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(item.enrolledAt)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Ngày hoàn thành khóa học:
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(item.completedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Thời hạn hoàn thành (Deadline):
                </span>
                <span className="font-medium text-foreground">
                  {item.dueDate ? formatDate(item.dueDate) : 'Không giới hạn thời hạn'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendReminder(item)}
            className="gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 text-amber-600" />
            <span>Gửi nhắc nhở</span>
          </Button>

          <Button
            size="sm"
            onClick={() => onNavigateToCourse(item.courseId)}
            className="gap-1.5 bg-primary text-primary-foreground text-xs font-medium cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Xem khóa học</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
