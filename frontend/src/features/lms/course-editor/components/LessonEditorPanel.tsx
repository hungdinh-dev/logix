'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { VideoLessonEditor } from './VideoLessonEditor'
import { ArticleLessonEditor } from './ArticleLessonEditor'
import { QuizLessonEditor } from './QuizLessonEditor'
import { LessonResourcesEditor } from './LessonResourcesEditor'
import type { LessonItem } from '../types/course-editor.types'

interface LessonEditorPanelProps {
  selectedLesson: LessonItem | null
  onChange: (updated: LessonItem) => void
  onAddQuizQuestion: () => void
  onOpenBulkModal: () => void
}

export function LessonEditorPanel({
  selectedLesson,
  onChange,
  onAddQuizQuestion,
  onOpenBulkModal,
}: LessonEditorPanelProps) {
  if (!selectedLesson) {
    return (
      <main className="flex-1 flex items-center justify-center text-muted-foreground text-xs bg-card/10 p-6">
        Chọn một bài học từ danh sách bên trái để bắt đầu chỉnh sửa nội dung
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 bg-card/10">
      <div className="max-w-4xl space-y-6 mx-auto w-full">
        {/* Lesson Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {selectedLesson.type === 'VIDEO' && (
                <Badge className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-200 text-xs font-semibold">
                  🎥 Dạng Video Bài Giảng
                </Badge>
              )}
              {selectedLesson.type === 'ARTICLE' && (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 text-xs font-semibold">
                  📄 Dạng Văn Bản / Tài Liệu SOP
                </Badge>
              )}
              {selectedLesson.type === 'QUIZ' && (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 text-xs font-semibold">
                  🏆 Dạng Bài Kiểm Tra (Quiz)
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Thời lượng ước tính: {selectedLesson.durationMinutes} phút
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{selectedLesson.title}</h2>
          </div>
        </div>

        {/* Lesson Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tên tiêu đề bài học</Label>
            <Input
              value={selectedLesson.title}
              onChange={(e) => onChange({ ...selectedLesson, title: e.target.value })}
              className="text-xs"
            />
          </div>

          {/* Sub-editors based on Lesson Type */}
          {selectedLesson.type === 'VIDEO' && (
            <VideoLessonEditor
              lesson={selectedLesson}
              onChange={onChange}
              onOpenBulkModal={onOpenBulkModal}
            />
          )}

          {selectedLesson.type === 'ARTICLE' && (
            <ArticleLessonEditor lesson={selectedLesson} onChange={onChange} />
          )}

          {selectedLesson.type === 'QUIZ' && (
            <QuizLessonEditor
              lesson={selectedLesson}
              onChange={onChange}
              onAddQuestion={onAddQuizQuestion}
            />
          )}

          {/* Inline Resources Editor for all lesson types */}
          <LessonResourcesEditor lesson={selectedLesson} onChange={onChange} />
        </div>
      </div>
    </main>
  )
}
