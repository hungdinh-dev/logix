'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SlidersHorizontal } from 'lucide-react'

export interface ColumnOption {
  key: string
  label: string
  visible: boolean
}

export interface DataTableViewOptionsProps {
  columns: ColumnOption[]
  onToggleColumn: (key: string, visible: boolean) => void
  label?: string
}

export function DataTableViewOptions({
  columns,
  onToggleColumn,
  label = 'Cột hiển thị',
}: DataTableViewOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 cursor-pointer">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 text-xs">
        <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
          Bật / Tắt Cột Bảng
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((col) => (
          <DropdownMenuCheckboxItem
            key={col.key}
            checked={col.visible}
            onCheckedChange={(checked) => onToggleColumn(col.key, !!checked)}
          >
            {col.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
