'use client'

import React from 'react'
import { Layers, Edit3, Trash2, Shield, Clock, BookOpen, Award } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { CertificateTemplateItem } from '../types/certificate-admin.types'

interface CertificateTemplatesTableProps {
  templates: CertificateTemplateItem[]
  isLoading: boolean
  onEdit: (template: CertificateTemplateItem) => void
  onDelete: (template: CertificateTemplateItem) => void
  onOpenCreate: () => void
}

export function CertificateTemplatesTable({
  templates,
  isLoading,
  onEdit,
  onDelete,
  onOpenCreate,
}: CertificateTemplatesTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 text-center shadow-2xs">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
          <Layers className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Chưa có Mẫu Phôi Chứng Chỉ nào</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
          Tạo mẫu phôi chuẩn doanh nghiệp để áp dụng cấu hình thời hạn (ATTP 12 tháng hoặc Vô hạn) và người ký cho các khóa học.
        </p>
        <Button size="sm" onClick={onOpenCreate} className="h-9 px-3.5 text-xs font-semibold gap-1.5 rounded-lg shadow-xs cursor-pointer">
          <Layers className="h-4 w-4" />
          <span>+ Tạo Mẫu Phôi Đầu Tiên</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/80">
            <TableRow>
              <TableHead className="w-[300px] text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">
                Tên Mẫu &amp; Mã Phôi
              </TableHead>
              <TableHead className="w-[160px] text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                Thời Hạn Hiệu Lực
              </TableHead>
              <TableHead className="min-w-[220px] text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Người Ký &amp; Đơn Vị Cấp
              </TableHead>
              <TableHead className="w-[140px] text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                Đang Áp Dụng
              </TableHead>
              <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right pr-4">
                Thao Tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60">
            {templates.map((tmpl) => (
              <TableRow key={tmpl.id} className="hover:bg-muted/30 transition-colors group">
                {/* Template Name & Code */}
                <TableCell className="py-3.5">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      <span>{tmpl.name}</span>
                      <span className="font-mono text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
                        {tmpl.code}
                      </span>
                    </div>
                    {tmpl.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{tmpl.description}</p>
                    )}
                  </div>
                </TableCell>

                {/* Validity */}
                <TableCell className="py-3.5 text-center">
                  {tmpl.validityMonths ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                      <Clock className="h-3 w-3" />
                      {tmpl.validityMonths} Tháng (ATTP)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                      <Shield className="h-3 w-3" />
                      Vô thời hạn
                    </span>
                  )}
                </TableCell>

                {/* Signatory */}
                <TableCell className="py-3.5">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-foreground">{tmpl.signatoryName}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {tmpl.signatoryTitle} • {tmpl.issuingOrganization}
                    </div>
                  </div>
                </TableCell>

                {/* Usage Count */}
                <TableCell className="py-3.5 text-center">
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1" title="Số khóa học gán mẫu này">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                      <strong>{tmpl._count?.courses ?? 0}</strong> khóa
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1" title="Số chứng chỉ đã cấp theo mẫu này">
                      <Award className="h-3.5 w-3.5 text-amber-600" />
                      <strong>{tmpl._count?.certificates ?? 0}</strong> đã cấp
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 text-right pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tmpl)}
                      className="h-8 w-8 p-0 rounded-lg hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground"
                      title="Chỉnh sửa mẫu phôi"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tmpl)}
                      className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Xóa mẫu phôi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
