'use client'

import React, { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatusBadgeOption<T = string> {
  value: T
  label: ReactNode
  description?: ReactNode
  icon?: ReactNode
  dotColor?: string
  badgeClassName?: string
  itemClassName?: string
  disabled?: boolean
  badgeLabel?: ReactNode
}

export interface StatusBadgeDropdownProps<T = string> {
  value: T
  options: StatusBadgeOption<T>[]
  onChange?: (value: T) => void
  menuLabel?: ReactNode
  placeholder?: string
  align?: 'start' | 'center' | 'end'
  contentWidth?: string
  size?: 'xs' | 'sm' | 'default'
  variant?: 'pill' | 'badge' | 'outline' | 'ghost'
  showDot?: boolean
  showTriggerIcon?: boolean
  showChevron?: boolean
  disabled?: boolean
  title?: string
  className?: string
  renderTrigger?: (currentOption: StatusBadgeOption<T> | undefined) => ReactNode
}

export function StatusBadgeDropdown<T = string>({
  value,
  options,
  onChange,
  menuLabel,
  placeholder = 'Chọn trạng thái',
  align = 'center',
  contentWidth = 'w-48',
  size = 'sm',
  variant = 'pill',
  showDot,
  showTriggerIcon = true,
  showChevron = true,
  disabled = false,
  title,
  className,
  renderTrigger,
}: StatusBadgeDropdownProps<T>) {
  const currentOption = options.find((opt) => opt.value === value)

  const hasDot = showDot ?? Boolean(currentOption?.dotColor)
  const hasTriggerIcon = !hasDot && showTriggerIcon && Boolean(currentOption?.icon)

  const sizeClasses = {
    xs: 'h-6 px-2 text-[10px] gap-1',
    sm: 'h-7 px-2.5 text-xs gap-1.5',
    default: 'h-8 px-3 text-sm gap-2',
  }[size]

  const variantClasses = {
    pill: 'rounded-full border font-semibold shadow-2xs',
    badge: 'rounded-md border font-medium shadow-2xs',
    outline: 'rounded-md border font-normal',
    ghost: 'rounded-md font-normal hover:bg-muted',
  }[variant]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {renderTrigger ? (
          renderTrigger(currentOption)
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            className={cn(
              'transition-all cursor-pointer select-none inline-flex items-center justify-center',
              sizeClasses,
              variantClasses,
              currentOption?.badgeClassName,
              className
            )}
            title={title}
          >
            {hasDot && currentOption?.dotColor && (
              <span
                className={cn('h-1.5 w-1.5 rounded-full shrink-0', currentOption.dotColor)}
              />
            )}
            {hasTriggerIcon && currentOption?.icon && (
              <span className="shrink-0 flex items-center justify-center">
                {currentOption.icon}
              </span>
            )}
            <span className="truncate">
              {currentOption?.badgeLabel ?? currentOption?.label ?? placeholder}
            </span>
            {showChevron && (
              <ChevronDown
                className={cn(
                  'opacity-60 shrink-0 transition-transform duration-200',
                  size === 'xs' ? 'h-2.5 w-2.5 ml-0.5' : 'h-3 w-3 ml-0.5'
                )}
              />
            )}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className={cn('text-xs z-50', contentWidth)}>
        {menuLabel && (
          <>
            <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider px-2 py-1">
              {menuLabel}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {options.map((opt) => {
          const isSelected = opt.value === value
          const isItemDisabled = opt.disabled || isSelected

          return (
            <DropdownMenuItem
              key={String(opt.value)}
              disabled={isItemDisabled}
              onClick={() => {
                if (!isSelected && onChange) {
                  onChange(opt.value)
                }
              }}
              className={cn(
                'gap-2.5 cursor-pointer py-1.5 px-2 transition-colors',
                opt.itemClassName,
                isSelected && 'font-medium bg-muted/40 cursor-default opacity-80'
              )}
            >
              {opt.icon ? (
                <span className="shrink-0 flex items-center justify-center">
                  {opt.icon}
                </span>
              ) : opt.dotColor ? (
                <span className={cn('h-2 w-2 rounded-full shrink-0', opt.dotColor)} />
              ) : null}

              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-xs leading-tight truncate">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {opt.description}
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
