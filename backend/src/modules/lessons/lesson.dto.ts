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

export const createLessonResourceSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề tài nguyên là bắt buộc'),
    description: z.string().optional(),
    resourceType: z.enum(['EXTERNAL_LINK', 'DOCUMENT_FILE']).optional().default('DOCUMENT_FILE'),
    url: z.string().min(1, 'Đường dẫn tài nguyên là bắt buộc'),
    storagePath: z.string().optional(),
    fileSizeBytes: z.number().optional(),
    fileExtension: z.string().optional(),
    sortOrder: z.number().optional().default(1),
    isDownloadable: z.boolean().optional().default(true),
  }),
})

export const updateLessonResourceSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề tài nguyên là bắt buộc').optional(),
    description: z.string().nullable().optional(),
    resourceType: z.enum(['EXTERNAL_LINK', 'DOCUMENT_FILE']).optional(),
    url: z.string().min(1, 'Đường dẫn tài nguyên là bắt buộc').optional(),
    storagePath: z.string().nullable().optional(),
    fileSizeBytes: z.number().nullable().optional(),
    fileExtension: z.string().nullable().optional(),
    sortOrder: z.number().optional(),
    isDownloadable: z.boolean().optional(),
  }),
})

export type CreateLessonDto = z.infer<typeof createLessonSchema>['body']
export type UpdateLessonDto = z.infer<typeof updateLessonSchema>['body']
export type ReorderLessonsDto = z.infer<typeof reorderLessonsSchema>['body']
export type ParseYoutubeDto = z.infer<typeof parseYoutubeSchema>['body']
export type CreateLessonResourceDto = z.infer<typeof createLessonResourceSchema>['body']
export type UpdateLessonResourceDto = z.infer<typeof updateLessonResourceSchema>['body']
