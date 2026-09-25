'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import type { ProgressStats } from '../types/progress-tracking.types'

interface ProgressStatsCardsProps {
  stats?: ProgressStats
  isLoading?: boolean
}

export function ProgressStatsCards({ stats, isLoading }: ProgressStatsCardsProps) {
  const total = stats?.totalEnrollments ?? 0
  const completed = stats?.completedCount ?? 0
  const inProgress = stats?.inProgressCount ?? 0
  const avgRate = stats?.avgCompletionRate ?? 0

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng Lượt Ghi Danh */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Lượt Ghi Danh</CardTitle>
          <GraduationCap className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : total.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
            Nhân sự tham gia chương trình đào tạo
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Đã Hoàn Thành */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Đã Hoàn Thành (Đạt)</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? '...' : completed.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Chiếm <span className="font-semibold text-foreground">{completedPct}%</span> tổng lượt ghi danh
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Đang Học Tập */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Đang Trong Tiến Trình</CardTitle>
          <Clock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {isLoading ? '...' : inProgress.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Chiếm <span className="font-semibold text-foreground">{inProgressPct}%</span> nhân sự đang học
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Tỷ Lệ Hoàn Thành TB */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Tiến Độ TB Toàn Hệ Thống</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {isLoading ? '...' : `${avgRate}%`}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Tỷ lệ hoàn thành trung bình các khóa học
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
