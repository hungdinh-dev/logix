'use client'

import React from 'react'
import {
  Sparkles,
  Sun,
  Moon,
  Clock,
  Compass,
  Lock,
  Layers,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MarkdownLessonViewer } from '@/features/lms/components/viewer'
import { CreateCoursePayload, PreviewTheme } from '../types/course-create.types'

interface Step2PreviewPublishProps {
  formData: CreateCoursePayload
  previewTheme: PreviewTheme
  setPreviewTheme: (theme: PreviewTheme) => void
  selectedCategory?: any
  targetAudienceLabel: string
  hasDurationLimit: boolean
  isSubmitting: boolean
  onSubmitDraft: () => void
  onSubmitPublish: () => void
}

export function Step2PreviewPublish({
  formData,
  previewTheme,
  setPreviewTheme,
  selectedCategory,
  targetAudienceLabel,
  hasDurationLimit,
  isSubmitting,
  onSubmitDraft,
  onSubmitPublish,
}: Step2PreviewPublishProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>2. Xem trước & Xuất bản Khóa học</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Kiểm tra hiển thị Thumbnail và nhận diện thẻ khóa học trên cả 2 giao diện Sáng (Light) và Tối (Dark).
            </CardDescription>
          </div>

          {/* Theme Selector Toggle */}
          <div className="flex items-center gap-2 bg-background p-1 rounded-xl border shadow-sm">
            <button
              type="button"
              onClick={() => setPreviewTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                previewTheme === 'light'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Giao diện Sáng (Light)</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                previewTheme === 'dark'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              <span>Giao diện Tối (Dark)</span>
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Simulated Preview Box */}
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              previewTheme === 'dark'
                ? 'bg-[#0f172a] text-slate-100 border-slate-800'
                : 'bg-[#f8fafc] text-slate-900 border-slate-200'
            }`}
          >
            <div className="max-w-md mx-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-2 opacity-60">
                Mẫu thẻ hiển thị trên Catalog học viên:
              </span>

              {/* Course Card Preview Component */}
              <div
                className={`rounded-xl border overflow-hidden shadow-md transition-all ${
                  previewTheme === 'dark'
                    ? 'bg-[#1e293b] border-slate-700/80 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Thumbnail 16:9 */}
                <div className="aspect-video w-full relative overflow-hidden bg-slate-800">
                  <img
                    src={formData.thumbnailUrl}
                    alt={formData.title || 'Course'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <Badge
                      className={`text-[10px] font-bold px-2 py-0.5 border-0 ${
                        formData.courseType === 'ATTP'
                          ? 'bg-rose-600 text-white'
                          : formData.courseType === 'ONBOARDING'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {formData.courseType === 'ATTP'
                        ? 'ATTP / HSE'
                        : formData.courseType === 'ONBOARDING'
                          ? 'Onboarding'
                          : 'Tiêu chuẩn'}
                    </Badge>

                    {formData.isMandatory && (
                      <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 border-0">
                        Bắt buộc
                      </Badge>
                    )}
                  </div>

                  <Badge className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-mono backdrop-blur-sm border-0">
                    {hasDurationLimit ? `${formData.durationDays} ngày SLA` : 'Vô thời hạn'}
                  </Badge>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold ${
                        previewTheme === 'dark' ? 'text-primary-foreground/80' : 'text-primary'
                      }`}
                    >
                      {selectedCategory?.name || 'Danh mục chung'}
                    </span>
                    <span className="text-[10px] font-mono opacity-60">
                      {formData.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm line-clamp-2 leading-snug">
                    {formData.title || 'Chưa đặt tên khóa học'}
                  </h3>

                  <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                    {formData.description || 'Chưa có mô tả tóm tắt cho khóa học.'}
                  </p>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] opacity-80">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{hasDurationLimit ? `${formData.durationDays} ngày` : 'Vô thời hạn'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {formData.progressionMode === 'FREE' ? (
                        <>
                          <Compass className="h-3 w-3 text-emerald-500" />
                          <span>Tự do duyệt</span>
                        </>
                      ) : formData.progressionMode === 'LINEAR_LESSON' ? (
                        <>
                          <Lock className="h-3 w-3 text-amber-500" />
                          <span>Học tuần tự bài</span>
                        </>
                      ) : (
                        <>
                          <Layers className="h-3 w-3 text-indigo-500" />
                          <span>Tuần tự Module</span>
                        </>
                      )}
                    </div>
                    <span className="text-primary font-bold">Vào học →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Markdown Detailed Description Preview */}
          {formData.description && (
            <div className="rounded-xl border p-5 bg-card/60 space-y-3">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Chi tiết Mô tả &amp; Mục tiêu đầu ra (Xem trước)
              </span>
              <div className="pt-2 border-t border-border/60">
                <MarkdownLessonViewer content={formData.description} />
              </div>
            </div>
          )}

          {/* Summary Configuration Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
              <span className="text-muted-foreground block text-[10px]">Mã khóa học:</span>
              <span className="font-mono font-bold text-foreground block">{formData.code}</span>
            </div>

            <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
              <span className="text-muted-foreground block text-[10px]">Đường dẫn URL:</span>
              <span className="font-mono font-bold text-primary block truncate">/courses/{formData.slug || '---'}</span>
            </div>

            <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
              <span className="text-muted-foreground block text-[10px]">Chế độ học:</span>
              <span className="font-bold text-foreground block">
                {formData.progressionMode === 'FREE'
                  ? 'Tự do lựa chọn'
                  : formData.progressionMode === 'LINEAR_LESSON'
                    ? 'Tuần tự bài học'
                    : 'Tuần tự theo Module'}
              </span>
            </div>

            <div className="p-3 rounded-xl border bg-muted/20 space-y-0.5">
              <span className="text-muted-foreground block text-[10px]">Đối tượng áp dụng:</span>
              <span className="font-bold text-emerald-600 block truncate">
                {targetAudienceLabel}
              </span>
            </div>
          </div>

          {/* Action Trigger Box */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-foreground">
                Sẵn sàng khởi tạo giáo trình?
              </h4>
              <p className="text-xs text-muted-foreground">
                Sau khi tạo, hệ thống sẽ chuyển bạn trực tiếp tới Trình soạn thảo Giáo trình (Curriculum Builder) để bắt đầu thêm Chương, Video bài giảng và Bài thi trắc nghiệm.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={onSubmitDraft}
              >
                Lưu Bản Nháp
              </Button>
              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={onSubmitPublish}
                className="gap-1.5 bg-primary shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span>Tạo & Soạn Giáo trình</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
