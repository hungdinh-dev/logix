'use client'

import React from 'react'
import {
  BookOpen,
  RefreshCw,
  CheckCircle2,
  CheckCircle,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UniversalRichEditor } from '@/features/lms/components/editor'
import { CreateCoursePayload, SAMPLE_THUMBNAILS } from '../types/course-create.types'

interface CourseCoreInfoCardProps {
  formData: CreateCoursePayload
  setFormData: React.Dispatch<React.SetStateAction<CreateCoursePayload>>
  categories: any[]
  isLoadingCategories?: boolean
  onTitleChange: (val: string) => void
  onSlugChange: (val: string) => void
  onRegenerateCode: () => void
}

export function CourseCoreInfoCard({
  formData,
  setFormData,
  categories,
  isLoadingCategories,
  onTitleChange,
  onSlugChange,
  onRegenerateCode,
}: CourseCoreInfoCardProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Thông tin cốt lõi</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Tên hiển thị, định danh hệ thống và phân mục
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
          Bắt buộc
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {/* Tên khóa học */}
        <div className="space-y-1.5">
          <Label htmlFor="course-title" className="font-semibold text-xs">
            Tên khóa học <span className="text-destructive">*</span>
          </Label>
          <Input
            id="course-title"
            placeholder="vd: Chương trình Đào tạo Hội nhập Nhân sự Mới 2026"
            value={formData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full text-sm font-medium"
            required
          />
        </div>

        {/* Mã Code tự sinh & Danh mục (2 cột cân đối full-width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mã Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="course-code" className="font-semibold text-xs">
                Mã Code tự sinh <span className="text-destructive">*</span>
              </Label>
              <button
                type="button"
                onClick={onRegenerateCode}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Tái tạo</span>
              </button>
            </div>
            <div className="relative">
              <Input
                id="course-code"
                placeholder="CRS-2026-ONB01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full font-mono uppercase font-semibold text-xs pr-8"
                required
              />
              {formData.code && (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 absolute right-2.5 top-2.5 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Danh mục */}
          <div className="space-y-1.5">
            <Label htmlFor="course-category" className="font-semibold text-xs">
              Danh mục đào tạo (Category) <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
              disabled={isLoadingCategories}
            >
              <SelectTrigger id="course-category" className="w-full text-xs">
                {isLoadingCategories ? (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang tải danh mục...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Chọn danh mục..." />
                )}
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-xs">
                    {cat.name} ({cat.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Đường dẫn tĩnh (Slug URL) tách riêng biệt */}
        <div className="space-y-1.5">
          <Label htmlFor="course-slug" className="font-semibold text-xs">
            Đường dẫn tĩnh (Slug URL)
          </Label>
          <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
            <span className="inline-flex items-center px-3 bg-muted text-muted-foreground text-xs font-mono border-r select-none shrink-0">
              digifnb.vn/courses/
            </span>
            <input
              id="course-slug"
              type="text"
              placeholder="chuong-trinh-dao-tao-hoi-nhap-2026"
              value={formData.slug}
              onChange={(e) => onSlugChange(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-xs font-mono focus:outline-none w-full"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Đường dẫn thân thiện giúp học viên và đối tác truy cập nhanh chóng.
          </p>
        </div>

        {/* Mô tả khóa học & Mục tiêu đầu ra (Markdown Word-like Rich Editor) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="course-desc" className="font-semibold text-xs">
              Mô tả khóa học & Mục tiêu đầu ra
            </Label>
            <span className="text-[10px] text-muted-foreground">
              Hỗ trợ định dạng Word-like, danh sách mục tiêu &amp; lưu chuỗi Markdown (.md)
            </span>
          </div>
          <UniversalRichEditor
            value={formData.description || ''}
            onChange={(val) => setFormData({ ...formData, description: val })}
            placeholder="Ví dụ:&#10;# Giới thiệu khóa học&#10;Khóa học trang bị cho học viên toàn bộ kiến thức và kỹ năng...&#10;&#10;### Mục tiêu đầu ra:&#10;- Nắm vững quy trình vận hành&#10;- Sử dụng thành thạo hệ thống"
            minHeight="180px"
          />
        </div>

        {/* Ảnh đại diện / Thumbnail Khóa học (Chuẩn 16:9) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-xs">
              Ảnh đại diện / Thumbnail Khóa học (Chuẩn 16:9)
            </Label>
            <span className="text-[10px] text-muted-foreground">
              Khuyên dùng: 1280 × 720 px, tối đa 5MB
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-dashed bg-muted/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5 relative aspect-video rounded-lg overflow-hidden border bg-muted group">
                {formData.thumbnailUrl ? (
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="h-6 w-6 mb-1 opacity-40" />
                    <span className="text-[10px]">Chưa có ảnh</span>
                  </div>
                )}
                <Badge className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0">
                  16:9 HD
                </Badge>
              </div>

              <div className="sm:col-span-7 space-y-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-foreground block">
                    Nhập URL ảnh hoặc dán link:
                  </span>
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnailUrl || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] gap-1 py-0.5">
                    <CheckCircle className="h-3 w-3" />
                    <span>Đã tải ảnh chuẩn HD</span>
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Thumbnail Samples */}
            <div className="pt-2 border-t">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Hoặc chọn ảnh mẫu nhanh:
              </span>
              <div className="flex gap-2">
                {SAMPLE_THUMBNAILS.map((thumb, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnailUrl: thumb })}
                    className={`h-9 w-14 rounded border overflow-hidden relative transition-all ${
                      formData.thumbnailUrl === thumb
                        ? 'ring-2 ring-primary border-transparent'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb} alt="sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
