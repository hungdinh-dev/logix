'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EntityAuditSidePeek } from '@/components/shared/EntityAuditSidePeek'
import {
  BankQuestionsTable,
  QuestionDetailModal,
  GoogleSheetSyncDialog,
  ExcelImportDialog,
} from '../components'
import {
  useQuestionBank,
  useBankQuestions,
  useCreateBankQuestion,
  useUpdateBankQuestion,
  useDeleteBankQuestion,
  useSyncGoogleSheet,
  useImportCsvQuestions,
} from '../hooks/use-question-banks'
import {
  ArrowLeft,
  RefreshCw,
  FileUp,
  History,
  FileSpreadsheet,
  ExternalLink,
  Plus,
  Clock,
} from 'lucide-react'
import type {
  BankQuestionItem,
  CreateBankQuestionInput,
  SyncResultDto,
} from '../types/question-banks.types'

interface QuestionBankDetailPageProps {
  bankId?: string
}

export function QuestionBankDetailPage({ bankId: propBankId }: QuestionBankDetailPageProps) {
  const router = useRouter()
  const routeParams = useParams()
  const bankId = propBankId || (routeParams?.id as string) || ''

  // Queries & Mutations
  const { data: bank, isLoading: isBankLoading } = useQuestionBank(bankId)
  const { data: questionsResponse, isLoading: isQuestionsLoading } = useBankQuestions(bankId)

  const questions: BankQuestionItem[] = useMemo(() => {
    return questionsResponse?.items || (bank as any)?.questions || []
  }, [questionsResponse, bank])

  const createQuestionMutation = useCreateBankQuestion()
  const updateQuestionMutation = useUpdateBankQuestion()
  const deleteQuestionMutation = useDeleteBankQuestion()
  const syncSheetMutation = useSyncGoogleSheet()
  const importCsvMutation = useImportCsvQuestions()

  // Modals state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<BankQuestionItem | null>(null)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)

  // Handlers
  const handleOpenAddQuestion = () => {
    setEditingQuestion(null)
    setIsQuestionModalOpen(true)
  }

  const handleOpenEditQuestion = (q: BankQuestionItem) => {
    setEditingQuestion(q)
    setIsQuestionModalOpen(true)
  }

  const handleSaveQuestion = async (values: CreateBankQuestionInput) => {
    try {
      if (editingQuestion) {
        await updateQuestionMutation.mutateAsync({
          bankId,
          questionId: editingQuestion.id,
          payload: values,
        })
        toast.success(`Đã cập nhật câu hỏi [${values.externalCode || values.code || ''}]`)
      } else {
        await createQuestionMutation.mutateAsync({
          bankId,
          payload: values,
        })
        toast.success(`Đã thêm câu hỏi [${values.externalCode || values.code || ''}] vào ngân hàng`)
      }
      setIsQuestionModalOpen(false)
      setEditingQuestion(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lưu câu hỏi thất bại'
      toast.error(msg)
    }
  }

  const handleDeleteQuestion = async (q: BankQuestionItem) => {
    try {
      await deleteQuestionMutation.mutateAsync({
        bankId,
        questionId: q.id,
      })
      toast.success(`Đã xóa câu hỏi [${q.externalCode || q.code || 'Q'}]`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xóa câu hỏi thất bại'
      toast.error(msg)
    }
  }

  const handleExecuteSheetSync = async (
    sheetUrl: string,
    overrideExisting: boolean
  ): Promise<SyncResultDto | void> => {
    try {
      const result = await syncSheetMutation.mutateAsync({
        bankId,
        googleSheetUrl: sheetUrl,
        overrideExisting,
      })
      toast.success(
        `Đồng bộ Google Sheets thành công! (+${result.stats?.added ?? 0} mới, ~${result.stats?.updated ?? 0} cập nhật)`
      )
      return result
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đồng bộ thất bại'
      toast.error(msg)
      throw err
    }
  }

  const handleExecuteCsvImport = async (
    file: File,
    overrideExisting: boolean
  ): Promise<SyncResultDto | void> => {
    try {
      const result = await importCsvMutation.mutateAsync({
        bankId,
        file,
        overrideExisting,
      })
      toast.success(
        `Import CSV thành công! (+${result.stats?.added ?? 0} mới, ~${result.stats?.updated ?? 0} cập nhật)`
      )
      return result
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import CSV thất bại'
      toast.error(msg)
      throw err
    }
  }

  const isLoading = isBankLoading || isQuestionsLoading

  if (isBankLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (!bank) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-base font-semibold text-foreground">Không tìm thấy ngân hàng câu hỏi</p>
        <Button onClick={() => router.push('/lms/admin/question-banks')} variant="outline" size="sm">
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  // Difficulty counts
  const easyCount = questions.filter((q: BankQuestionItem) => q.difficulty === 'EASY').length
  const medCount = questions.filter((q: BankQuestionItem) => q.difficulty === 'MEDIUM').length
  const hardCount = questions.filter((q: BankQuestionItem) => q.difficulty === 'HARD').length

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/lms/admin/question-banks"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Quay lại Ngân hàng câu hỏi</span>
        </Link>

        {/* Audit Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuditOpen(true)}
          className="text-xs h-8 gap-1.5"
        >
          <History className="h-3.5 w-3.5 text-primary" />
          <span>Lịch sử thay đổi (Audit Log)</span>
        </Button>
      </div>

      {/* Hero Bank Info Card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Info Details */}
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs px-2 py-0.5 bg-primary/5 text-primary border-primary/20">
                {bank.code}
              </Badge>
              {bank.category && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {bank.category.name}
                </Badge>
              )}
              {bank.isActive ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]">
                  Hoạt động
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground text-[11px]">
                  Tạm ngưng
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {bank.name}
            </h1>

            {bank.description && (
              <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                {bank.description}
              </p>
            )}

            {/* Google Sheet Link preview */}
            {bank.googleSheetUrl && (
              <div className="inline-flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-border/60 text-xs">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-muted-foreground">Nguồn Google Sheet:</span>
                <a
                  href={bank.googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1 truncate max-w-sm"
                >
                  <span className="truncate">{bank.googleSheetUrl}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setIsSyncModalOpen(true)}
              className="text-xs h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Đồng bộ Google Sheets</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              className="text-xs h-9 gap-1.5"
            >
              <FileUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Import Excel / CSV</span>
            </Button>
          </div>
        </div>

        {/* Sub-stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-border/60">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Tổng câu hỏi</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{questions.length}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Phân bổ độ khó</p>
            <p className="text-xs font-semibold text-foreground mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400">{easyCount} Dễ</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400">{medCount} TB</span>
              <span>•</span>
              <span className="text-rose-600 dark:text-rose-400">{hardCount} Khó</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Đồng bộ gần nhất</p>
            <p className="text-xs font-medium text-foreground mt-1 flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {bank.lastSyncedAt
                  ? new Date(bank.lastSyncedAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Chưa có'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <BankQuestionsTable
        questions={questions}
        isLoading={isLoading}
        onEditQuestion={handleOpenEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onAddNewQuestion={handleOpenAddQuestion}
      />

      {/* Modals & Drawers */}

      {/* Question Detail Modal (Create / Edit Question) */}
      <QuestionDetailModal
        isOpen={isQuestionModalOpen}
        onClose={() => {
          setIsQuestionModalOpen(false)
          setEditingQuestion(null)
        }}
        initialData={editingQuestion}
        onSubmit={handleSaveQuestion}
        isSubmitting={createQuestionMutation.isPending || updateQuestionMutation.isPending}
      />

      {/* Google Sheet Sync Dialog */}
      <GoogleSheetSyncDialog
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        bank={bank}
        onSync={handleExecuteSheetSync}
        isSyncing={syncSheetMutation.isPending}
      />

      {/* Excel / CSV Import Dialog */}
      <ExcelImportDialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        bank={bank}
        onImport={handleExecuteCsvImport}
        isImporting={importCsvMutation.isPending}
      />

      {/* Semantic Audit Trail Side Peek */}
      <EntityAuditSidePeek
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        tableName="quiz_question_banks"
        entityId={bank.id}
        entityTitle={bank.name}
        entitySubtitle={`Mã: ${bank.code}`}
      />
    </div>
  )
}
