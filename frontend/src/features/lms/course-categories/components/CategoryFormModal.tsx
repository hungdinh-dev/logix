'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { BackendCategory } from '@/features/lms/types/course.types'
import type { CategoryFormData } from '../types/course-categories.types'

interface CategoryFormModalProps {
  isOpen: boolean
  editingCategory: BackendCategory | null
  formData: CategoryFormData
  isSubmitting: boolean
  onClose: () => void
  onFormDataChange: (data: CategoryFormData) => void
  onSubmit: (e: React.FormEvent) => void
}

export function CategoryFormModal({
  isOpen,
  editingCategory,
  formData,
  isSubmitting,
  onClose,
  onFormDataChange,
  onSubmit,
}: CategoryFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Chỉnh sửa Danh mục Chương trình' : 'Thêm Danh mục Chương trình Mới'}
            </DialogTitle>
            <DialogDescription>
              Khai báo mã code và thông tin nhóm đào tạo theo cấu trúc chuẩn cơ sở dữ liệu.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-code">
                Mã Danh mục (Code) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-code"
                placeholder="vd: ONBOARDING, FOOD_SAFETY, OPS..."
                value={formData.code}
                onChange={(e) =>
                  onFormDataChange({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-name">
                Tên Danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="vd: Hội nhập Onboarding, An toàn Thực phẩm..."
                value={formData.name}
                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Mô tả tóm tắt</Label>
              <Textarea
                id="cat-desc"
                placeholder="Mô tả phạm vi và mục tiêu của nhóm chương trình đào tạo này..."
                value={formData.description || ''}
                onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-order">Thứ tự hiển thị</Label>
              <Input
                id="cat-order"
                type="number"
                min={1}
                value={formData.sortOrder || 1}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    sortOrder: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-1.5 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
