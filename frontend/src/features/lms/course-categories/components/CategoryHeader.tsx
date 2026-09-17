'use client'

import React from 'react'
import Link from 'next/link'
import { Plus, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CategoryHeaderProps {
  onOpenCreate: () => void
}

export function CategoryHeader({ onOpenCreate }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
          <span>Khóa học</span>
          <span>/</span>
          <span className="text-primary">crs_categories</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Danh mục Chương trình Đào tạo
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 max-w-3xl">
          Quản lý các nhóm chương trình đào tạo doanh nghiệp (Hội nhập Onboarding, An toàn ATTP, Vận hành F&amp;B, Kỹ năng lãnh đạo) theo cấu trúc chuẩn Prisma Enterprise.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <Link href="/lms/admin/courses">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Xem Danh sách Khóa học</span>
          </Link>
        </Button>

        <Button onClick={onOpenCreate} size="sm" className="gap-1.5 shadow-sm cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>Thêm Danh mục Mới</span>
        </Button>
      </div>
    </div>
  )
}
