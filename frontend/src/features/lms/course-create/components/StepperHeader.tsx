'use client'

import React from 'react'
import { ArrowLeft, ArrowRight, Save, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StepNumber } from '../types/course-create.types'

interface StepperHeaderProps {
  title?: string
  currentStep: StepNumber
  isSubmitting: boolean
  onCancel: () => void
  onPrev: () => void
  onNext: () => void
  onSubmitDraft: () => void
  onSubmitPublish: () => void
}

export function StepperHeader({
  title,
  currentStep,
  isSubmitting,
  onCancel,
  onPrev,
  onNext,
  onSubmitDraft,
  onSubmitPublish,
}: StepperHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Quay lại Khóa học</span>
        </Button>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-sm font-bold text-foreground truncate max-w-[280px] sm:max-w-md">
          {title || 'Tạo mới khóa học'}
        </h1>
        <Badge variant="outline" className="text-[10px] font-mono bg-amber-500/10 text-amber-600 border-amber-500/30">
          Bản nháp - Draft
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Hủy bỏ
        </Button>

        {currentStep > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            className="gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Chỉnh sửa lại</span>
          </Button>
        )}

        {currentStep === 1 ? (
          <Button
            size="sm"
            onClick={onNext}
            className="gap-1.5 shadow-sm"
          >
            <span>Xem trước & Tiếp tục</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={onSubmitDraft}
              className="gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Save className="h-3.5 w-3.5" />
              <span>Lưu Bản Nháp</span>
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={onSubmitPublish}
              className="gap-1.5 bg-primary shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>Xuất bản khóa học</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
