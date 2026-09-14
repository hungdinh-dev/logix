import { z } from 'zod'
import { LessonType } from '../enums'

export const createLessonSchema = z.object({
  moduleId: z.string().uuid('Module ID không hợp lệ'),
  title: z.string().min(2, 'Tiêu đề bài học là bắt buộc'),
  slug: z.string().min(2, 'Slug bài học là bắt buộc'),
  type: z.nativeEnum(LessonType).default(LessonType.ARTICLE),
  durationMinutes: z.number().int().min(1).default(10),
  orderIndex: z.number().int().min(0).default(0),
  contentUrl: z.string().optional().nullable(),
  contentText: z.string().optional().nullable(),
  isPreview: z.boolean().default(false),
  isMandatory: z.boolean().default(true),
})

export type CreateLessonInput = z.infer<typeof createLessonSchema>

export const updateLessonSchema = createLessonSchema.partial()
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>
