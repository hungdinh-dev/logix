'use client'

import React from 'react'
import { GripVertical, PlayCircle, FileText, Award, Trash2 } from 'lucide-react'
import type { LessonItem } from '../types/course-editor.types'

interface LessonListItemProps {
  lesson: LessonItem
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

export function LessonListItem({ lesson, isSelected, onSelect, onDelete }: LessonListItemProps) {
  return (
    <div
      data-lesson-id={lesson.id}
      onClick={onSelect}
      className={`lesson-item group relative flex items-center justify-between p-2.5 rounded-lg border select-none cursor-pointer transition-all ${
        isSelected
          ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-300 dark:border-orange-600 shadow-xs ring-1 ring-orange-300/50'
          : 'bg-card border-border/70 hover:border-border hover:shadow-xs'
      }`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
        {/* 6-dot Drag Handle */}
        <div
          className="lesson-drag-handle cursor-grab active:cursor-grabbing p-0.5 text-muted-foreground/40 group-hover:text-muted-foreground rounded transition shrink-0"
          title="Kéo để đổi vị trí bài"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {/* Icon Type */}
        {lesson.type === 'VIDEO' && (
          <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <PlayCircle className="w-3.5 h-3.5" />
          </div>
        )}
        {lesson.type === 'ARTICLE' && (
          <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
        )}
        {lesson.type === 'QUIZ' && (
          <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Title */}
        <span
          className={`text-xs truncate ${
            isSelected ? 'font-semibold text-foreground' : 'font-medium text-foreground/90'
          }`}
        >
          {lesson.title}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
        <span className="text-[10px] font-medium text-muted-foreground/80">
          {lesson.durationMinutes}p
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-1 hover:text-red-500 rounded transition opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Xóa bài học"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
