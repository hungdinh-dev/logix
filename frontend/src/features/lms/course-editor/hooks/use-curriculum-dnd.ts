'use client'

import { useEffect, useRef } from 'react'
import Sortable from 'sortablejs'
import { toast } from 'sonner'
import type { ModuleItem } from '../types/course-editor.types'

interface UseCurriculumDndProps {
  modules: ModuleItem[]
  setModules: React.Dispatch<React.SetStateAction<ModuleItem[]>>
  setHasUnsavedChanges: (dirty: boolean) => void
  sectionsContainerRef: React.RefObject<HTMLDivElement | null>
}

export function useCurriculumDnd({
  modules,
  setModules,
  setHasUnsavedChanges,
  sectionsContainerRef,
}: UseCurriculumDndProps) {
  const modulesRef = useRef<ModuleItem[]>(modules)
  modulesRef.current = modules

  const lessonSortablesRef = useRef<Sortable[]>([])
  const sectionSortableRef = useRef<Sortable | null>(null)

  useEffect(() => {
    // Clean up previous Sortable instances
    lessonSortablesRef.current.forEach((inst) => inst.destroy())
    lessonSortablesRef.current = []

    if (sectionSortableRef.current) {
      sectionSortableRef.current.destroy()
      sectionSortableRef.current = null
    }

    // 1. Setup Sortable for Modules
    if (sectionsContainerRef.current) {
      sectionSortableRef.current = new Sortable(sectionsContainerRef.current, {
        animation: 220,
        handle: '.section-drag-handle',
        draggable: '.section-card',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex == null || newIndex == null || oldIndex === newIndex) return

          // Restore DOM node order so React reconciler matches correctly
          if (evt.from && evt.item) {
            evt.from.removeChild(evt.item)
            const refNode = evt.from.children[oldIndex] || null
            evt.from.insertBefore(evt.item, refNode)
          }

          const currentModules = [...modulesRef.current]
          const [moved] = currentModules.splice(oldIndex, 1)
          currentModules.splice(newIndex, 0, moved)
          const reordered = currentModules.map((m, idx) => ({ ...m, order: idx + 1 }))

          setModules(reordered)
          setHasUnsavedChanges(true)
          toast.success(`Đã đổi vị trí "${moved.title}"`)
        },
      })
    }

    // 2. Setup Sortable for Lessons within and across Modules
    const lessonAreas = document.querySelectorAll<HTMLElement>('.lesson-drop-area')
    lessonAreas.forEach((el) => {
      const sortable = new Sortable(el, {
        group: 'shared-course-lessons',
        animation: 220,
        handle: '.lesson-drag-handle',
        draggable: '.lesson-item',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fallbackOnBody: true,
        swapThreshold: 0.65,
        onEnd: (evt) => {
          const { oldIndex, newIndex, from, to } = evt
          if (oldIndex == null || newIndex == null) return

          const fromModId = from.getAttribute('data-module-id')
          const toModId = to.getAttribute('data-module-id')
          if (!fromModId || !toModId) return

          if (fromModId === toModId && oldIndex === newIndex) return

          // Restore DOM node before React virtual DOM reconciles
          if (from && evt.item) {
            if (from !== to) {
              to.removeChild(evt.item)
            } else {
              from.removeChild(evt.item)
            }
            const refNode = from.children[oldIndex] || null
            from.insertBefore(evt.item, refNode)
          }

          const currentModules = modulesRef.current.map((m) => ({
            ...m,
            lessons: [...m.lessons],
          }))
          const sourceMod = currentModules.find((m) => m.id === fromModId)
          const targetMod = currentModules.find((m) => m.id === toModId)

          if (!sourceMod || !targetMod) return

          const [movedLesson] = sourceMod.lessons.splice(oldIndex, 1)
          if (!movedLesson) return

          targetMod.lessons.splice(newIndex, 0, movedLesson)

          setModules(currentModules)
          setHasUnsavedChanges(true)

          if (fromModId === toModId) {
            toast.success('Đã sắp xếp lại thứ tự bài học')
          } else {
            toast.success(`Đã chuyển "${movedLesson.title}" sang "${targetMod.title}"`)
          }
        },
      })
      lessonSortablesRef.current.push(sortable)
    })

    return () => {
      lessonSortablesRef.current.forEach((inst) => inst.destroy())
      lessonSortablesRef.current = []
      if (sectionSortableRef.current) {
        sectionSortableRef.current.destroy()
        sectionSortableRef.current = null
      }
    }
  }, [modules.length, modules.map((m) => `${m.id}-${m.lessons.length}`).join(',')])
}
