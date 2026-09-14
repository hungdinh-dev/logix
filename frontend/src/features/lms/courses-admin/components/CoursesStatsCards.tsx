'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, CheckCircle2, Clock, GraduationCap } from 'lucide-react'

interface CoursesStatsCardsProps {
  totalCourses: number
  totalCategories: number
  publishedCount: number
  draftCount: number
  archivedCount: number
  totalEnrollments: number
}

export function CoursesStatsCards({
  totalCourses,
  totalCategories,
  publishedCount,
  draftCount,
  archivedCount,
  totalEnrollments,
}: CoursesStatsCardsProps) {
  const publishedPercent = totalCourses > 0 ? Math.round((publishedCount / totalCourses) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng số khóa */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Khóa Học</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalCourses}</div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            <span className="font-semibold text-primary">{totalCategories}</span> danh mục phân loại
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Đang phát hành */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Đang Phát Hành</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {publishedCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Chiếm <span className="font-semibold text-foreground">{publishedPercent}%</span> tổng số khóa học
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Bản nháp & Lưu trữ */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Bản Nháp / Lưu Trữ</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {draftCount} <span className="text-xs font-normal text-muted-foreground">nháp</span> / {archivedCount}{' '}
            <span className="text-xs font-normal text-muted-foreground">lưu</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Khóa học chưa sẵn sàng mở đào tạo</p>
        </CardContent>
      </Card>

      {/* Card 4: Học viên ghi danh */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Lượt Ghi Danh</CardTitle>
          <GraduationCap className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalEnrollments}</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Nhân viên đang & đã tham gia học tập
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
