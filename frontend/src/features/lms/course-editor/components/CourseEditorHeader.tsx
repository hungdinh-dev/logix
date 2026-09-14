'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight, Eye, Save, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { routePath } from '@/config/route-path'

interface CourseEditorHeaderProps {
  courseId: string
  courseTitle: string
  isPublished: boolean
  hasUnsavedChanges: boolean
  saveSuccess: boolean
  isSaving: boolean
  onSave: () => void
}

export function CourseEditorHeader({
  courseId,
  courseTitle,
  isPublished,
  hasUnsavedChanges,
  saveSuccess,
  isSaving,
  onSave,
}: CourseEditorHeaderProps) {
  const router = useRouter()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-6 bg-card/60 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
        >
          <Link href={routePath.adminCourses}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href={routePath.adminCourses} className="hover:text-foreground">
            Quản lý Khóa học
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-foreground max-w-[260px] truncate">
            {courseTitle || 'Đang tải khóa học...'}
          </span>
        </div>

        <Badge variant={isPublished ? 'default' : 'secondary'} className="text-[10px] ml-2">
          {isPublished ? 'Đang phát hành' : 'Bản nháp'}
        </Badge>

        {/* Unsaved Changes Status Indicator */}
        {hasUnsavedChanges && (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 animate-pulse text-[10px] gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Có thay đổi chưa lưu
          </Badge>
        )}

        {saveSuccess && (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 text-[10px] gap-1">
            <Check className="h-3 w-3" />
            Đã lưu giáo trình thành công
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="cursor-pointer gap-1.5 text-xs font-medium"
        >
          <Link href={`/lms/courses/${courseId}`}>
            <Eye className="h-3.5 w-3.5 text-primary" />
            Xem trước giao diện học
          </Link>
        </Button>

        {/* Prominent Save Button with visual change on dirty state */}
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className={`cursor-pointer gap-1.5 text-xs shadow-sm transition-all duration-200 ${
            hasUnsavedChanges
              ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400/50 shadow-md font-bold'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              {hasUnsavedChanges ? <span>Lưu thay đổi</span> : <span>Lưu Giáo Trình</span>}
            </>
          )}
        </Button>
      </div>
    </header>
  )
}
