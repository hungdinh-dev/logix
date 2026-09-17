'use client'

import React from 'react'
import Link from 'next/link'
import { GripVertical, BookOpen, ExternalLink, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { BackendCategory } from '@/features/lms/types/course.types'

interface CategoryTableRowProps {
  category: BackendCategory
  index: number
  courseCount: number
  onEdit: (cat: BackendCategory) => void
  onDelete: (cat: BackendCategory) => void
}

export function CategoryTableRow({
  category,
  index,
  courseCount,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  const isActive = (category as any).isActive !== false

  return (
    <tr className="hover:bg-muted/40 transition-colors">
      {/* Sort Order */}
      <td className="py-3.5 px-4 text-center">
        <div className="flex items-center justify-center gap-1 text-muted-foreground">
          <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
          <span className="font-semibold text-xs">{category.sortOrder || index + 1}</span>
        </div>
      </td>

      {/* Code */}
      <td className="py-3.5 px-4">
        <Badge variant="outline" className="font-mono text-xs font-semibold">
          {category.code}
        </Badge>
      </td>

      {/* Name & Description */}
      <td className="py-3.5 px-6">
        <div>
          <div className="font-semibold text-foreground flex items-center gap-2">
            <span>{category.name}</span>
          </div>
          {category.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {category.description}
            </p>
          )}
        </div>
      </td>

      {/* Course Count */}
      <td className="py-3.5 px-6 text-center">
        <Link href={`/lms/admin/courses?categoryId=${category.id}`}>
          <Badge
            variant="secondary"
            className="font-medium gap-1 text-xs cursor-pointer hover:bg-secondary/80"
          >
            <BookOpen className="h-3 w-3" />
            <span>{courseCount} khóa học</span>
            <ExternalLink className="h-2.5 w-2.5 ml-0.5 opacity-60" />
          </Badge>
        </Link>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 text-center">
        <Badge
          variant={isActive ? 'default' : 'outline'}
          className={
            isActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px]'
              : 'text-muted-foreground text-[11px]'
          }
        >
          {isActive ? 'Đang hoạt động' : 'Đã ẩn'}
        </Badge>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            title="Chỉnh sửa danh mục"
            onClick={() => onEdit(category)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
            title="Xóa danh mục"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
