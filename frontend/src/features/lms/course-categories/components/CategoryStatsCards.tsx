'use client'

import React from 'react'
import { FolderTree, CheckCircle2, BookOpen, TrendingUp, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CategoryStats } from '../types/course-categories.types'

interface CategoryStatsCardsProps {
  stats: CategoryStats
  isLoading: boolean
}

export function CategoryStatsCards({ stats, isLoading }: CategoryStatsCardsProps) {
  const { totalCategories, activeCategoriesCount, totalCourses, mandatoryCoursesCount } = stats

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Tổng danh mục */}
      <Card className="relative overflow-hidden border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Tổng danh mục
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FolderTree className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-14" /> : totalCategories}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% indexed schema</span>
          </p>
        </CardContent>
      </Card>

      {/* KPI 2: Đang hoạt động */}
      <Card className="relative overflow-hidden border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Đang hoạt động
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-14" /> : activeCategoriesCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalCategories > 0
              ? `${Math.round((activeCategoriesCount / totalCategories) * 100)}% khả dụng`
              : 'Chưa có dữ liệu'}
          </p>
        </CardContent>
      </Card>

      {/* KPI 3: Khóa học liên kết */}
      <Card className="relative overflow-hidden border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Khóa học liên kết
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <BookOpen className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-14" /> : totalCourses}
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-indigo-600 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Quan hệ 1-N `_count.courses`</span>
          </p>
        </CardContent>
      </Card>

      {/* KPI 4: Khóa học bắt buộc */}
      <Card className="relative overflow-hidden border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Khóa học bắt buộc (Mandatory)
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-14" /> : mandatoryCoursesCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Tuân thủ pháp chế &amp; SLA hội nhập
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
