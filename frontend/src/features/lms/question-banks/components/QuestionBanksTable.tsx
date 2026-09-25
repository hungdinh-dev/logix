'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  HelpCircle,
  FileQuestion,
  FileSpreadsheet,
  FileUp,
  RefreshCw,
  History,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  Inbox,
  Clock,
} from 'lucide-react'
import type { QuestionBankItem } from '../types/question-banks.types'

interface QuestionBanksTableProps {
  items: QuestionBankItem[]
  isLoading: boolean
  hasActiveFilters: boolean
  onResetFilters: () => void
  onNavigateToDetail: (bankId: string) => void
  onSyncGoogleSheet: (bank: QuestionBankItem) => void
  onImportCsv: (bank: QuestionBankItem) => void
  onViewAudit: (bank: QuestionBankItem) => void
  onEditBank: (bank: QuestionBankItem) => void
  onDeleteBank: (bank: QuestionBankItem) => void
}

function formatRelativeTime(isoDate?: string | null) {
  if (!isoDate) return 'Chưa đồng bộ'
  try {
    const d = new Date(isoDate)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`

    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoDate
  }
}

export function QuestionBanksTable({
  items,
  isLoading,
  hasActiveFilters,
  onResetFilters,
  onNavigateToDetail,
  onSyncGoogleSheet,
  onImportCsv,
  onViewAudit,
  onEditBank,
  onDeleteBank,
}: QuestionBanksTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">Chưa có ngân hàng câu hỏi nào</h3>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm mx-auto">
          {hasActiveFilters
            ? 'Không tìm thấy ngân hàng câu hỏi nào khớp với bộ lọc hiện tại.'
            : 'Tạo ngân hàng đề thi đầu tiên hoặc liên kết với Google Sheets để bắt đầu.'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Đặt lại bộ lọc tìm kiếm
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="py-3 pl-4 text-xs font-semibold text-muted-foreground">
              Ngân Hàng Đề Thi
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
              Danh Mục Phân Loại
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
              Nguồn Dữ Liệu
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
              Số Lượng Câu Hỏi
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold text-muted-foreground">
              Lần Đồng Bộ Cuối
            </TableHead>
            <TableHead className="py-3 pr-4 text-xs font-semibold text-muted-foreground text-right">
              Thao Tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-border/60">
          {items.map((bank) => {
            const relativeTime = formatRelativeTime(bank.lastSyncedAt || bank.updatedAt)

            return (
              <TableRow key={bank.id} className="hover:bg-muted/30 transition-colors">
                {/* Tên & Mã Ngân hàng */}
                <TableCell className="py-3.5 pl-4 max-w-[280px]">
                  <div
                    onClick={() => onNavigateToDetail(bank.id)}
                    className="cursor-pointer group flex items-start gap-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs mt-0.5">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {bank.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                        <span className="font-mono font-medium">{bank.code}</span>
                        {bank.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{bank.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Danh mục */}
                <TableCell className="py-3.5">
                  {bank.category ? (
                    <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5">
                      {bank.category.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-[11px]">Chưa phân loại</span>
                  )}
                </TableCell>

                {/* Nguồn dữ liệu */}
                <TableCell className="py-3.5">
                  {bank.syncSource === 'GOOGLE_SHEETS' && (
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] gap-1"
                      >
                        <FileSpreadsheet className="h-3 w-3 inline" />
                        <span>Google Sheets</span>
                      </Badge>
                      {bank.googleSheetUrl && (
                        <a
                          href={bank.googleSheetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                          title="Mở bảng tính Google Sheets"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                  {bank.syncSource === 'EXCEL' && (
                    <Badge
                      variant="outline"
                      className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400 font-medium text-[11px] gap-1"
                    >
                      <FileUp className="h-3 w-3 inline" />
                      <span>File Excel/CSV</span>
                    </Badge>
                  )}
                  {bank.syncSource === 'MANUAL' && (
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      Nhập thủ công
                    </Badge>
                  )}
                </TableCell>

                {/* Số lượng câu hỏi */}
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-1.5">
                    <FileQuestion className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-foreground text-xs">
                      {bank.totalQuestions}
                    </span>
                    <span className="text-[11px] text-muted-foreground">câu</span>
                  </div>
                </TableCell>

                {/* Lần đồng bộ cuối */}
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span title={bank.lastSyncedAt ? new Date(bank.lastSyncedAt).toLocaleString('vi-VN') : undefined}>
                      {relativeTime}
                    </span>
                  </div>
                </TableCell>

                {/* Thao tác */}
                <TableCell className="py-3.5 pr-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 text-xs">
                      <DropdownMenuItem
                        onClick={() => onNavigateToDetail(bank.id)}
                        className="cursor-pointer gap-2 font-medium"
                      >
                        <FileQuestion className="h-3.5 w-3.5 text-primary" />
                        <span>Xem câu hỏi trong kho</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onSyncGoogleSheet(bank)}
                        className="cursor-pointer gap-2"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Đồng bộ từ Google Sheet</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onImportCsv(bank)}
                        className="cursor-pointer gap-2"
                      >
                        <FileUp className="h-3.5 w-3.5 text-sky-600" />
                        <span>Nhập từ file Excel/CSV</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onViewAudit(bank)}
                        className="cursor-pointer gap-2"
                      >
                        <History className="h-3.5 w-3.5 text-purple-600" />
                        <span>Lịch sử thay đổi (Audit)</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onEditBank(bank)}
                        className="cursor-pointer gap-2"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Chỉnh sửa thông tin</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onDeleteBank(bank)}
                        className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Vô hiệu hóa ngân hàng</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
