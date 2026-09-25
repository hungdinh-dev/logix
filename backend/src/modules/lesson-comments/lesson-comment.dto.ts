import { z } from 'zod'

export const createLessonCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, 'Nội dung bình luận không được để trống').max(2000, 'Nội dung tối đa 2000 ký tự'),
    parentId: z.string().uuid('Parent ID không hợp lệ').nullable().optional(),
    replyToUserId: z.string().uuid('User ID người nhận không hợp lệ').nullable().optional(),
  }),
})

export const updateLessonCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, 'Nội dung bình luận không được để trống').max(2000, 'Nội dung tối đa 2000 ký tự'),
  }),
})

export const togglePinCommentSchema = z.object({
  body: z.object({
    isPinned: z.boolean().optional(),
  }),
})

export type CreateLessonCommentInput = z.infer<typeof createLessonCommentSchema>['body']
export type UpdateLessonCommentInput = z.infer<typeof updateLessonCommentSchema>['body']
