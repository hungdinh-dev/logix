'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CreateCoursePayload, TargetingValues } from '../types/course-create.types'
import { CourseCoreInfoCard } from './CourseCoreInfoCard'
import { CourseTrainingAttributesCard } from './CourseTrainingAttributesCard'

interface Step1BasicInfoProps {
  formData: CreateCoursePayload
  setFormData: React.Dispatch<React.SetStateAction<CreateCoursePayload>>
  categories: any[]
  isLoadingCategories?: boolean
  targeting: TargetingValues
  setTargeting: (val: TargetingValues) => void
  targetAudienceLabel: string
  hasDurationLimit: boolean
  setHasDurationLimit: (val: boolean) => void
  certificateTemplates: any[]
  isLoadingCertificates?: boolean
  onTitleChange: (val: string) => void
  onSlugChange: (val: string) => void
  onRegenerateCode: () => void
}

export function Step1BasicInfo({
  formData,
  setFormData,
  categories,
  isLoadingCategories,
  targeting,
  setTargeting,
  targetAudienceLabel,
  hasDurationLimit,
  setHasDurationLimit,
  certificateTemplates,
  isLoadingCertificates,
  onTitleChange,
  onSlugChange,
  onRegenerateCode,
}: Step1BasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-background p-5 rounded-xl border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-[11px]">
              Phân hệ 1: Cấu hình Khóa học
            </Badge>
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Thông tin cơ bản & Phân loại Khóa học
          </h2>
          <p className="text-xs text-muted-foreground">
            Thiết lập thông tin định danh, các chuẩn đào tạo bắt buộc, thời hạn hiệu lực và chính sách lưu hành nội bộ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-lg border bg-muted/30 text-right">
            <span className="text-[10px] font-medium text-muted-foreground block">Mã Khóa học</span>
            <span className="font-mono font-bold text-xs text-primary">{formData.code || '---'}</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg border bg-muted/30 text-right">
            <span className="text-[10px] font-medium text-muted-foreground block">Đối tượng</span>
            <span className="font-bold text-xs text-emerald-600 truncate max-w-[140px] block">
              {targetAudienceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI: THÔNG TIN CỐT LÕI (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CourseCoreInfoCard
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            onTitleChange={onTitleChange}
            onSlugChange={onSlugChange}
            onRegenerateCode={onRegenerateCode}
          />
        </div>

        {/* CỘT PHẢI: THUỘC TÍNH ĐÀO TẠO & LƯU HÀNH (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <CourseTrainingAttributesCard
            formData={formData}
            setFormData={setFormData}
            hasDurationLimit={hasDurationLimit}
            setHasDurationLimit={setHasDurationLimit}
            certificateTemplates={certificateTemplates}
            isLoadingCertificates={isLoadingCertificates}
            targeting={targeting}
            setTargeting={setTargeting}
          />
        </div>
      </div>
    </div>
  )
}
