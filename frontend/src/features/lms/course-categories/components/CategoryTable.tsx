'use client'

import React from 'react'
import { FolderTree, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/shared/skeletons'
import { CategoryTableRow } from './CategoryTableRow'
import type { BackendCategory } from '@/features/lms/types/course.types'

interface CategoryTableProps {
  categories: BackendCategory[]
  categoryCourseCountMap: Map<string, number>
  isLoading: boolean
  searchQuery: string
  onOpenCreate: () => void
  onEdit: (cat: BackendCategory) => void
  onDelete: (cat: BackendCategory) => void
}

export function CategoryTable({
  categories,
  categoryCourseCountMap,
  isLoading,
  searchQuery,
  onOpenCreate,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <Card className="overflow-hidden border-border/80">
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                <th className="py-3 px-4 w-16 text-center">Thứ tự</th>
                <th className="py-3 px-4 w-36">Mã code</th>
                <th className="py-3 px-6">Tên danh mục &amp; Mô tả</th>
                <th className="py-3 px-6 w-48 text-center">Khóa học liên kết</th>
                <th className="py-3 px-4 w-36 text-center">Trạng thái</th>
                <th className="py-3 px-4 w-28 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              <TableSkeleton rows={5} cols={6} />
            </tbody>
          </table>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <FolderTree className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold text-foreground">Không tìm thấy danh mục nào</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchQuery
              ? 'Không có danh mục nào khớp với từ khóa tìm kiếm của bạn.'
              : 'Hệ thống chưa có danh mục nào. Hãy tạo danh mục đầu tiên.'}
          </p>
          {!searchQuery && (
            <Button onClick={onOpenCreate} size="sm" className="mt-4 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>+ Thêm Danh mục</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                <th className="py-3 px-4 w-16 text-center">Thứ tự</th>
                <th className="py-3 px-4 w-36">Mã code</th>
                <th className="py-3 px-6">Tên danh mục &amp; Mô tả</th>
                <th className="py-3 px-6 w-48 text-center">Khóa học liên kết</th>
                <th className="py-3 px-4 w-36 text-center">Trạng thái</th>
                <th className="py-3 px-4 w-28 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {categories.map((cat, idx) => {
                const courseCount =
                  categoryCourseCountMap.get(cat.id) ||
                  (cat as any)._count?.courses ||
                  0

                return (
                  <CategoryTableRow
                    key={cat.id}
                    category={cat}
                    index={idx}
                    courseCount={courseCount}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
