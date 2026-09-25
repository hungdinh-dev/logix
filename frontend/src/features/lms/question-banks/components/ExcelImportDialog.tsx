'use client'

import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  FileUp,
  Download,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  FileText,
  X,
} from 'lucide-react'
import type { QuestionBankItem, SyncResultDto } from '../types/question-banks.types'
import { questionBanksService } from '../services/question-banks.service'

interface ExcelImportDialogProps {
  isOpen: boolean
  onClose: () => void
  bank?: QuestionBankItem | null
  onImport: (file: File, overrideExisting: boolean) => Promise<SyncResultDto | void>
  isImporting: boolean
}

export function ExcelImportDialog({
  isOpen,
  onClose,
  bank,
  onImport,
  isImporting,
}: ExcelImportDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [overrideExisting, setOverrideExisting] = useState(false)
  const [importResult, setImportResult] = useState<SyncResultDto | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleReset = () => {
    setSelectedFile(null)
    setImportResult(null)
    setErrorMsg(null)
    setOverrideExisting(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
        setErrorMsg('Vui lòng chọn file CSV định dạng chuẩn (.csv)')
        return
      }
      setSelectedFile(file)
      setErrorMsg(null)
      setImportResult(null)
    }
  }

  const handleStartImport = async () => {
    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn file CSV trước khi bấm Import')
      return
    }
    setErrorMsg(null)
    try {
      const result = await onImport(selectedFile, overrideExisting)
      if (result) {
        setImportResult(result)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import thất bại, vui lòng kiểm tra nội dung file'
      setErrorMsg(msg)
    }
  }

  const handleDownloadTemplate = () => {
    try {
      questionBanksService.downloadTemplate()
    } catch (err) {
      console.error('Failed to download template', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isImporting && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Import Câu hỏi từ Excel / CSV
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {bank?.name} ({bank?.code})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Action Download Template */}
          <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border/70 rounded-xl">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Chưa có file mẫu chuẩn?</p>
              <p className="text-[11px] text-muted-foreground">
                Tải file CSV mẫu có sẵn dữ liệu ví dụ và cấu trúc 12 cột chuẩn.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-xs gap-1.5 shrink-0 bg-background"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Tải file mẫu (.csv)</span>
            </Button>
          </div>

          {/* File Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              selectedFile
                ? 'border-primary bg-primary/5'
                : 'border-border/80 hover:border-primary/60 hover:bg-muted/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">{selectedFile.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Nhấp để chọn file khác
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReset()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                  <FileUp className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  Nhấp để tải lên hoặc kéo thả file CSV vào đây
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Hỗ trợ file định dạng CSV UTF-8 (Tối đa 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Override Option */}
          <div className="flex items-start space-x-2.5 p-3 rounded-lg border border-border/60 bg-muted/10">
            <Checkbox
              id="overrideCsv"
              checked={overrideExisting}
              onCheckedChange={(checked) => setOverrideExisting(Boolean(checked))}
              disabled={isImporting}
              className="mt-0.5"
            />
            <div className="space-y-0.5 leading-none">
              <label
                htmlFor="overrideCsv"
                className="text-xs font-medium text-foreground cursor-pointer"
              >
                Chế độ thay thế toàn bộ (Override)
              </label>
              <p className="text-[11px] text-muted-foreground">
                Tự động vô hiệu hóa các câu hỏi hiện có trong ngân hàng nếu không nằm trong file tải lên.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2.5 text-destructive text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Import không thành công</p>
                <p className="text-[11px] leading-relaxed opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Success Result */}
          {importResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Import thành công!</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                  + {importResult.stats?.added ?? importResult.added ?? 0} câu hỏi mới
                </Badge>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                  ~ {importResult.stats?.updated ?? importResult.updated ?? 0} câu hỏi cập nhật
                </Badge>
                {((importResult.stats?.deactivated ?? importResult.deactivated ?? 0) > 0) && (
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
                    - {importResult.stats?.deactivated ?? importResult.deactivated} câu vô hiệu hóa
                  </Badge>
                )}
                <Badge variant="outline" className="bg-background text-foreground">
                  Tổng {importResult.stats?.totalIncoming ?? importResult.totalInSource ?? 0} câu hỏi
                </Badge>
              </div>

              {((importResult.syncErrors && importResult.syncErrors.length > 0) || (importResult.errors && importResult.errors.length > 0)) && (
                <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 space-y-1">
                  <p className="font-medium">
                    Có {(importResult.syncErrors || importResult.errors || []).length} cảnh báo:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {(importResult.syncErrors || importResult.errors || []).slice(0, 3).map((e, idx) => (
                      <li key={idx}>Dòng {e.row}: {e.error || e.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-border bg-muted/20 flex items-center justify-between sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isImporting}
          >
            {importResult ? 'Đóng' : 'Hủy'}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleStartImport}
            disabled={isImporting || !selectedFile}
            className="gap-1.5"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý dữ liệu...</span>
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4" />
                <span>{importResult ? 'Import file khác' : 'Tiến hành Import'}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
