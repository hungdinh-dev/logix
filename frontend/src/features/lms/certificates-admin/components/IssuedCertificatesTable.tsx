'use client'

import React from 'react'
import {
  MoreHorizontal,
  Eye,
  Calendar,
  AlertTriangle,
  Trash2,
  Copy,
  Check,
  Award,
  ExternalLink,
  RotateCcw,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import type { UserCertificateItem } from '../types/certificate-admin.types'

interface IssuedCertificatesTableProps {
  certificates: UserCertificateItem[]
  isLoading: boolean
  onPreview: (cert: UserCertificateItem) => void
  onRenew: (cert: UserCertificateItem) => void
  onRevoke: (cert: UserCertificateItem) => void
  onDelete: (id: string) => void
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  onPageChange: (newPage: number) => void
}

export function IssuedCertificatesTable({
  certificates,
  isLoading,
  onPreview,
  onRenew,
  onRevoke,
  onDelete,
  pagination,
  onPageChange,
}: IssuedCertificatesTableProps) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('Đã copy mã chứng chỉ', { description: code })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getAvatarInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const renderStatusBadge = (status: string, expiryDate?: string | null) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Còn hiệu lực
          </span>
        )
      case 'EXPIRING_SOON':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Sắp hết hạn
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Đã hết hạn
          </span>
        )
      case 'REVOKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Đã thu hồi
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 text-center shadow-2xs">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
          <Award className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Chưa có chứng chỉ nào</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
          Hệ thống chưa ghi nhận chứng chỉ nào theo bộ lọc hiện tại. Bấm nút "Cấp Chứng Chỉ" để cấp phát chứng chỉ đầu tiên.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/80">
            <TableRow>
              <TableHead className="w-[280px] text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">
                Học Viên / Nhân Sự
              </TableHead>
              <TableHead className="w-[180px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mã Chứng Chỉ
              </TableHead>
              <TableHead className="min-w-[220px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Khóa Học / Chương Trình
              </TableHead>
              <TableHead className="w-[130px] text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                Ngày Cấp
              </TableHead>
              <TableHead className="w-[140px] text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                Hạn Hiệu Lực
              </TableHead>
              <TableHead className="w-[140px] text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                Trạng Thái
              </TableHead>
              <TableHead className="w-[70px] text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right pr-4">
                Thao Tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60">
            {certificates.map((cert) => {
              const initials = getAvatarInitials(cert.recipientName || cert.user?.fullName || '')
              return (
                <TableRow
                  key={cert.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Recipient */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border/80">
                        <AvatarFallback className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {cert.recipientName || cert.user?.fullName}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <span>{cert.user?.employeeCode || 'N/A'}</span>
                          {cert.user?.department?.deptName && (
                            <>
                              <span>•</span>
                              <span>{cert.user.department.deptName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Certificate Code */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
                        {cert.certificateCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(cert.certificateCode)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded hover:bg-muted/80 transition-colors"
                        title="Copy mã chứng chỉ"
                      >
                        {copiedCode === cert.certificateCode ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    {cert.isExternal && (
                      <span className="inline-block mt-1 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                        Ngoại kiểm (Ngoài)
                      </span>
                    )}
                  </TableCell>

                  {/* Course Title */}
                  <TableCell className="py-3">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-foreground line-clamp-1">
                        {cert.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {cert.template?.name || cert.course?.title || 'Chứng nhận nội bộ'}
                      </div>
                    </div>
                  </TableCell>

                  {/* Issue Date */}
                  <TableCell className="py-3 text-center text-xs font-medium text-foreground">
                    {formatDate(cert.issueDate)}
                  </TableCell>

                  {/* Expiry Date */}
                  <TableCell className="py-3 text-center">
                    {cert.expiryDate ? (
                      <div className="text-xs font-medium text-foreground">
                        {formatDate(cert.expiryDate)}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Vô thời hạn</span>
                    )}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3 text-center">
                    {renderStatusBadge(cert.status, cert.expiryDate)}
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="py-3 text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg cursor-pointer hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 shadow-md rounded-xl">
                        <DropdownMenuItem
                          onClick={() => onPreview(cert)}
                          className="gap-2 text-xs font-medium cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-primary" />
                          <span>Xem & In Phôi</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onRenew(cert)}
                          className="gap-2 text-xs font-medium cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Gia Hạn Hiệu Lực</span>
                        </DropdownMenuItem>

                        {cert.status !== 'REVOKED' && (
                          <DropdownMenuItem
                            onClick={() => onRevoke(cert)}
                            className="gap-2 text-xs font-medium text-amber-700 dark:text-amber-400 cursor-pointer"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Thu Hồi Chứng Chỉ</span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onDelete(cert.id)}
                          className="gap-2 text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Xóa Bản Ghi</span>
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

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
          <div>
            Hiển thị <strong>{(pagination.page - 1) * pagination.limit + 1}</strong> -{' '}
            <strong>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> trong{' '}
            <strong>{pagination.total}</strong> chứng chỉ
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="h-8 px-2.5 text-xs rounded-lg cursor-pointer"
            >
              Trang trước
            </Button>
            <span className="px-2 font-medium text-foreground">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="h-8 px-2.5 text-xs rounded-lg cursor-pointer"
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
