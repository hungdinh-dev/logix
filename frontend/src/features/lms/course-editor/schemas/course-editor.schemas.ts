import { z } from 'zod'

export const quizQuestionOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Nội dung đáp án là bắt buộc'),
  isCorrect: z.boolean().default(false),
})

export const quizQuestionSchema = z.object({
  id: z.string().optional(),
  questionText: z.string().min(1, 'Nội dung câu hỏi là bắt buộc'),
  options: z.array(quizQuestionOptionSchema).min(2, 'Phải có ít nhất 2 đáp án lựa chọn'),
})

export const transcriptEntrySchema = z.object({
  id: z.string().optional(),
  timestamp: z.string().min(1, 'Mốc thời gian là bắt buộc'),
  timestampSeconds: z.number().min(0),
  text: z.string().min(1, 'Nội dung mô tả mốc thời gian là bắt buộc'),
})

export const lessonItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Tiêu đề bài học là bắt buộc'),
  type: z.enum(['VIDEO', 'ARTICLE', 'QUIZ']),
  durationMinutes: z.number().min(1, 'Thời lượng tối thiểu 1 phút').default(10),
  videoUrl: z.string().url('Đường dẫn video không hợp lệ').nullable().optional(),
  content: z.string().optional(),
  sopCode: z.string().nullable().optional(),
  allowSeeking: z.boolean().optional().default(true),
  quizPassScore: z.number().min(1).max(100).optional(),
  quizTimeLimit: z.number().min(1).optional(),
  quizQuestions: z.array(quizQuestionSchema).optional(),
  transcripts: z.array(transcriptEntrySchema).optional(),
})

export const moduleItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Tiêu đề chương là bắt buộc'),
  order: z.number(),
  lessons: z.array(lessonItemSchema),
})
