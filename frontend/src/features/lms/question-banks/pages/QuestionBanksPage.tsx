'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EntityAuditSidePeek } from '@/components/shared/EntityAuditSidePeek'
import {
  QuestionBanksStatsCards,
  QuestionBanksToolbar,
  QuestionBanksTable,
  CreateBankModal,
  GoogleSheetSyncDialog,
  ExcelImportDialog,
} from '../components'
import {
  useQuestionBanks,
  useCreateQuestionBank,
  useUpdateQuestionBank,
  useDeleteQuestionBank,
  useSyncGoogleSheet,
  useImportCsvQuestions,
} from '../hooks/use-question-banks'
import { courseApiService } from '@/features/lms/services/course.service'
import { questionBanksService } from '../services/question-banks.service'
import type {
  QuestionBankItem,
  CreateQuestionBankInput,
  SyncResultDto,
  SyncSourceType,
} from '../types/question-banks.types'

export function QuestionBanksPage() {
  const router = useRouter()

  // State
  const [categories, setCategories] = useState<Array<{ id: string; name: string; code: string }>>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedSource, setSelectedSource] = useState<SyncSourceType | 'ALL'>('ALL')

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingBank, setEditingBank] = useState<QuestionBankItem | null>(null)
  const [syncingBank, setSyncingBank] = useState<QuestionBankItem | null>(null)
  const [importingBank, setImportingBank] = useState<QuestionBankItem | null>(null)
  const [auditBank, setAuditBank] = useState<QuestionBankItem | null>(null)
  const [deletingBank, setDeletingBank] = useState<QuestionBankItem | null>(null)

  // React Query hooks
  const { data: apiResponse, isLoading, refetch } = useQuestionBanks({
    search: search || undefined,
    categoryId: selectedCategory === 'ALL' ? undefined : selectedCategory,
    syncSource: selectedSource === 'ALL' ? undefined : selectedSource,
  })

  const banks = useMemo(() => apiResponse?.items || [], [apiResponse])

  const createMutation = useCreateQuestionBank()
  const updateMutation = useUpdateQuestionBank()
  const deleteMutation = useDeleteQuestionBank()
  const syncSheetMutation = useSyncGoogleSheet()
  const importCsvMutation = useImportCsvQuestions()

  // Load categories
  useEffect(() => {
    courseApiService
      .getCategories()
      .then((cats) => {
        setCategories(
          cats.map((c) => ({
            id: c.id,
            name: c.name,
            code: c.code,
          }))
        )
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
      })
  }, [])

  // Stats calculation
  const stats = useMemo(() => {
    if (apiResponse?.stats) {
      return {
        totalBanks: apiResponse.stats.totalBanks,
        googleSheetLinked: apiResponse.stats.googleSheetBanks,
        totalQuestions: apiResponse.stats.totalQuestions,
        activeBanks: banks.filter((b) => b.isActive).length,
      }
    }
    const totalBanks = banks.length
    const googleSheetLinked = banks.filter((b) => Boolean(b.googleSheetUrl)).length
    const totalQuestions = banks.reduce((sum, b) => sum + (b.totalQuestions || 0), 0)
    const activeBanks = banks.filter((b) => b.isActive).length
    return { totalBanks, googleSheetLinked, totalQuestions, activeBanks }
  }, [apiResponse, banks])

  const hasActiveFilters = search.trim() !== '' || selectedCategory !== 'ALL' || selectedSource !== 'ALL'

  const handleResetFilters = () => {
    setSearch('')
    setSelectedCategory('ALL')
    setSelectedSource('ALL')
  }

  // Handlers
  const handleOpenCreate = () => {
    setEditingBank(null)
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (bank: QuestionBankItem) => {
    setEditingBank(bank)
    setIsCreateOpen(true)
  }

  const handleSaveBank = async (values: CreateQuestionBankInput) => {
    try {
      if (editingBank) {
        await updateMutation.mutateAsync({
          id: editingBank.id,
          payload: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      setIsCreateOpen(false)
      setEditingBank(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thao tác lưu thất bại'
      toast.error(msg)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingBank) return
    try {
      await deleteMutation.mutateAsync(deletingBank.id)
      setDeletingBank(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xóa thất bại'
      toast.error(msg)
    }
  }

  const handleExecuteSheetSync = async (
    sheetUrl: string,
    overrideExisting: boolean
  ): Promise<SyncResultDto | void> => {
    if (!syncingBank) return
    try {
      const result = await syncSheetMutation.mutateAsync({
        bankId: syncingBank.id,
        googleSheetUrl: sheetUrl,
        overrideExisting,
      })
      toast.success(
        `Đồng bộ Google Sheets hoàn tất! (+${result.stats?.added ?? 0} mới, ~${result.stats?.updated ?? 0} cập nhật)`
      )
      return result
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đồng bộ Google Sheets thất bại'
      toast.error(msg)
      throw err
    }
  }

  const handleExecuteCsvImport = async (
    file: File,
    overrideExisting: boolean
  ): Promise<SyncResultDto | void> => {
    if (!importingBank) return
    try {
      const result = await importCsvMutation.mutateAsync({
        bankId: importingBank.id,
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

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Ngân hàng Câu hỏi
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Kho lưu trữ tập trung các câu hỏi trắc nghiệm, tích hợp đồng bộ Google Sheets 1-Click và xuất đề thi ngẫu nhiên.
          </p>
        </div>
      </div>

      {/* 2. KPI Stats Cards */}
      <QuestionBanksStatsCards {...stats} isLoading={isLoading} />

      {/* 3. Toolbar */}
      <QuestionBanksToolbar
        search={search}
        onSearchChange={setSearch}
        selectedCategoryId={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        syncSource={selectedSource}
        onSyncSourceChange={setSelectedSource}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onCreateClick={handleOpenCreate}
        onDownloadTemplate={() => questionBanksService.downloadTemplate()}
      />

      {/* 4. Table */}
      <QuestionBanksTable
        items={banks}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        onNavigateToDetail={(id) => router.push(`/lms/admin/question-banks/${id}`)}
        onSyncGoogleSheet={(bank) => setSyncingBank(bank)}
        onImportCsv={(bank) => setImportingBank(bank)}
        onViewAudit={(bank) => setAuditBank(bank)}
        onEditBank={handleOpenEdit}
        onDeleteBank={(bank) => setDeletingBank(bank)}
      />

      {/* 5. Modals & Side Peeks */}

      {/* Create / Edit Bank Modal */}
      <CreateBankModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingBank(null)
        }}
        initialData={editingBank}
        categories={categories}
        onSubmit={handleSaveBank}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Google Sheet Sync Dialog */}
      <GoogleSheetSyncDialog
        isOpen={Boolean(syncingBank)}
        onClose={() => setSyncingBank(null)}
        bank={syncingBank}
        onSync={handleExecuteSheetSync}
        isSyncing={syncSheetMutation.isPending}
      />

      {/* Excel / CSV Import Dialog */}
      <ExcelImportDialog
        isOpen={Boolean(importingBank)}
        onClose={() => setImportingBank(null)}
        bank={importingBank}
        onImport={handleExecuteCsvImport}
        isImporting={importCsvMutation.isPending}
      />

      {/* Semantic Audit Trail Side Peek */}
      <EntityAuditSidePeek
        isOpen={Boolean(auditBank)}
        onClose={() => setAuditBank(null)}
        tableName="quiz_question_banks"
        entityId={auditBank?.id}
        entityTitle={auditBank?.name}
        entitySubtitle={`Mã: ${auditBank?.code} • Ngân hàng câu hỏi`}
      />

      {/* Alert Dialog Delete Confirmation */}
      <AlertDialog
        open={Boolean(deletingBank)}
        onOpenChange={(open) => !open && setDeletingBank(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-foreground">
              Xác nhận xóa ngân hàng câu hỏi?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground space-y-1">
              <span>Bạn sắp xóa ngân hàng:</span>{' '}
              <strong className="text-foreground">
                [{deletingBank?.code}] {deletingBank?.name}
              </strong>
              <p className="text-destructive text-[11px] pt-1">
                Tất cả câu hỏi trắc nghiệm và quy tắc rút đề liên quan trong ngân hàng này sẽ bị xóa. Hành động này không thể hoàn tác!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
