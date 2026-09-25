'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Database, FileSpreadsheet } from 'lucide-react'
import type { QuestionBankItem, CreateQuestionBankInput } from '../types/question-banks.types'

interface CreateBankModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: QuestionBankItem | null
  categories: Array<{ id: string; name: string; code: string }>
  onSubmit: (data: CreateQuestionBankInput) => Promise<void>
  isSubmitting: boolean
}

export function CreateBankModal({
  isOpen,
  onClose,
  initialData,
  categories,
  onSubmit,
  isSubmitting,
}: CreateBankModalProps) {
  const isEdit = Boolean(initialData)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionBankInput>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      categoryId: undefined,
      googleSheetUrl: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        description: initialData.description || '',
        categoryId: initialData.categoryId || undefined,
        googleSheetUrl: initialData.googleSheetUrl || '',
        isActive: initialData.isActive,
      })
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        categoryId: undefined,
        googleSheetUrl: '',
        isActive: true,
      })
    }
  }, [initialData, reset, isOpen])

  const selectedCategoryId = watch('categoryId')

  const handleFormSubmit = async (values: CreateQuestionBankInput) => {
    await onSubmit({
      ...values,
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      categoryId: values.categoryId || undefined,
      googleSheetUrl: values.googleSheetUrl?.trim() || undefined,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card border-border">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {isEdit ? 'Chỉnh sửa ngân hàng câu hỏi' : 'Tạo ngân hàng câu hỏi mới'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {isEdit
                    ? 'Cập nhật thông tin ngân hàng câu hỏi và nguồn đồng bộ.'
                    : 'Kho chứa tập trung câu hỏi trắc nghiệm, hỗ trợ đồng bộ tự động và tạo đề thi ngẫu nhiên.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Mã & Danh mục */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-xs font-semibold text-foreground">
                  Mã ngân hàng <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="code"
                  placeholder="VD: QB_JAVASCRIPT_CORE"
                  className="font-mono uppercase text-xs"
                  disabled={isEdit}
                  {...register('code', {
                    required: 'Mã ngân hàng là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9_-]+$/,
                      message: 'Chỉ chấp nhận chữ in hoa, số, gạch dưới và gạch ngang',
                    },
                  })}
                />
                {errors.code && (
                  <p className="text-[11px] text-destructive">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-foreground">
                  Danh mục khóa học
                </Label>
                <Select
                  value={selectedCategoryId || 'none'}
                  onValueChange={(val) => setValue('categoryId', val === 'none' ? undefined : val)}
                >
                  <SelectTrigger id="category" className="text-xs">
                    <SelectValue placeholder="Chọn danh mục áp dụng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-xs">
                      -- Không phân danh mục --
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="text-xs">
                        {cat.name} ({cat.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tên ngân hàng */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                Tên ngân hàng câu hỏi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Ngân hàng câu hỏi Lập trình JavaScript Chuyên Sâu"
                className="text-xs"
                {...register('name', { required: 'Tên ngân hàng là bắt buộc' })}
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Mô tả */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-foreground">
                Mô tả mục đích sử dụng
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="VD: Chứa 200 câu hỏi trắc nghiệm phục vụ bài thi cuối khóa Javascript Mastery..."
                className="text-xs resize-none"
                {...register('description')}
              />
            </div>

            {/* Nguồn đồng bộ Google Sheet */}
            <div className="p-3.5 bg-muted/30 border border-border/80 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-foreground">
                  Liên kết Google Sheets (Tùy chọn)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Nhập link Google Sheet chia sẻ ở chế độ &quot;Bất kỳ ai có liên kết đều có thể xem&quot; để
                đồng bộ 1-click hoặc tự động hóa bằng AI Agent.
              </p>
              <Input
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                className="text-xs font-mono"
                {...register('googleSheetUrl')}
              />
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border bg-muted/20 flex items-center justify-between sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{isEdit ? 'Cập nhật ngân hàng' : 'Tạo ngân hàng'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
