'use client'

import React from 'react'
import { Search, X, RotateCcw, Plus, Download, FileSpreadsheet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SyncSourceType } from '../types/question-banks.types'

interface QuestionBanksToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  selectedCategoryId: string
  onCategoryChange: (val: string) => void
  categories: Array<{ id: string; name: string; code: string }>
  syncSource: SyncSourceType | 'ALL'
  onSyncSourceChange: (val: SyncSourceType | 'ALL') => void
  hasActiveFilters: boolean
  onResetFilters: () => void
  onCreateClick: () => void
  onDownloadTemplate: () => void
}

export function QuestionBanksToolbar({
  search,
  onSearchChange,
  selectedCategoryId,
  onCategoryChange,
  categories,
  syncSource,
  onSyncSourceChange,
  hasActiveFilters,
  onResetFilters,
  onCreateClick,
  onDownloadTemplate,
}: QuestionBanksToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border shadow-2xs">
      {/* Left: Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã hoặc tên ngân hàng câu hỏi..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 h-9 text-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Right: Filters & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Filter */}
        <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[170px] h-9 text-xs">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">Tất cả danh mục</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="text-xs">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sync Source Filter */}
        <Select value={syncSource} onValueChange={(val) => onSyncSourceChange(val as any)}>
          <SelectTrigger className="w-[170px] h-9 text-xs">
            <SelectValue placeholder="Nguồn đồng bộ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">Tất cả nguồn</SelectItem>
            <SelectItem value="GOOGLE_SHEETS" className="text-xs">Google Sheets</SelectItem>
            <SelectItem value="EXCEL" className="text-xs">File Excel / CSV</SelectItem>
            <SelectItem value="MANUAL" className="text-xs">Nhập thủ công</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filter */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa lọc</span>
          </Button>
        )}

        {/* Download Template */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadTemplate}
          className="h-9 px-3 text-xs gap-1.5 cursor-pointer"
          title="Tải file Excel/CSV mẫu để chuẩn bị câu hỏi"
        >
          <Download className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">Tải file mẫu Excel</span>
        </Button>

        {/* Create Bank CTA */}
        <Button
          size="sm"
          onClick={onCreateClick}
          className="h-9 px-3 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground cursor-pointer shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Ngân Hàng</span>
        </Button>
      </div>
    </div>
  )
}
