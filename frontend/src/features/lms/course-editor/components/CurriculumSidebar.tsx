'use client'

import React from 'react'
import { Layers, FolderPlus, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModuleCard } from './ModuleCard'
import type { ModuleItem, LessonItem, LessonType } from '../types/course-editor.types'

interface CurriculumSidebarProps {
  modules: ModuleItem[]
  selectedLessonId?: string
  sectionsContainerRef: React.RefObject<HTMLDivElement | null>
  onAddModule: () => void
  onUpdateModuleTitle: (moduleId: string, title: string) => void
  onDeleteModule: (moduleId: string) => void
  onSelectLesson: (lesson: LessonItem, moduleId: string) => void
  onDeleteLesson: (moduleId: string, lessonId: string) => void
  onAddLesson: (moduleId: string, type: LessonType) => void
}

export function CurriculumSidebar({
  modules,
  selectedLessonId,
  sectionsContainerRef,
  onAddModule,
  onUpdateModuleTitle,
  onDeleteModule,
  onSelectLesson,
  onDeleteLesson,
  onAddLesson,
}: CurriculumSidebarProps) {
  return (
    <aside className="w-96 shrink-0 border-r bg-card/40 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-3 px-4 bg-card/60">
        <div className="flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Cấu trúc Giáo trình
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddModule}
          className="h-7 cursor-pointer gap-1 px-2.5 text-[11px] font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <FolderPlus className="h-3.5 w-3.5 text-primary group-hover:text-current" />
          + Thêm Phần
        </Button>
      </div>

      <div className="bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200/70 dark:border-amber-900/50 px-3.5 py-2 text-[11px] text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2 shadow-2xs">
        <GripVertical className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Kéo &amp; thả để đổi thứ tự các phần và bài học (kéo xuyên chương)</span>
      </div>

      {/* Module & Lessons List with SortableJS */}
      <div
        ref={sectionsContainerRef}
        id="sections-container"
        className="flex-1 overflow-y-auto p-3 space-y-3.5"
      >
        {modules.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground space-y-3 border border-dashed rounded-xl m-2 bg-muted/20">
            <Layers className="h-6 w-6 text-muted-foreground/40 mx-auto" />
            <p>Khóa học chưa có phân đoạn / chương nào.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddModule}
              className="text-xs gap-1 cursor-pointer"
            >
              <FolderPlus className="h-3.5 w-3.5 text-primary" />
              + Thêm Phần đầu tiên
            </Button>
          </div>
        ) : (
          modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              selectedLessonId={selectedLessonId}
              onUpdateTitle={(title) => onUpdateModuleTitle(mod.id, title)}
              onDeleteModule={() => onDeleteModule(mod.id)}
              onSelectLesson={(les) => onSelectLesson(les, mod.id)}
              onDeleteLesson={(lesId) => onDeleteLesson(mod.id, lesId)}
              onAddLesson={(type) => onAddLesson(mod.id, type)}
            />
          ))
        )}
      </div>
    </aside>
  )
}
