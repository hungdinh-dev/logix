'use client'

import React from 'react'
import { Search, X, FolderTree, Layers, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTableViewOptions } from '@/components/common/DataTableViewOptions'
import { DataTableFacetedFilter } from '@/components/common/DataTableFacetedFilter'
import type { ColumnVisibility, CourseTypeFilter } from '../types/courses-admin.types'

interface CoursesToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  selectedCategories: string[]
  onCategoriesChange: (vals: string[]) => void
  categories: { id: string; name: string }[]
  selectedProgressions: string[]
  onProgressionsChange: (vals: string[]) => void
  selectedType: CourseTypeFilter
  onTypeChange: (val: CourseTypeFilter) => void
  hasActiveFilters: boolean
  onResetFilters: () => void
  columnVisibility: ColumnVisibility
  onToggleColumn: (key: string, visible: boolean) => void
}

export function CoursesToolbar({
  search,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  categories,
  selectedProgressions,
  onProgressionsChange,
  selectedType,
  onTypeChange,
  hasActiveFilters,
  onResetFilters,
  columnVisibility,
  onToggleColumn,
}: CoursesToolbarProps) {
  const columnOptions = [
    { key: 'code', label: 'Mã khóa học', visible: columnVisibility.code },
    { key: 'category', label: 'Danh mục', visible: columnVisibility.category },
    { key: 'type', label: 'Phân loại (Bắt buộc)', visible: columnVisibility.type },
    { key: 'progression', label: 'Hạn & Chế độ học', visible: columnVisibility.progression },
    { key: 'status', label: 'Trạng thái', visible: columnVisibility.status },
    { key: 'enrollment', label: 'Số học viên', visible: columnVisibility.enrollment },
    { key: 'updatedAt', label: 'Ngày cập nhật', visible: columnVisibility.updatedAt },
    { key: 'actions', label: 'Cột Thao tác', visible: columnVisibility.actions },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border shadow-2xs">
      {/* Left: Search Input */}
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã hoặc tên khóa học..."
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

      {/* Right: Filters & Column Visibility */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Category Filter: Multi-select with Search */}
        <DataTableFacetedFilter
          title="Danh mục"
          icon={<FolderTree className="h-3.5 w-3.5 text-muted-foreground" />}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))}
          selectedValues={selectedCategories}
          onSelectChange={onCategoriesChange}
          searchable={true}
          searchPlaceholder="Tìm danh mục..."
        />

        {/* 2. Progression Mode Filter: Multi-select */}
        <DataTableFacetedFilter
          title="Chế độ học"
          icon={<Layers className="h-3.5 w-3.5 text-muted-foreground" />}
          options={[
            { label: 'Tự do', value: 'FREE' },
            { label: 'Tuần tự bài', value: 'LINEAR_LESSON' },
            { label: 'Tuần tự chương', value: 'LINEAR_MODULE' },
          ]}
          selectedValues={selectedProgressions}
          onSelectChange={onProgressionsChange}
          searchable={false}
        />

        {/* 3. Type Filter: Single Select */}
        <DataTableFacetedFilter
          title="Phân loại"
          icon={<Filter className="h-3.5 w-3.5 text-muted-foreground" />}
          options={[
            { label: 'Tất cả loại', value: 'ALL' },
            { label: 'Bắt buộc', value: 'MANDATORY' },
            { label: 'Tùy chọn', value: 'OPTIONAL' },
          ]}
          selectedValues={[selectedType]}
          onSelectChange={(vals) => onTypeChange((vals[0] as CourseTypeFilter) || 'ALL')}
          multiple={false}
          searchable={false}
        />


        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
            title="Xóa tất cả bộ lọc"
          >
            <X className="h-3.5 w-3.5" />
            <span>Xóa lọc</span>
          </Button>
        )}

        {/* Custom Column Visibility Menu */}
        <DataTableViewOptions columns={columnOptions} onToggleColumn={onToggleColumn} />
      </div>
    </div>
  )
}
