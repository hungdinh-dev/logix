import { z } from 'zod'

export const updateLessonProgressSchema = z.object({
  body: z.object({
    lessonId: z.string().min(1, 'lessonId là bắt buộc'),
    isCompleted: z.boolean().optional(),
    lastPositionSeconds: z.number().optional(),
  }),
})

export type UpdateLessonProgressDto = z.infer<typeof updateLessonProgressSchema>['body']
