'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { CategoryStatusFilter, CategoryStats } from '../types/course-categories.types'

interface CategoryToolbarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: CategoryStatusFilter
  onStatusFilterChange: (status: CategoryStatusFilter) => void
  stats: CategoryStats
}

export function CategoryToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stats,
}: CategoryToolbarProps) {
  const { totalCategories, activeCategoriesCount } = stats
  const inactiveCategoriesCount = totalCategories - activeCategoriesCount

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full flex items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên danh mục hoặc mã code (vd: FNB, ONB)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
            <Button
              variant={statusFilter === 'ALL' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs px-2.5 cursor-pointer"
              onClick={() => onStatusFilterChange('ALL')}
            >
              Tất cả ({totalCategories})
            </Button>
            <Button
              variant={statusFilter === 'ACTIVE' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs px-2.5 cursor-pointer"
              onClick={() => onStatusFilterChange('ACTIVE')}
            >
              Đang hoạt động ({activeCategoriesCount})
            </Button>
            <Button
              variant={statusFilter === 'INACTIVE' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs px-2.5 cursor-pointer"
              onClick={() => onStatusFilterChange('INACTIVE')}
            >
              Đã ẩn ({inactiveCategoriesCount})
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
