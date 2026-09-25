import { courseApiService, type SyncCurriculumPayload } from '@/features/lms/services/course.service'
import type { ModuleItem } from '../types/course-editor.types'

export const courseEditorService = {
  getCourseDetail: courseApiService.getCourseById,

  saveCurriculumPayload: async (courseId: string, payload: SyncCurriculumPayload) => {
    return courseApiService.syncCourseCurriculum(courseId, payload)
  },

  transformModulesToPayload: (courseTitle: string, modules: ModuleItem[]) => {
    return {
      title: courseTitle,
      modules: modules.map((m, mIdx) => ({
        id: m.id.startsWith('mod-') ? undefined : m.id,
        title: m.title,
        sortOrder: mIdx + 1,
        lessons: m.lessons.map((l, lIdx) => ({
          id: l.id.startsWith('les-') ? undefined : l.id,
          title: l.title,
          lessonType: l.type,
          sortOrder: lIdx + 1,
          durationMinutes: l.durationMinutes || 10,
          videoUrl: l.videoUrl || null,
          bodyHtml: l.type === 'ARTICLE' ? (l.content || '') : null,
          sopCode: l.sopCode || null,
          allowSeeking: l.allowSeeking !== false,
          resources: (l.resources || []).map((r, rIdx) => ({
            id: r.id.startsWith('res-') ? undefined : r.id,
            title: r.name,
            url: r.url,
            resourceType: (r.type as any) || 'DOCUMENT_FILE',
            sortOrder: rIdx + 1,
            fileExtension: r.extension || null,
            fileSizeBytes: r.fileSizeBytes || null,
          })),
          checklistItems:
            l.transcripts && l.transcripts.length > 0
              ? JSON.stringify(l.transcripts)
              : (l.content && l.type !== 'ARTICLE' ? l.content : null),
          quizPassScore: l.quizPassScore || 80,
          quizTimeLimit: l.quizTimeLimit || 15,
          quizQuestions: (l.quizQuestions || []).map((q) => ({
            id: q.id.startsWith('q-') ? undefined : q.id,
            questionText: q.questionText,
            explanation: q.explanation || null,
            questionType: (q.questionType || 'SINGLE_CHOICE') as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE',
            options: (q.options || []).map((o) => ({
              id: o.id.startsWith('opt-') ? undefined : o.id,
              text: o.text,
              isCorrect: o.isCorrect ?? false,
            })),
          })),
        })),
      })),
    }
  },
}
