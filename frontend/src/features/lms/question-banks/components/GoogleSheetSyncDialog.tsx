'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  HelpCircle,
} from 'lucide-react'
import type { QuestionBankItem, SyncResultDto } from '../types/question-banks.types'

interface GoogleSheetSyncDialogProps {
  isOpen: boolean
  onClose: () => void
  bank?: QuestionBankItem | null
  onSync: (sheetUrl: string, overrideExisting: boolean) => Promise<SyncResultDto | void>
  isSyncing: boolean
}

export function GoogleSheetSyncDialog({
  isOpen,
  onClose,
  bank,
  onSync,
  isSyncing,
}: GoogleSheetSyncDialogProps) {
  const [url, setUrl] = useState('')
  const [overrideExisting, setOverrideExisting] = useState(false)
  const [syncResult, setSyncResult] = useState<SyncResultDto | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (bank) {
      setUrl(bank.googleSheetUrl || '')
      setSyncResult(null)
      setErrorMsg(null)
      setOverrideExisting(false)
    }
  }, [bank, isOpen])

  const handleStartSync = async () => {
    if (!url.trim()) {
      setErrorMsg('Vui lòng nhập đường dẫn Google Sheets hợp lệ')
      return
    }
    setErrorMsg(null)
    try {
      const result = await onSync(url.trim(), overrideExisting)
      if (result) {
        setSyncResult(result)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đồng bộ thất bại, vui lòng kiểm tra quyền chia sẻ'
      setErrorMsg(msg)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSyncing && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Đồng bộ 1-Click từ Google Sheets
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {bank?.name} ({bank?.code})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Hướng dẫn kết nối */}
          <div className="bg-muted/30 border border-border/70 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span>Yêu cầu định dạng Google Sheets</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
              <li>
                Bật chia sẻ: <span className="font-semibold text-foreground">&quot;Bất kỳ ai có đường liên kết đều có thể xem&quot;</span>.
              </li>
              <li>
                Các cột tiêu đề (Dòng 1):{' '}
                <code className="bg-background px-1.5 py-0.5 rounded border text-[11px] font-mono text-primary">
                  code, question, type, difficulty, points, option_a, option_b, option_c, option_d, correct_answer, explanation, tags
                </code>
              </li>
              <li>Hệ thống tự động so khớp theo mã câu hỏi (Code) để cập nhật hoặc thêm mới.</li>
            </ul>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="sheetUrl" className="text-xs font-semibold text-foreground">
                Đường dẫn Google Sheets <span className="text-destructive">*</span>
              </Label>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Mở Google Sheet</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <Input
              id="sheetUrl"
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-xs font-mono"
              disabled={isSyncing}
            />
          </div>

          {/* Override Checkbox */}
          <div className="flex items-start space-x-2.5 p-3 rounded-lg border border-border/60 bg-muted/10">
            <Checkbox
              id="override"
              checked={overrideExisting}
              onCheckedChange={(checked) => setOverrideExisting(Boolean(checked))}
              disabled={isSyncing}
              className="mt-0.5"
            />
            <div className="space-y-0.5 leading-none">
              <label
                htmlFor="override"
                className="text-xs font-medium text-foreground cursor-pointer"
              >
                Chế độ đồng bộ ghi đè nghiêm ngặt (Override)
              </label>
              <p className="text-[11px] text-muted-foreground">
                Tự động vô hiệu hóa các câu hỏi cũ trong ngân hàng nếu không còn xuất hiện trong Google Sheet.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2.5 text-destructive text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Đồng bộ thất bại</p>
                <p className="text-[11px] leading-relaxed opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Success Result Summary */}
          {syncResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Đồng bộ thành công!</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                  + {syncResult.stats?.added ?? syncResult.added ?? 0} câu hỏi mới
                </Badge>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
                  ~ {syncResult.stats?.updated ?? syncResult.updated ?? 0} câu hỏi cập nhật
                </Badge>
                {((syncResult.stats?.deactivated ?? syncResult.deactivated ?? 0) > 0) && (
                  <Badge variant="outline" className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
                    - {syncResult.stats?.deactivated ?? syncResult.deactivated} câu vô hiệu hóa
                  </Badge>
                )}
                <Badge variant="outline" className="bg-background text-foreground">
                  Tổng {syncResult.stats?.totalIncoming ?? syncResult.totalInSource ?? 0} câu hỏi
                </Badge>
              </div>

              {((syncResult.syncErrors && syncResult.syncErrors.length > 0) || (syncResult.errors && syncResult.errors.length > 0)) && (
                <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 space-y-1">
                  <p className="font-medium">
                    Có {(syncResult.syncErrors || syncResult.errors || []).length} cảnh báo:
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {(syncResult.syncErrors || syncResult.errors || []).slice(0, 3).map((e, idx) => (
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
            disabled={isSyncing}
          >
            {syncResult ? 'Đóng' : 'Hủy'}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleStartSync}
            disabled={isSyncing || !url.trim()}
            className="gap-1.5"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang tải dữ liệu Sheet...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>{syncResult ? 'Đồng bộ lại' : 'Bắt đầu đồng bộ'}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
