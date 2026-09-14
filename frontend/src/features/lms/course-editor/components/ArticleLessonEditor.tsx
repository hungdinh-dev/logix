'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { UniversalRichEditor } from '@/features/lms/components/editor'
import type { LessonItem } from '../types/course-editor.types'

interface ArticleLessonEditorProps {
  lesson: LessonItem
  onChange: (updated: LessonItem) => void
}

export function ArticleLessonEditor({ lesson, onChange }: ArticleLessonEditorProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4 bg-card shadow-xs">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Mã SOP / Quy chuẩn (Tùy chọn)</Label>
          <Input
            value={lesson.sopCode || ''}
            onChange={(e) => onChange({ ...lesson, sopCode: e.target.value })}
            placeholder="Ví dụ: SOP-SX-01"
            className="text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Thời gian đọc ước tính (phút)</Label>
          <Input
            type="number"
            value={lesson.durationMinutes}
            onChange={(e) => onChange({ ...lesson, durationMinutes: Number(e.target.value) || 5 })}
            className="text-xs"
          />
        </div>
      </div>

      {/* Rich Document Editor with Word-like Tools & Markdown (.md) Storage */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">
            📝 Trình Soạn Thảo Văn Bản &amp; Code / Terminal (Word-like WYSIWYG)
          </span>
          <span className="text-[10px] text-muted-foreground">
            Lưu trữ chuỗi Markdown (.md) an toàn, tối ưu dung lượng DB
          </span>
        </div>

        <UniversalRichEditor
          value={lesson.content || ''}
          onChange={(val) => onChange({ ...lesson, content: val })}
          placeholder="Soạn thảo nội dung bài học tại đây (Hỗ trợ in đậm, in nghiêng, danh sách, khối code, cửa sổ terminal)..."
          minHeight="380px"
        />
      </div>
    </div>
  )
}
