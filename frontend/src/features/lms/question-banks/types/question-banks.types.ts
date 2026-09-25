export type SyncSourceType = 'MANUAL' | 'GOOGLE_SHEETS' | 'EXCEL'
export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SINGLE' | 'MULTIPLE'
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface BankQuestionOptionItem {
  id?: string
  optionText: string
  text?: string
  isCorrect: boolean
  sortOrder?: number
  orderIndex?: number
}

export interface BankQuestionItem {
  id: string
  questionBankId: string
  externalCode: string | null
  code?: string
  questionText: string
  question?: string
  questionType: QuestionType
  type?: QuestionType
  difficulty: QuestionDifficulty
  points: number
  explanation: string | null
  tags: string[] | string | null
  isActive: boolean
  version: number
  options: BankQuestionOptionItem[]
  createdAt: string
  updatedAt: string
}

export interface QuestionBankItem {
  id: string
  code: string
  name: string
  description: string | null
  categoryId: string | null
  category: {
    id: string
    name: string
    code: string
  } | null
  syncSource: SyncSourceType
  googleSheetUrl: string | null
  lastSyncedAt: string | null
  totalQuestions: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdByUser?: {
    id: string
    fullName: string
    email: string | null
  } | null
}

export interface QuestionBankDetailItem extends QuestionBankItem {
  questions: BankQuestionItem[]
  poolRules: any[]
}

export interface QuestionBanksStats {
  totalBanks: number
  totalQuestions: number
  googleSheetBanks: number
}

export interface QuestionBanksApiResponse {
  items: QuestionBankItem[]
  stats: QuestionBanksStats
  categories: Array<{ id: string; name: string; code: string }>
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface BankQuestionsApiResponse {
  items: BankQuestionItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface SyncResult {
  message: string
  stats: {
    totalIncoming: number
    added: number
    updated: number
    deactivated: number
  }
  totalInSource?: number
  added?: number
  updated?: number
  deactivated?: number
  addedQuestions: string[]
  updatedQuestions: Array<{ code: string; title: string; changes: string }>
  deactivatedQuestions: string[]
  syncErrors: Array<{ row: number; code?: string; error?: string; message?: string }>
  errors?: Array<{ row: number; code?: string; message: string }>
}

export type SyncResultDto = SyncResult

export interface CreateQuestionBankPayload {
  code: string
  name: string
  description?: string
  categoryId?: string | null
  googleSheetUrl?: string | null
  isActive?: boolean
}

export type CreateQuestionBankInput = CreateQuestionBankPayload

export interface UpdateQuestionBankPayload {
  code?: string
  name?: string
  description?: string | null
  categoryId?: string | null
  googleSheetUrl?: string | null
  isActive?: boolean
}

export interface CreateBankQuestionPayload {
  externalCode?: string | null
  code?: string
  questionText: string
  question?: string
  questionType?: QuestionType
  type?: QuestionType
  difficulty: QuestionDifficulty
  points: number
  explanation?: string | null
  tags?: string[] | string | null
  options: Array<{
    optionText?: string
    text?: string
    isCorrect: boolean
    sortOrder?: number
    orderIndex?: number
  }>
}

export type CreateBankQuestionInput = CreateBankQuestionPayload

export interface UpdateBankQuestionPayload extends Partial<CreateBankQuestionPayload> {
  isActive?: boolean
}
