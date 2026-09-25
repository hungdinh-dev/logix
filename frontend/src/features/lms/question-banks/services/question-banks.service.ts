import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type {
  QuestionBanksApiResponse,
  QuestionBankItem,
  QuestionBankDetailItem,
  BankQuestionsApiResponse,
  BankQuestionItem,
  SyncResult,
  CreateQuestionBankPayload,
  UpdateQuestionBankPayload,
  CreateBankQuestionPayload,
  UpdateBankQuestionPayload,
  SyncSourceType,
} from '../types/question-banks.types'

export const questionBanksService = {
  async getQuestionBanks(params?: {
    page?: number
    pageSize?: number
    search?: string
    categoryId?: string
    syncSource?: SyncSourceType | 'ALL'
  }): Promise<QuestionBanksApiResponse> {
    const res = await api.get(apiRoutes.questionBanks.base, { params })
    return res.data?.data
  },

  async getQuestionBankById(id: string): Promise<QuestionBankDetailItem> {
    const res = await api.get(apiRoutes.questionBanks.byId(id))
    return res.data?.data
  },

  async createQuestionBank(payload: CreateQuestionBankPayload): Promise<QuestionBankItem> {
    const res = await api.post(apiRoutes.questionBanks.base, payload)
    return res.data?.data
  },

  async updateQuestionBank(id: string, payload: UpdateQuestionBankPayload): Promise<QuestionBankItem> {
    const res = await api.put(apiRoutes.questionBanks.byId(id), payload)
    return res.data?.data
  },

  async deleteQuestionBank(id: string): Promise<{ success: boolean }> {
    const res = await api.delete(apiRoutes.questionBanks.byId(id))
    return res.data?.data
  },

  async syncFromGoogleSheet(id: string, sheetUrl?: string): Promise<SyncResult> {
    const res = await api.post(apiRoutes.questionBanks.syncSheets(id), { sheetUrl })
    return res.data?.data
  },

  async importFromCsv(id: string, csvContent: string): Promise<SyncResult> {
    const res = await api.post(apiRoutes.questionBanks.importCsv(id), { csvContent })
    return res.data?.data
  },

  async getBankQuestions(
    bankId: string,
    params?: {
      page?: number
      pageSize?: number
      search?: string
      difficulty?: string
      tag?: string
      isActive?: boolean
    }
  ): Promise<BankQuestionsApiResponse> {
    const res = await api.get(apiRoutes.questionBanks.questions(bankId), { params })
    return res.data?.data
  },

  async createManualQuestion(
    bankId: string,
    payload: CreateBankQuestionPayload
  ): Promise<BankQuestionItem> {
    const res = await api.post(apiRoutes.questionBanks.questions(bankId), payload)
    return res.data?.data
  },

  async updateManualQuestion(
    bankId: string,
    questionId: string,
    payload: UpdateBankQuestionPayload
  ): Promise<BankQuestionItem> {
    const res = await api.put(apiRoutes.questionBanks.questionById(bankId, questionId), payload)
    return res.data?.data
  },

  async deleteManualQuestion(bankId: string, questionId: string): Promise<{ success: boolean }> {
    const res = await api.delete(apiRoutes.questionBanks.questionById(bankId, questionId))
    return res.data?.data
  },

  downloadTemplate() {
    window.open(apiRoutes.questionBanks.template, '_blank')
  },
}
