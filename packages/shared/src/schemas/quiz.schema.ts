import { z } from 'zod'
import { QuizType, QuestionType } from '../enums'

export const createQuizOptionSchema = z.object({
  content: z.string().min(1, 'Nội dung đáp án là bắt buộc'),
  isCorrect: z.boolean().default(false),
  orderIndex: z.number().int().min(0).default(0),
})
export type CreateQuizOptionInput = z.infer<typeof createQuizOptionSchema>

export const createQuizQuestionSchema = z.object({
  questionText: z.string().min(3, 'Nội dung câu hỏi là bắt buộc'),
  type: z.nativeEnum(QuestionType).default(QuestionType.SINGLE_CHOICE),
  points: z.number().min(1).default(10),
  orderIndex: z.number().int().min(0).default(0),
  options: z.array(createQuizOptionSchema).min(2, 'Câu hỏi cần ít nhất 2 đáp án lựa chọn'),
})
export type CreateQuizQuestionInput = z.infer<typeof createQuizQuestionSchema>

export const createQuizSchema = z.object({
  lessonId: z.string().uuid().optional().nullable(),
  courseId: z.string().uuid().optional().nullable(),
  title: z.string().min(3, 'Tiêu đề Quiz là bắt buộc'),
  type: z.nativeEnum(QuizType).default(QuizType.PRACTICE),
  passingScore: z.number().min(0).max(100).default(80),
  timeLimitMinutes: z.number().int().min(1).optional().nullable(),
  maxAttempts: z.number().int().min(1).optional().nullable(),
  questions: z.array(createQuizQuestionSchema).optional().default([]),
})
export type CreateQuizInput = z.infer<typeof createQuizSchema>
