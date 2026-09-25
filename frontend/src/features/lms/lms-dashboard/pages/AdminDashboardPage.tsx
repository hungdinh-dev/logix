'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { routePath } from '@/config/route-path'
import { useAdminDashboard } from '../hooks/use-admin-dashboard'
import { cn } from '@/lib/utils'

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Vừa xong'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Vừa xong'
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Vừa xong'
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} ngày trước`
  return date.toLocaleDateString('vi-VN')
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const {
    metrics,
    topCourses,
    recentActivities,
    isLoading,
    isFetching,
    refetch,
  } = useAdminDashboard()

  const totalStudents = metrics?.totalStudents ?? 0
  const officialStudents = metrics?.officialStudents ?? 0
  const probationStudents = metrics?.probationStudents ?? 0
  const totalCourses = metrics?.totalCourses ?? 0
  const publishedCourses = metrics?.publishedCourses ?? 0
  const draftCourses = metrics?.draftCourses ?? 0
  const mandatoryCourses = metrics?.mandatoryCourses ?? 0
  const avgCompletionRate = metrics?.avgCompletionRate ?? 0
  const totalEnrollments = metrics?.totalEnrollments ?? 0

  return (
    <div className="flex-1 space-y-4 p-3 md:px-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Tổng quan Hệ thống Đào tạo
            </h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Admin Console
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Báo cáo tổng hợp số liệu học tập, tiến độ khóa học và hoạt động nhân sự theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => refetch()}
            className="cursor-pointer gap-1.5 text-xs font-medium"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            {isFetching ? 'Đang cập nhật...' : 'Làm mới'}
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 text-xs font-medium"
          >
            <Link href={routePath.adminProgress}>
              <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
              Báo cáo Tiến độ
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 shadow-sm text-xs font-medium"
          >
            <Link href={`${routePath.lmsAdminCourses}/create`}>
              <Plus className="h-4 w-4" />
              Tạo Khóa học Mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row (3 Main Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Users */}
        <Card className="relative overflow-hidden border-border/80 bg-card shadow-sm hover:shadow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tổng Học viên Toàn Hệ Thống
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-9 w-28" />
              ) : (
                totalStudents.toLocaleString()
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Đang hoạt động trong tổ chức</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              {isLoading ? (
                <Skeleton className="h-3 w-full" />
              ) : (
                <>
                  <span>{officialStudents} Nhân viên chính thức</span>
                  <span>{probationStudents} Học việc/Thử việc</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Avg Completion */}
        <Card className="relative overflow-hidden border-border/80 bg-card shadow-sm hover:shadow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tỷ lệ Hoàn Thành Khóa Học
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                `${avgCompletionRate}%`
              )}
            </div>
            <div className="mt-2">
              <Progress value={avgCompletionRate} className="h-2 bg-muted" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              {isLoading ? (
                <Skeleton className="h-3 w-full" />
              ) : (
                <>
                  <span>Tổng {totalEnrollments} lượt ghi danh</span>
                  <span className="text-emerald-600 font-semibold">
                    {avgCompletionRate >= 80 ? 'Đạt chỉ tiêu' : 'Đang theo dõi'}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Courses */}
        <Card className="relative overflow-hidden border-border/80 bg-card shadow-sm hover:shadow transition-all sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Chương Trình Đang Hoạt Động
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-9 w-32" />
              ) : (
                <>
                  {publishedCourses}{' '}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {totalCourses} khóa
                  </span>
                </>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>{publishedCourses} khóa đang mở đào tạo</span>
              <span className="mx-1">•</span>
              <span className="text-amber-600 font-medium">{draftCourses} bản nháp</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
              <span>Đào tạo bắt buộc: {mandatoryCourses} khóa</span>
              <Link href={routePath.adminCourses} className="text-primary hover:underline font-medium">
                Xem tất cả &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Activity & Top Courses */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Activities (2 cols) */}
        <Card className="lg:col-span-2 border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Hoạt Động Học Tập Gần Đây</CardTitle>
              <CardDescription className="text-xs">
                Nhật ký hoàn thành bài học, nộp bài kiểm tra và cấp chứng chỉ từ cơ sở dữ liệu
              </CardDescription>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="cursor-pointer gap-1 text-xs text-primary hover:text-primary/90"
            >
              <Link href={routePath.lmsAdminActivities}>
                Xem đầy đủ
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-2.5 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Inbox className="h-8 w-8 stroke-1 mb-2 opacity-60" />
                <p className="text-xs font-medium">Chưa có hoạt động học tập nào gần đây</p>
                <p className="text-[11px] mt-0.5 opacity-80">
                  Khi học viên hoàn thành bài học hoặc nộp bài kiểm tra, lịch sử sẽ xuất hiện tại đây.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                      <th className="py-3 px-4">Nhân sự</th>
                      <th className="py-3 px-4">Hành động</th>
                      <th className="py-3 px-4">Khóa học / Bài học</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                              {act.avatar}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{act.user}</span>
                              <span className="text-[10px] text-muted-foreground">{act.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground font-medium">
                          {act.action}
                        </td>

                        <td className="py-3.5 px-4 text-foreground max-w-[200px] truncate" title={act.target}>
                          {act.target}
                        </td>

                        <td className="py-3.5 px-4">
                          {act.status === 'SUCCESS' && (
                            <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-300 dark:text-emerald-400 font-medium text-[10px]">
                              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {act.statusLabel}
                            </Badge>
                          )}
                          {act.status === 'ACTIVE' && (
                            <Badge className="bg-primary/15 text-primary hover:bg-primary/25 border-primary/30 font-medium text-[10px]">
                              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                              {act.statusLabel}
                            </Badge>
                          )}
                          {act.status === 'FAILED' && (
                            <Badge variant="destructive" className="bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-300 dark:text-red-400 font-medium text-[10px]">
                              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                              {act.statusLabel}
                            </Badge>
                          )}
                          {act.status === 'IN_PROGRESS' && (
                            <Badge variant="secondary" className="text-[10px]">
                              {act.statusLabel}
                            </Badge>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right text-muted-foreground text-[11px] whitespace-nowrap">
                          {formatTimeAgo(act.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Training Programs (1 col) */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-semibold">Khóa Học Nổi Bật</CardTitle>
            <CardDescription className="text-xs">
              Các chương trình có lượng học viên ghi danh cao nhất
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 rounded-lg border p-3 bg-card/60">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                ))}
              </div>
            ) : topCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                <BookOpen className="h-7 w-7 stroke-1 mb-2 opacity-60" />
                <p className="text-xs">Chưa có khóa học nào có học viên ghi danh.</p>
              </div>
            ) : (
              topCourses.map((tc) => (
                <div key={tc.id} className="space-y-1.5 rounded-lg border p-3 bg-card/60">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground line-clamp-1" title={tc.title}>
                      {tc.title}
                    </span>
                    {tc.mandatory && (
                      <Badge variant="outline" className="shrink-0 border-red-300 bg-red-50 text-[9px] text-red-600 dark:bg-red-950/20">
                        Bắt buộc
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{tc.enrolled} nhân viên ghi danh</span>
                    <span className="font-semibold text-foreground">{tc.completion}% hoàn thành</span>
                  </div>
                  <Progress value={tc.completion} className="h-1.5 bg-muted" />
                </div>
              ))
            )}

            <div className="pt-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full cursor-pointer text-xs justify-center gap-1"
              >
                <Link href={routePath.adminCourses}>
                  Quản lý Toàn bộ Khóa học &rarr;
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
