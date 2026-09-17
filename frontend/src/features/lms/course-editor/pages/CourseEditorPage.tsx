'use client'

import React, { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useCurriculumState } from '../hooks/use-curriculum-state'
import { useCurriculumDnd } from '../hooks/use-curriculum-dnd'
import {
  CourseEditorHeader,
  CourseEditorSkeleton,
  CurriculumSidebar,
  LessonEditorPanel,
  BulkTranscriptModal,
} from '../components'
import { EntityAuditSidePeek } from '@/components/shared/EntityAuditSidePeek'
import type { TranscriptEntry } from '../types/course-editor.types'

export default function CourseEditorPage() {
  const params = useParams()
  const courseId = params?.id as string

  const [isBulkTranscriptOpen, setIsBulkTranscriptOpen] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const sectionsContainerRef = useRef<HTMLDivElement>(null)

  const {
    backendCourse,
    isQueryLoading,
    isSaving,
    saveSuccess,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    courseTitle,
    isPublished,
    modules,
    setModules,
    selectedLesson,
    setSelectedLesson,
    setActiveModuleId,
    updateLessonInModules,
    handleAddLessonDirect,
    handleAddModuleDirect,
    handleDeleteModule,
    handleUpdateModuleTitle,
    handleDeleteLesson,
    handleAddQuizQuestion,
    handleSaveCourseAll,
  } = useCurriculumState(courseId)

  // Initialize SortableJS drag-and-drop
  useCurriculumDnd({
    modules,
    setModules,
    setHasUnsavedChanges,
    sectionsContainerRef,
  })

  // Bulk Import Handler
  const handleBulkImport = (entries: TranscriptEntry[]) => {
    if (!selectedLesson) return
    const updated = {
      ...selectedLesson,
      transcripts: entries,
    }
    setSelectedLesson(updated)
    updateLessonInModules(updated)
  }

  if (isQueryLoading && !backendCourse) {
    return <CourseEditorSkeleton />
  }

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-background">
      {/* Top Bar Header */}
      <CourseEditorHeader
        courseId={courseId}
        courseTitle={courseTitle}
        isPublished={isPublished}
        hasUnsavedChanges={hasUnsavedChanges}
        saveSuccess={saveSuccess}
        isSaving={isSaving}
        onSave={handleSaveCourseAll}
        onOpenAuditHistory={() => setIsAuditOpen(true)}
      />

      {/* Main Workspace Split Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <CurriculumSidebar
          modules={modules}
          selectedLessonId={selectedLesson?.id}
          sectionsContainerRef={sectionsContainerRef}
          onAddModule={handleAddModuleDirect}
          onUpdateModuleTitle={handleUpdateModuleTitle}
          onDeleteModule={handleDeleteModule}
          onSelectLesson={(lesson, modId) => {
            setSelectedLesson(lesson)
            setActiveModuleId(modId)
          }}
          onDeleteLesson={handleDeleteLesson}
          onAddLesson={handleAddLessonDirect}
        />

        {/* Right Content Editor Panel */}
        <LessonEditorPanel
          selectedLesson={selectedLesson}
          onChange={updateLessonInModules}
          onAddQuizQuestion={handleAddQuizQuestion}
          onOpenBulkModal={() => setIsBulkTranscriptOpen(true)}
        />
      </div>

      {/* Bulk YouTube Timestamps Modal */}
      <BulkTranscriptModal
        isOpen={isBulkTranscriptOpen}
        onOpenChange={setIsBulkTranscriptOpen}
        onImport={handleBulkImport}
      />

      {/* Course & Curriculum Audit Trail Side Peek */}
      <EntityAuditSidePeek
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        tableName="crs_courses"
        entityId={courseId}
        entityTitle={courseTitle}
        entitySubtitle={`Mã khóa học: ${backendCourse?.code || ''}`}
      />
    </div>
  )
}
