import { z } from 'zod'

export const updateQuizConfigSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề bài kiểm tra là bắt buộc').optional(),
    description: z.string().nullable().optional(),
    passScore: z.number().min(1).max(100).optional(),
    maxAttempts: z.number().min(0).optional(), // 0 = không giới hạn
    timeLimitMinutes: z.number().min(1).nullable().optional(),
    shuffleQuestions: z.boolean().optional(),
    showAnswerFeedback: z.boolean().optional(),
  }),
})

export const questionOptionSchema = z.object({
  id: z.string().optional(),
  optionText: z.string().min(1, 'Nội dung đáp án không được rỗng'),
  isCorrect: z.boolean().default(false),
  sortOrder: z.number().optional(),
})

export const createQuestionSchema = z.object({
  body: z.object({
    questionText: z.string().min(1, 'Nội dung câu hỏi là bắt buộc'),
    questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']).default('SINGLE_CHOICE'),
    points: z.number().min(0.1).optional().default(1.0),
    explanation: z.string().nullable().optional(),
    sortOrder: z.number().optional(),
    options: z.array(questionOptionSchema).min(2, 'Câu hỏi trắc nghiệm bắt buộc có tối thiểu 2 lựa chọn đáp án'),
  }),
})

export const updateQuestionSchema = z.object({
  body: z.object({
    questionText: z.string().min(1, 'Nội dung câu hỏi là bắt buộc').optional(),
    questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']).optional(),
    points: z.number().min(0.1).optional(),
    explanation: z.string().nullable().optional(),
    sortOrder: z.number().optional(),
    options: z.array(questionOptionSchema).min(2, 'Câu hỏi trắc nghiệm bắt buộc có tối thiểu 2 lựa chọn đáp án').optional(),
  }),
})

export const reorderQuestionsSchema = z.object({
  body: z.object({
    questionOrders: z.array(
      z.object({
        id: z.string().min(1, 'id câu hỏi là bắt buộc'),
        sortOrder: z.number(),
      })
    ).min(1, 'Danh sách sắp xếp không được rỗng'),
  }),
})

export const submitQuizAnswerItemSchema = z.object({
  questionId: z.string().min(1, 'ID câu hỏi là bắt buộc'),
  selectedOptionId: z.string().nullable().optional(),
  selectedOptionIds: z.array(z.string()).optional(),
  textAnswer: z.string().nullable().optional(),
})

export const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(submitQuizAnswerItemSchema).default([]),
    timeSpentSeconds: z.number().min(0).optional().default(0),
  }),
})

export type UpdateQuizConfigDto = z.infer<typeof updateQuizConfigSchema>['body']
export type CreateQuestionDto = z.infer<typeof createQuestionSchema>['body']
export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>['body']
export type ReorderQuestionsDto = z.infer<typeof reorderQuestionsSchema>['body']
export type SubmitQuizAnswerItemDto = z.infer<typeof submitQuizAnswerItemSchema>
export type SubmitQuizDto = z.infer<typeof submitQuizSchema>['body']
