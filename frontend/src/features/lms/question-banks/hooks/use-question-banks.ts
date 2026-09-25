import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { questionBanksService } from '../services/question-banks.service'
import type {
  CreateQuestionBankPayload,
  UpdateQuestionBankPayload,
  CreateBankQuestionPayload,
  UpdateBankQuestionPayload,
  SyncSourceType,
} from '../types/question-banks.types'
import { toast } from 'sonner'

export const questionBankKeys = {
  all: ['question-banks'] as const,
  lists: () => [...questionBankKeys.all, 'list'] as const,
  list: (params?: any) => [...questionBankKeys.lists(), params] as const,
  details: () => [...questionBankKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionBankKeys.details(), id] as const,
  questions: (bankId: string, params?: any) => [...questionBankKeys.detail(bankId), 'questions', params] as const,
}

export function useQuestionBanks(params?: {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: string
  syncSource?: SyncSourceType | 'ALL'
}) {
  return useQuery({
    queryKey: questionBankKeys.list(params),
    queryFn: () => questionBanksService.getQuestionBanks(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  })
}

export function useQuestionBank(id: string) {
  return useQuery({
    queryKey: questionBankKeys.detail(id),
    queryFn: () => questionBanksService.getQuestionBankById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  })
}

export const useQuestionBankDetail = useQuestionBank

export function useBankQuestions(
  bankId: string,
  params?: {
    page?: number
    pageSize?: number
    search?: string
    difficulty?: string
    tag?: string
    isActive?: boolean
  }
) {
  return useQuery({
    queryKey: questionBankKeys.questions(bankId, params),
    queryFn: () => questionBanksService.getBankQuestions(bankId, params),
    enabled: Boolean(bankId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  })
}

export function useCreateQuestionBank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateQuestionBankPayload) => questionBanksService.createQuestionBank(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() })
      toast.success(`Đã tạo ngân hàng câu hỏi "${data.name}" thành công!`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể tạo ngân hàng câu hỏi')
    },
  })
}

export function useUpdateQuestionBank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateQuestionBankPayload }) =>
      questionBanksService.updateQuestionBank(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() })
      queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(variables.id) })
      toast.success(`Đã cập nhật thông tin ngân hàng "${data.name}"!`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể cập nhật ngân hàng câu hỏi')
    },
  })
}

export function useDeleteQuestionBank() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => questionBanksService.deleteQuestionBank(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() })
      toast.success('Đã vô hiệu hóa ngân hàng câu hỏi thành công!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể xóa ngân hàng câu hỏi')
    },
  })
}

export function useSyncGoogleSheet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      bankId,
      googleSheetUrl,
    }: {
      bankId: string
      googleSheetUrl?: string
      overrideExisting?: boolean
    }) => questionBanksService.syncFromGoogleSheet(bankId, googleSheetUrl),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(variables.bankId) })
      queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lỗi khi đồng bộ từ Google Sheet')
    },
  })
}

export function useImportCsv() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      bankId,
      file,
      csvContent,
    }: {
      bankId: string
      file?: File
      csvContent?: string
      overrideExisting?: boolean
    }) => {
      const content = csvContent || (file ? await file.text() : '')
      return questionBanksService.importFromCsv(bankId, content)
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(variables.bankId) })
      queryClient.invalidateQueries({ queryKey: questionBankKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lỗi khi nhập câu hỏi từ file')
    },
  })
}

export const useImportCsvQuestions = useImportCsv

export function useCreateManualQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      bankId,
      payload,
    }: {
      bankId: string
      payload: CreateBankQuestionPayload
    }) => questionBanksService.createManualQuestion(bankId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(variables.bankId) })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể tạo câu hỏi')
    },
  })
}

export const useCreateBankQuestion = useCreateManualQuestion

export function useUpdateManualQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      bankId,
      questionId,
      payload,
    }: {
      bankId: string
      questionId: string
      payload: UpdateBankQuestionPayload
    }) => questionBanksService.updateManualQuestion(bankId, questionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(variables.bankId) })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể cập nhật câu hỏi')
    },
  })
}

export const useUpdateBankQuestion = useUpdateManualQuestion

export function useDeleteManualQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bankId, questionId }: { bankId: string; questionId: string }) =>
      questionBanksService.deleteManualQuestion(bankId, questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: questionBankKeys.detail(variables.bankId) })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể xóa câu hỏi')
    },
  })
}

export const useDeleteBankQuestion = useDeleteManualQuestion
