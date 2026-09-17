'use client'

import React from 'react'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { BackendCategory } from '@/features/lms/types/course.types'

interface CategoryDeleteDialogProps {
  deletingCategory: BackendCategory | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export function CategoryDeleteDialog({
  deletingCategory,
  isDeleting,
  onClose,
  onConfirm,
}: CategoryDeleteDialogProps) {
  const linkedCoursesCount = (deletingCategory as any)?._count?.courses || 0
  const hasLinkedCourses = linkedCoursesCount > 0

  return (
    <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Xác nhận xóa danh mục?</span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-1 text-muted-foreground">
              <p>
                Bạn đang yêu cầu xóa danh mục{' '}
                <strong className="text-foreground">{deletingCategory?.name}</strong> (
                <span className="font-mono">{deletingCategory?.code}</span>).
              </p>

              {hasLinkedCourses ? (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-destructive space-y-1">
                  <p className="font-semibold text-xs flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Không thể xóa danh mục này!
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Danh mục này hiện đang có <strong>{linkedCoursesCount} khóa học</strong> liên kết.
                    Để đảm bảo tính toàn vẹn dữ liệu, bạn cần chuyển các khóa học sang danh mục khác trước khi xóa.
                  </p>
                </div>
              ) : (
                <p className="text-xs">
                  Danh mục này chưa có khóa học nào liên kết và có thể xóa an toàn.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {hasLinkedCourses ? 'Đã hiểu & Đóng' : 'Hủy'}
          </AlertDialogCancel>
          {!hasLinkedCourses && (
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
              disabled={isDeleting}
              onClick={() => deletingCategory && onConfirm(deletingCategory.id)}
            >
              {isDeleting ? 'Đang xóa...' : 'Xác nhận Xóa'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
