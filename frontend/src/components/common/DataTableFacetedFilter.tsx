'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableFacetedFilterProps {
  title: string
  icon?: React.ReactNode
  options: FilterOption[]
  selectedValues?: string[]
  onSelectChange: (values: string[]) => void
  multiple?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  align?: 'start' | 'center' | 'end'
}

export function DataTableFacetedFilter({
  title,
  icon,
  options,
  selectedValues = [],
  onSelectChange,
  multiple = true,
  searchable = false,
  searchPlaceholder = 'Tìm kiếm...',
  align = 'start',
}: DataTableFacetedFilterProps) {
  const [open, setOpen] = useState(false)
  const selectedSet = new Set(selectedValues)

  // Nhãn đang chọn khi ở chế độ Single Select (bỏ qua 'ALL' để không bị rườm rà)
  const selectedSingleOption =
    !multiple && selectedValues.length > 0
      ? options.find((opt) => opt.value === selectedValues[0] && opt.value !== 'ALL')
      : null

  const handleSelect = (val: string) => {
    if (!multiple) {
      // Single Select: Chọn 1 giá trị và tự đóng popover
      onSelectChange([val])
      setOpen(false)
      return
    }

    // Multi Select: Toggle giá trị trong Set
    const next = new Set(selectedSet)
    if (next.has(val)) {
      next.delete(val)
    } else {
      next.add(val)
    }
    onSelectChange(Array.from(next))
  }

  const handleClear = () => {
    onSelectChange([])
    if (!multiple) setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs gap-1.5 cursor-pointer font-normal border-border/80"
        >
          {icon}
          <span>{title}</span>

          {/* Single Mode: Hiển thị nhãn đang chọn (Ví dụ: "Phân loại | Bắt buộc") */}
          {!multiple && selectedSingleOption && (
            <>
              <span className="text-muted-foreground font-normal">|</span>
              <span className="font-semibold text-foreground">{selectedSingleOption.label}</span>
            </>
          )}

          {/* Multi Mode: Hiển thị Badge đếm số lượng (Ví dụ: [2]) */}
          {multiple && selectedValues.length > 0 && (
            <Badge
              variant="secondary"
              className="h-4 px-1.5 text-[10px] font-semibold bg-primary/10 text-primary border-primary/20"
            >
              {selectedValues.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align={align} className="w-56 p-0 text-xs shadow-md">
        <Command>
          <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
            {title}
          </div>

          {searchable && (
            <CommandInput placeholder={searchPlaceholder} className="h-8 text-xs" />
          )}

          <CommandList className="max-h-60 p-1">
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              Không tìm thấy kết quả
            </CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer rounded-sm"
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center text-primary transition-opacity',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>

                    {option.icon && (
                      <option.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {/* Nút xóa chọn khi có ít nhất 1 giá trị được chọn khác 'ALL' */}
            {selectedValues.length > 0 && selectedValues[0] !== 'ALL' && (
              <>
                <CommandSeparator />
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="w-full h-7 text-xs text-muted-foreground hover:text-foreground justify-center cursor-pointer"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Xóa bộ lọc
                  </Button>
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
