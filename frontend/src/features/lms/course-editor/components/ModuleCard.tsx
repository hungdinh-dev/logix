'use client'

import React from 'react'
import { GripVertical, Trash2, Video, FileText, Award } from 'lucide-react'
import { LessonListItem } from './LessonListItem'
import type { ModuleItem, LessonItem, LessonType } from '../types/course-editor.types'

interface ModuleCardProps {
  module: ModuleItem
  selectedLessonId?: string
  onUpdateTitle: (title: string) => void
  onDeleteModule: () => void
  onSelectLesson: (lesson: LessonItem) => void
  onDeleteLesson: (lessonId: string) => void
  onAddLesson: (type: LessonType) => void
}

export function ModuleCard({
  module,
  selectedLessonId,
  onUpdateTitle,
  onDeleteModule,
  onSelectLesson,
  onDeleteLesson,
  onAddLesson,
}: ModuleCardProps) {
  return (
    <div
      data-section-id={module.id}
      className="section-card bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden transition-all duration-150"
    >
      {/* Module Header (Draggable) */}
      <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <div
            className="section-drag-handle cursor-grab active:cursor-grabbing p-1 text-muted-foreground/60 hover:text-foreground rounded transition shrink-0"
            title="Kéo để đổi thứ tự phần"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={module.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="font-bold text-xs text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:bg-background focus:outline-hidden px-1 py-0.5 rounded flex-1 truncate transition-colors"
            title="Bấm để đổi tên phần"
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
            {module.lessons.length} bài
          </span>
          <button
            type="button"
            onClick={onDeleteModule}
            className="text-muted-foreground/50 hover:text-red-500 p-1 rounded transition cursor-pointer"
            title="Xóa phần này"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Lessons List in Module (SortableJS Connected Area) */}
      <div className="p-2">
        <div
          id={`lesson-list-${module.id}`}
          data-module-id={module.id}
          className="lesson-drop-area space-y-1.5 min-h-[52px] p-1 rounded-lg transition-colors"
        >
          {module.lessons.length === 0 ? (
            <div className="empty-dropzone py-3 px-3 flex flex-col items-center justify-center text-orange-600/80 dark:text-orange-400/80 rounded-lg text-[11px] font-medium gap-1 pointer-events-none border border-dashed border-orange-200 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/20">
              <span>Kéo bài học từ phần khác thả vào đây</span>
            </div>
          ) : (
            module.lessons.map((les) => (
              <LessonListItem
                key={les.id}
                lesson={les}
                isSelected={selectedLessonId === les.id}
                onSelect={() => onSelectLesson(les)}
                onDelete={() => onDeleteLesson(les.id)}
              />
            ))
          )}
        </div>

        {/* Instant Action Buttons (1-Click Add) */}
        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-border/40 mt-1">
          <button
            type="button"
            onClick={() => onAddLesson('VIDEO')}
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 py-1.5 rounded-md transition cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            + Video
          </button>
          <button
            type="button"
            onClick={() => onAddLesson('ARTICLE')}
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 py-1.5 rounded-md transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            + Chữ/SOP
          </button>
          <button
            type="button"
            onClick={() => onAddLesson('QUIZ')}
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 py-1.5 rounded-md transition cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            + Quiz
          </button>
        </div>
      </div>
    </div>
  )
}
