'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, FileQuestion, BookCheck, GraduationCap } from 'lucide-react'
import type { ActivitiesStats } from '../types/activities.types'

interface ActivitiesStatsCardsProps {
  stats?: ActivitiesStats
  isLoading?: boolean
}

export function ActivitiesStatsCards({ stats, isLoading }: ActivitiesStatsCardsProps) {
  const total = stats?.totalActivities ?? 0
  const quiz = stats?.quizCount ?? 0
  const lesson = stats?.lessonCount ?? 0
  const course = stats?.courseCount ?? 0

  const quizPct = total > 0 ? Math.round((quiz / total) * 100) : 0
  const lessonPct = total > 0 ? Math.round((lesson / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng Hoạt Động */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Lượt Hoạt Động</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : total.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            Ghi nhận từ nhật ký học tập toàn hệ thống
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Bài Kiểm Tra Quiz */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Lượt Làm Bài Kiểm Tra</CardTitle>
          <FileQuestion className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? '...' : quiz.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Chiếm <span className="font-semibold text-foreground">{quizPct}%</span> tổng lượt hoạt động
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Tiến Trình Bài Học */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Hoàn Thành Bài Học</CardTitle>
          <BookCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {isLoading ? '...' : lesson.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Chiếm <span className="font-semibold text-foreground">{lessonPct}%</span> tiến trình nội dung
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Ghi Danh & Khóa Học */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Ghi Danh Khóa Học</CardTitle>
          <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {isLoading ? '...' : course.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Lượt phân bổ hoặc tham gia khóa học mới
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
