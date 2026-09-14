'use client'

import React, { useState, useEffect } from 'react'
import { Search, X, Plus, FileDown, Layers, Award } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CertificateStatus } from '../types/certificate-admin.types'

interface CertificatesToolbarProps {
  activeTab: 'issued' | 'templates'
  searchQuery: string
  onSearchChange: (val: string) => void
  statusFilter: CertificateStatus | 'ALL'
  onStatusFilterChange: (val: CertificateStatus | 'ALL') => void
  onOpenIssueModal: () => void
  onOpenTemplateModal: () => void
  onExportData?: () => void
}

export function CertificatesToolbar({
  activeTab,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenIssueModal,
  onOpenTemplateModal,
  onExportData,
}: CertificatesToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, onSearchChange])

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-card/60 p-3.5 rounded-xl border border-border/80 shadow-2xs">
      {/* Search & Filter Group */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={
              activeTab === 'issued'
                ? 'Tìm theo tên, mã bằng, email, khóa học...'
                : 'Tìm theo tên mẫu, mã phôi...'
            }
            className="pl-9 pr-8 h-9 text-sm bg-background border-border/80 rounded-lg"
          />
          {localSearch && (
            <button
              onClick={() => {
                setLocalSearch('')
                onSearchChange('')
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter (Only on Issued Tab) */}
        {activeTab === 'issued' && (
          <Select
            value={statusFilter}
            onValueChange={(val) => onStatusFilterChange(val as CertificateStatus | 'ALL')}
          >
            <SelectTrigger className="w-[160px] h-9 text-xs font-medium bg-background border-border/80 rounded-lg">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Còn hiệu lực</SelectItem>
              <SelectItem value="EXPIRING_SOON">Sắp hết hạn (&lt;30d)</SelectItem>
              <SelectItem value="EXPIRED">Đã hết hạn</SelectItem>
              <SelectItem value="REVOKED">Đã thu hồi</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Action Buttons Group */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {activeTab === 'issued' && onExportData && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportData}
            className="h-9 px-3 text-xs font-medium gap-1.5 border-border/80 rounded-lg shadow-2xs cursor-pointer"
          >
            <FileDown className="h-4 w-4 text-muted-foreground" />
            <span>Xuất Danh Sách</span>
          </Button>
        )}

        {activeTab === 'issued' ? (
          <Button
            size="sm"
            onClick={onOpenIssueModal}
            className="h-9 px-3.5 text-xs font-semibold gap-1.5 rounded-lg shadow-xs cursor-pointer"
          >
            <Award className="h-4 w-4" />
            <span>+ Cấp Chứng Chỉ</span>
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onOpenTemplateModal}
            className="h-9 px-3.5 text-xs font-semibold gap-1.5 rounded-lg shadow-xs cursor-pointer"
          >
            <Layers className="h-4 w-4" />
            <span>+ Tạo Mẫu Phôi Mới</span>
          </Button>
        )}
      </div>
    </div>
  )
}
