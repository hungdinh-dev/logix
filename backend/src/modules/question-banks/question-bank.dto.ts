import { z } from 'zod'

export const createQuestionBankSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Mã ngân hàng phải từ 2 ký tự trở lên'),
    name: z.string().min(2, 'Tên ngân hàng phải từ 2 ký tự trở lên'),
    description: z.string().optional(),
    categoryId: z.string().uuid('ID danh mục không hợp lệ').optional().nullable(),
    googleSheetUrl: z.string().url('URL Google Sheet không hợp lệ').optional().nullable(),
  }),
})

export type CreateQuestionBankDto = z.infer<typeof createQuestionBankSchema>['body']

export const updateQuestionBankSchema = z.object({
  body: z.object({
    code: z.string().min(2).optional(),
    name: z.string().min(2).optional(),
    description: z.string().optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    googleSheetUrl: z.string().url().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
})

export type UpdateQuestionBankDto = z.infer<typeof updateQuestionBankSchema>['body']

export const syncGoogleSheetSchema = z.object({
  body: z.object({
    sheetUrl: z.string().url('URL Google Sheet không hợp lệ').optional(),
  }).optional(),
})

export type SyncGoogleSheetDto = z.infer<typeof syncGoogleSheetSchema>['body']

export const bankQuestionOptionSchema = z.object({
  id: z.string().optional(),
  optionText: z.string().min(1, 'Nội dung đáp án không được để trống'),
  isCorrect: z.boolean().default(false),
  sortOrder: z.number().int().default(1),
})

export const createBankQuestionSchema = z.object({
  body: z.object({
    externalCode: z.string().optional().nullable(),
    questionText: z.string().min(3, 'Nội dung câu hỏi phải từ 3 ký tự'),
    questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE']).default('SINGLE_CHOICE'),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
    points: z.number().min(0.5).default(1.0),
    explanation: z.string().optional().nullable(),
    tags: z.string().optional().nullable(),
    options: z.array(bankQuestionOptionSchema).min(2, 'Câu hỏi phải có ít nhất 2 phương án lựa chọn'),
  }),
})

export type CreateBankQuestionDto = z.infer<typeof createBankQuestionSchema>['body']

export const updateBankQuestionSchema = z.object({
  body: z.object({
    externalCode: z.string().optional().nullable(),
    questionText: z.string().min(3).optional(),
    questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE']).optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    points: z.number().min(0.5).optional(),
    explanation: z.string().optional().nullable(),
    tags: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    options: z.array(bankQuestionOptionSchema).min(2).optional(),
  }),
})

export type UpdateBankQuestionDto = z.infer<typeof updateBankQuestionSchema>['body']

export const getQuestionBanksQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    syncSource: z.enum(['ALL', 'MANUAL', 'GOOGLE_SHEETS', 'EXCEL']).optional(),
  }).optional(),
})

export type GetQuestionBanksQueryDto = z.infer<typeof getQuestionBanksQuerySchema>['query']

export const getBankQuestionsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(20),
    search: z.string().optional(),
    difficulty: z.enum(['ALL', 'EASY', 'MEDIUM', 'HARD']).optional(),
    tag: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
  }).optional(),
})

export type GetBankQuestionsQueryDto = z.infer<typeof getBankQuestionsQuerySchema>['query']
