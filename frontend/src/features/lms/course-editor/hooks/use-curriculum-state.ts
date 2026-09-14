'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useCourseDetail } from '@/features/lms/hooks/use-course-detail'
import { courseEditorService } from '../services/course-editor.service'
import type { LessonItem, ModuleItem, LessonType, QuizQuestionItem } from '../types/course-editor.types'

export function useCurriculumState(courseId: string) {
  const { course: backendCourse, isLoading: isQueryLoading, syncCurriculum } = useCourseDetail(courseId)

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [courseTitle, setCourseTitle] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const [modules, setModules] = useState<ModuleItem[]>([])
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null)
  const [activeModuleId, setActiveModuleId] = useState<string>('')

  // Sync state when backend course data is loaded/cached
  useEffect(() => {
    if (backendCourse) {
      setCourseTitle(backendCourse.title)
      setCourseCode(backendCourse.code)
      setIsPublished(backendCourse.status === 'PUBLISHED')

      if (backendCourse.modules && backendCourse.modules.length > 0) {
        const mappedModules: ModuleItem[] = backendCourse.modules.map((m: any, mIdx: number) => ({
          id: m.id || `mod-${mIdx}`,
          title: m.title,
          order: m.sortOrder || mIdx + 1,
          lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
            id: l.id || `les-${mIdx}-${lIdx}`,
            title: l.title,
            type: l.lessonType || 'VIDEO',
            durationMinutes: Math.round(
              (l.videoDuration || (l.estimatedReadTime ? l.estimatedReadTime * 60 : 600)) / 60
            ),
            videoUrl: l.videoUrl,
            content: l.description || l.bodyHtml || '',
            sopCode: l.sopCode,
            allowSeeking: l.allowSeeking !== false,
            transcripts: l.checklistItems
              ? (() => {
                  try {
                    const p = JSON.parse(l.checklistItems)
                    return Array.isArray(p) ? p : []
                  } catch {
                    return []
                  }
                })()
              : [],
            quizPassScore: l.quiz?.passScore || 80,
            quizTimeLimit: l.quiz?.timeLimitMinutes || 15,
            quizQuestions: l.quiz?.questions?.map((q: any) => ({
              id: q.id,
              questionText: q.questionText,
              options: (q.options || []).map((o: any) => ({
                id: o.id,
                text: o.optionText,
                isCorrect: o.isCorrect,
              })),
            })),
          })),
        }))
        setModules(mappedModules)
        if (!selectedLesson && mappedModules[0]?.lessons[0]) {
          setSelectedLesson(mappedModules[0].lessons[0])
          setActiveModuleId(mappedModules[0].id)
        }
      }
    }
  }, [backendCourse])

  // Helper to sync updated lesson into modules array
  const updateLessonInModules = (updatedLesson: LessonItem) => {
    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((les) => (les.id === updatedLesson.id ? updatedLesson : les)),
      }))
    )
    setHasUnsavedChanges(true)
  }

  // 1-Click Action: Add Lesson Direct
  const handleAddLessonDirect = (moduleId: string, type: LessonType) => {
    const targetModule = modules.find((m) => m.id === moduleId)
    const count = (targetModule?.lessons.length || 0) + 1
    const newLessonId = `les-${Date.now()}`

    let newLesson: LessonItem
    if (type === 'VIDEO') {
      newLesson = {
        id: newLessonId,
        title: `${count}. Bài video mới #`,
        type: 'VIDEO',
        durationMinutes: 10,
        videoUrl: '',
        content: '',
        allowSeeking: true,
      }
    } else if (type === 'ARTICLE') {
      newLesson = {
        id: newLessonId,
        title: `${count}. Tài liệu SOP mới #`,
        type: 'ARTICLE',
        durationMinutes: 8,
        sopCode: '',
        content: '<h2>Nội dung quy trình hướng dẫn chuẩn</h2><p>Nhập mô tả chi tiết tại đây...</p>',
      }
    } else {
      newLesson = {
        id: newLessonId,
        title: `${count}. Bài kiểm tra trắc nghiệm`,
        type: 'QUIZ',
        durationMinutes: 15,
        quizPassScore: 80,
        quizTimeLimit: 15,
        content: 'Bài kiểm tra trắc nghiệm đánh giá kiến thức bài học.',
        quizQuestions: [
          {
            id: `q-${Date.now()}-1`,
            questionText: 'Câu hỏi số 1: Điền nội dung câu hỏi tại đây?',
            options: [
              { id: `opt-1`, text: 'Đáp án A (Đúng)', isCorrect: true },
              { id: `opt-2`, text: 'Đáp án B', isCorrect: false },
              { id: `opt-3`, text: 'Đáp án C', isCorrect: false },
            ],
          },
        ],
      }
    }

    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              lessons: [...mod.lessons, newLesson],
            }
          : mod
      )
    )

    setSelectedLesson(newLesson)
    setActiveModuleId(moduleId)
    setHasUnsavedChanges(true)
  }

  // Add Module Direct
  const handleAddModuleDirect = () => {
    const newModId = `mod-${Date.now()}`
    const newModule: ModuleItem = {
      id: newModId,
      title: `Phần ${modules.length + 1}: Chương học mới`,
      order: modules.length + 1,
      lessons: [],
    }
    setModules((prev) => [...prev, newModule])
    setActiveModuleId(newModId)
    setHasUnsavedChanges(true)
  }

  // Delete Module
  const handleDeleteModule = (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId)
    if (!confirm(`Bạn có chắc muốn xóa phần "${mod?.title || ''}" cùng tất cả các bài học bên trong?`)) {
      return
    }

    const nextModules = modules.filter((m) => m.id !== moduleId)
    setModules(nextModules)

    if (activeModuleId === moduleId || selectedLesson) {
      if (nextModules[0]?.lessons[0]) {
        setSelectedLesson(nextModules[0].lessons[0])
        setActiveModuleId(nextModules[0].id)
      } else {
        setSelectedLesson(null)
      }
    }
    setHasUnsavedChanges(true)
  }

  // Update Module Title
  const handleUpdateModuleTitle = (moduleId: string, newTitle: string) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, title: newTitle } : m)))
    setHasUnsavedChanges(true)
  }

  // Delete Lesson
  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    const targetMod = modules.find((m) => m.id === moduleId)
    const targetLesson = targetMod?.lessons.find((l) => l.id === lessonId)
    if (!confirm(`Bạn có chắc muốn xóa bài học "${targetLesson?.title || ''}"?`)) {
      return
    }

    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              lessons: mod.lessons.filter((l) => l.id !== lessonId),
            }
          : mod
      )
    )

    if (selectedLesson?.id === lessonId) {
      const remainingLessons = targetMod?.lessons.filter((l) => l.id !== lessonId) || []
      if (remainingLessons.length > 0) {
        setSelectedLesson(remainingLessons[0])
      } else {
        setSelectedLesson(null)
      }
    }
    setHasUnsavedChanges(true)
  }

  // Add Quiz Question
  const handleAddQuizQuestion = () => {
    if (!selectedLesson || selectedLesson.type !== 'QUIZ') return
    const currentQuestions = selectedLesson.quizQuestions || []
    const newQ: QuizQuestionItem = {
      id: `q-${Date.now()}`,
      questionText: `Câu hỏi số ${currentQuestions.length + 1}: Nhập nội dung câu hỏi tại đây...`,
      options: [
        { id: `opt-${Date.now()}-1`, text: 'Lựa chọn A (Đúng)', isCorrect: true },
        { id: `opt-${Date.now()}-2`, text: 'Lựa chọn B', isCorrect: false },
      ],
    }
    const updated = {
      ...selectedLesson,
      quizQuestions: [...currentQuestions, newQ],
    }
    setSelectedLesson(updated)
    updateLessonInModules(updated)
  }

  // Save All Course Curriculum
  const handleSaveCourseAll = async () => {
    setIsSaving(true)
    try {
      if (courseId) {
        const payload = courseEditorService.transformModulesToPayload(courseTitle, modules)
        const updatedCourse = await syncCurriculum(payload)

        if (updatedCourse?.modules && updatedCourse.modules.length > 0) {
          const freshModules: ModuleItem[] = updatedCourse.modules.map((m: any, mIdx: number) => ({
            id: m.id,
            title: m.title,
            order: m.sortOrder || mIdx + 1,
            lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
              id: l.id,
              title: l.title,
              type: l.lessonType || 'VIDEO',
              durationMinutes: Math.round(
                (l.videoDuration || (l.estimatedReadTime ? l.estimatedReadTime * 60 : 600)) / 60
              ),
              videoUrl: l.videoUrl,
              content: l.description || l.bodyHtml || '',
              sopCode: l.sopCode,
              allowSeeking: l.allowSeeking !== false,
              transcripts: l.checklistItems
                ? (() => {
                    try {
                      const p = JSON.parse(l.checklistItems)
                      return Array.isArray(p) ? p : []
                    } catch {
                      return []
                    }
                  })()
                : [],
              quizPassScore: l.quiz?.passScore || 80,
              quizTimeLimit: l.quiz?.timeLimitMinutes || 15,
              quizQuestions: l.quiz?.questions?.map((q: any) => ({
                id: q.id,
                questionText: q.questionText,
                options: (q.options || []).map((o: any) => ({
                  id: o.id,
                  text: o.optionText,
                  isCorrect: o.isCorrect,
                })),
              })) || [],
            })),
          }))
          setModules(freshModules)
          if (selectedLesson) {
            const matching = freshModules
              .flatMap((m) => m.lessons)
              .find((l) => l.id === selectedLesson.id || l.title === selectedLesson.title)
            if (matching) setSelectedLesson(matching)
          }
        }
      }
      setHasUnsavedChanges(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Save failed:', err)
      toast.error('Lưu giáo trình thất bại: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'))
    } finally {
      setIsSaving(false)
    }
  }

  return {
    backendCourse,
    isQueryLoading,
    isSaving,
    saveSuccess,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    courseTitle,
    setCourseTitle,
    courseCode,
    isPublished,
    setIsPublished,
    modules,
    setModules,
    selectedLesson,
    setSelectedLesson,
    activeModuleId,
    setActiveModuleId,
    updateLessonInModules,
    handleAddLessonDirect,
    handleAddModuleDirect,
    handleDeleteModule,
    handleUpdateModuleTitle,
    handleDeleteLesson,
    handleAddQuizQuestion,
    handleSaveCourseAll,
  }
}
