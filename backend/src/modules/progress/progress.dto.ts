import { z } from 'zod'

export const updateLessonProgressSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1, 'lessonId là bắt buộc'),
    isCompleted: z.boolean().optional(),
    lastPositionSeconds: z.number().optional(),
  }),
})

export type UpdateLessonProgressDto = z.infer<typeof updateLessonProgressSchema>['body']

export const getAdminProgressTrackingSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    courseId: z.string().optional(),
    departmentId: z.string().optional(),
    storeId: z.string().optional(),
    status: z.enum(['ALL', 'COMPLETED', 'IN_PROGRESS', 'ENROLLED', 'CANCELLED']).optional(),
    sortField: z.enum(['enrolledAt', 'completionPercentage', 'fullName', 'courseTitle', 'completedAt']).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
  }).optional(),
})

export type GetAdminProgressTrackingDto = z.infer<typeof getAdminProgressTrackingSchema>['query']

export const getAdminActivitiesSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(15),
    search: z.string().optional(),
    type: z.enum(['ALL', 'QUIZ', 'LESSON', 'COURSE']).optional(),
    status: z.enum(['ALL', 'SUCCESS', 'ACTIVE', 'FAILED']).optional(),
  }).optional(),
})

export type GetAdminActivitiesDto = z.infer<typeof getAdminActivitiesSchema>['query']
