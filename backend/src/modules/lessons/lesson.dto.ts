import { z } from 'zod'

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề bài học là bắt buộc'),
    description: z.string().optional(),
    lessonType: z.enum(['VIDEO', 'ARTICLE', 'QUIZ', 'PDF', 'CHECKLIST']).optional().default('VIDEO'),
    
    // Video
    videoProvider: z.enum(['YOUTUBE', 'DIRECT_UPLOAD', 'EXTERNAL_URL']).optional().default('YOUTUBE'),
    videoUrl: z.string().optional(),
    videoStoragePath: z.string().optional(),
    videoDuration: z.number().min(0).optional().default(0),
    
    // Article & PDF
    bodyHtml: z.string().optional(),
    documentUrl: z.string().optional(),
    estimatedReadTime: z.number().min(1).optional().default(5),
    checklistItems: z.string().optional(),
    
    // SOP & Compliance
    sopCode: z.string().optional(),
    sopType: z.string().optional(),
    requiresSignature: z.boolean().optional().default(false),
    
    // Settings
    allowDownload: z.boolean().optional().default(false),
    allowSeeking: z.boolean().optional().default(true),
    isVisible: z.boolean().optional().default(true),
    sortOrder: z.number().optional(),
  }),
})

export const updateLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề bài học là bắt buộc').optional(),
    description: z.string().nullable().optional(),
    lessonType: z.enum(['VIDEO', 'ARTICLE', 'QUIZ', 'PDF', 'CHECKLIST']).optional(),
    
    videoProvider: z.enum(['YOUTUBE', 'DIRECT_UPLOAD', 'EXTERNAL_URL']).nullable().optional(),
    videoUrl: z.string().nullable().optional(),
    videoStoragePath: z.string().nullable().optional(),
    videoDuration: z.number().min(0).optional(),
    
    bodyHtml: z.string().nullable().optional(),
    documentUrl: z.string().nullable().optional(),
    estimatedReadTime: z.number().min(1).optional(),
    checklistItems: z.string().nullable().optional(),
    
    sopCode: z.string().nullable().optional(),
    sopType: z.string().nullable().optional(),
    requiresSignature: z.boolean().optional(),
    
    allowDownload: z.boolean().optional(),
    allowSeeking: z.boolean().optional(),
    isVisible: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
})

export const reorderLessonsSchema = z.object({
  body: z.object({
    lessonOrders: z.array(
      z.object({
        id: z.string().min(1, 'id bài học là bắt buộc'),
        sortOrder: z.number(),
      })
    ).min(1, 'Danh sách sắp xếp không được rỗng'),
  }),
})

export const parseYoutubeSchema = z.object({
  body: z.object({
    url: z.string().min(1, 'URL YouTube là bắt buộc'),
  }),
})

export type CreateLessonDto = z.infer<typeof createLessonSchema>['body']
export type UpdateLessonDto = z.infer<typeof updateLessonSchema>['body']
export type ReorderLessonsDto = z.infer<typeof reorderLessonsSchema>['body']
export type ParseYoutubeDto = z.infer<typeof parseYoutubeSchema>['body']
