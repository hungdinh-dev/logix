'use client'

import React, { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  Search,
  X,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  RefreshCw,
  Mail,
  UserCheck,
} from 'lucide-react'
import { useCourseEnrollments } from '@/features/lms/hooks/use-course-enrollments'
import type { BackendCourse } from '@/features/lms/types/course.types'
import type { CourseEnrollmentRecord, EnrollmentStatus } from '@/features/lms/types/course.types'

interface CourseEnrollmentsSidePeekProps {
  isOpen: boolean
  onClose: () => void
  course: BackendCourse | null
  onOpenAssignDialog?: (course: BackendCourse) => void
}

function getInitials(name: string): string {
  if (!name) return 'HV'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getStatusBadge(status: EnrollmentStatus, isPassed: boolean) {
  if (status === 'COMPLETED') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 gap-1 text-[11px] font-semibold">
        <CheckCircle2 className="h-3 w-3" />
        {isPassed ? 'Đã hoàn thành (Đạt)' : 'Hoàn thành'}
      </Badge>
    )
  }
  if (status === 'IN_PROGRESS') {
    return (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 gap-1 text-[11px] font-semibold">
        <Clock className="h-3 w-3 animate-spin duration-3000" />
        Đang học
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-amber-50/50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800 text-[11px] font-medium">
      Mới ghi danh
    </Badge>
  )
}

export function CourseEnrollmentsSidePeek({
  isOpen,
  onClose,
  course,
  onOpenAssignDialog,
}: CourseEnrollmentsSidePeekProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDeptId, setSelectedDeptId] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  const queryParams = useMemo(() => {
    return {
      search: searchTerm.trim() ? searchTerm.trim() : undefined,
      departmentId: selectedDeptId !== 'ALL' ? selectedDeptId : undefined,
      status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
    }
  }, [searchTerm, selectedDeptId, selectedStatus])

  const { data, isLoading, refetch, isRefetching } = useCourseEnrollments(
    course?.id,
    queryParams,
    { enabled: isOpen && !!course?.id }
  )

  const enrollments = data?.enrollments || []
  const stats = data?.stats || { total: 0, enrolled: 0, inProgress: 0, completed: 0, cancelled: 0 }

  // Extract distinct departments from enrollments for filtering
  const distinctDepartments = useMemo(() => {
    const map = new Map<string, string>()
    enrollments.forEach((item) => {
      if (item.user?.department?.id && item.user?.department?.deptName) {
        map.set(item.user.department.id, item.user.department.deptName)
      }
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [enrollments])

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedDeptId('ALL')
    setSelectedStatus('ALL')
  }

  const hasActiveFilters = searchTerm !== '' || selectedDeptId !== 'ALL' || selectedStatus !== 'ALL'

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col h-full bg-background border-l border-border"
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-border space-y-4 bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </span>
                <SheetTitle className="text-lg font-bold text-foreground">
                  Danh Sách Học Viên Ghi Danh
                </SheetTitle>
              </div>
              <SheetDescription className="text-xs text-muted-foreground">
                Theo dõi tiến độ học tập và thông tin nhân sự tham gia khóa học
              </SheetDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="h-8 gap-1.5 px-2.5 text-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>

          {/* Course Metadata Pill */}
          {course && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-foreground text-sm">{course.title}</span>
              <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px] text-muted-foreground border">
                {course.code}
              </code>
              {course.isMandatory && (
                <Badge variant="destructive" className="text-[10px] font-bold">
                  Bắt buộc
                </Badge>
              )}
            </div>
          )}

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs">
              <span className="text-[11px] font-medium text-muted-foreground block">
                Tổng Học Viên
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-foreground">{stats.total}</span>
                <span className="text-[10px] text-muted-foreground">nhân sự</span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-3 shadow-xs">
              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 block">
                Đang Học Tập
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.inProgress}
                </span>
                <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">học viên</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 p-3 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 block">
                Đã Hoàn Thành
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.completed}
                </span>
                <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">
                  học viên
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Search + Filter By Department + Filter By Status */}
        <div className="px-6 py-3 border-b border-border bg-card space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm tên, email, mã nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="sm:col-span-3">
              <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    Tất cả phòng ban
                  </SelectItem>
                  {distinctDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id} className="text-xs">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-8 text-xs bg-background">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    Tất cả trạng thái
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS" className="text-xs">
                    Đang học
                  </SelectItem>
                  <SelectItem value="COMPLETED" className="text-xs">
                    Hoàn thành
                  </SelectItem>
                  <SelectItem value="ENROLLED" className="text-xs">
                    Mới ghi danh
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Notice & Clear */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
              <span>
                Đang hiển thị {enrollments.length} / {stats.total} học viên theo bộ lọc
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Enrolled Students List Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3 bg-card">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Users className="h-6 w-6 opacity-60" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-semibold text-foreground">
                  {hasActiveFilters
                    ? 'Không tìm thấy học viên nào phù hợp'
                    : 'Khóa học này chưa có học viên ghi danh'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {hasActiveFilters
                    ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc phòng ban.'
                    : 'Gán khóa học cho nhân viên hoặc thiết lập quy tắc phân bổ tự động.'}
                </p>
              </div>
              {hasActiveFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 text-xs cursor-pointer"
                >
                  Xóa bộ lọc tìm kiếm
                </Button>
              ) : (
                course &&
                onOpenAssignDialog && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onClose()
                      onOpenAssignDialog(course)
                    }}
                    className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Gán học viên vào khóa học
                  </Button>
                )
              )}
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {enrollments.map((record: CourseEnrollmentRecord) => {
                const user = record.user
                const completionPct = Math.round(record.completionPercentage || 0)

                return (
                  <div
                    key={record.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-primary/40 transition-colors space-y-3"
                  >
                    {/* Top Row: User Avatar, Name, Code, Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {getInitials(user.fullName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {user.fullName}
                            </span>
                            {user.employeeCode && (
                              <code className="text-[10px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground border">
                                {user.employeeCode}
                              </code>
                            )}
                          </div>

                          {user.email && (
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {getStatusBadge(record.status, record.isPassed)}
                      </div>
                    </div>

                    {/* Middle Row: Department, Position, Store Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {user.department && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground text-[11px] font-medium">
                          <Building2 className="h-3 w-3 text-primary/70" />
                          {user.department.deptName}
                        </span>
                      )}

                      {user.position && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground text-[11px]">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          {user.position.positionName}
                        </span>
                      )}

                      {user.store && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground text-[11px]">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {user.store.storeName}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar & Percentage */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Tiến độ bài học:</span>
                        <span className="font-bold text-foreground">
                          {completionPct}% {record.isPassed && <span className="text-emerald-600 font-normal">(Đạt yêu cầu)</span>}
                        </span>
                      </div>
                      <Progress
                        value={completionPct}
                        className={`h-1.5 ${
                          completionPct === 100
                            ? '[&>div]:bg-emerald-500'
                            : completionPct > 0
                            ? '[&>div]:bg-primary'
                            : ''
                        }`}
                      />
                    </div>

                    {/* Bottom Metadata: Enrollment Source & Dates */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-dashed border-border/70 pt-2">
                      <div className="flex items-center gap-1">
                        <span>Nguồn:</span>
                        <span className="font-medium text-foreground/80">
                          {record.enrollmentSource === 'AUTO_RULE' ? '⚡ Tự động (Quy tắc)' : '👤 Gán thủ công'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Ghi danh: {new Date(record.enrolledAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {record.completedAt && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Award className="h-3 w-3" />
                            <span>Xong: {new Date(record.completedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
