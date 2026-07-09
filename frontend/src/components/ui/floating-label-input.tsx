'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { CheckCircle2 } from 'lucide-react'

export interface FloatingLabelInputProps extends Omit<
  React.ComponentProps<'input'>,
  'placeholder'
> {
  label: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  rightIconOnClick?: () => void
  showSuccessIcon?: boolean
  error?: boolean | string
  errorMessage?: string

  // --- CUSTOM CSS PROPS ---
  containerClassName?: string // Style cho div bao ngoài
  labelClassName?: string // Style riêng cho Label
  iconClassName?: string // Style chung cho Icon trái/phải
  errorClassName?: string // Style cho dòng thông báo lỗi
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  (
    {
      label,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      rightIconOnClick,
      showSuccessIcon = false,
      error = false,
      errorMessage,
      containerClassName,
      className,
      labelClassName,
      iconClassName,
      errorClassName,
      value,
      ...props
    },
    ref,
  ) => {
    const hasError = !!error
    const hasValue = !!value || (typeof value === 'number' && value !== 0)
    const showCheckIcon = showSuccessIcon && hasValue && !hasError

    return (
      <div className={cn('relative group', containerClassName)}>
        <Input
          ref={ref}
          placeholder=" "
          value={value}
          className={cn(
            // Base Styles
            'peer block w-full h-12 px-4 pt-5 pb-2 rounded-xl bg-background border outline-none transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0',
            '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden',
            // Padding logic
            LeftIcon && 'pl-11',
            (RightIcon || showCheckIcon) && 'pr-11',
            // Error Logic
            hasError
              ? 'border-destructive text-destructive focus-visible:border-destructive bg-destructive/10'
              : 'border-border text-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20',
            // Custom CSS truyền vào từ ngoài (ghi đè hết các cái trên nếu trùng)
            className,
          )}
          {...props}
        />

        {/* Left Icon */}
        {LeftIcon && (
          <div
            className={cn(
              'absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300',
              hasError ? 'text-destructive' : 'text-muted-foreground peer-focus:text-foreground',
              iconClassName, // Thêm class custom icon
            )}
          >
            <LeftIcon className="h-5 w-5" />
          </div>
        )}

        {/* Floating Label */}
        <label
          className={cn(
            // Base Label Styles
            'absolute left-11 top-1/2 text-sm transition-all duration-200 origin-left pointer-events-none',
            // Floating Logic
            'peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:scale-100',
            'peer-focus:translate-y-[-110%] peer-focus:scale-[0.8]',
            'peer-[:not(:placeholder-shown)]:translate-y-[-110%] peer-[:not(:placeholder-shown)]:scale-[0.8]',
            // Position adjustment based on icon
            !LeftIcon && 'left-4',
            // Color Logic
            hasError ? 'text-destructive' : 'text-muted-foreground peer-focus:text-foreground',
            // Custom CSS truyền vào cho Label
            labelClassName,
          )}
        >
          {label}
        </label>

        {/* Success Icon */}
        {showCheckIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-300 pointer-events-none">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
        )}

        {/* Right Icon */}
        {RightIcon && !showCheckIcon && (
          <button
            type="button"
            onClick={rightIconOnClick}
            className={cn(
              'absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors',
              iconClassName, // Thêm class custom icon
            )}
          >
            <RightIcon className="h-5 w-5" />
          </button>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p className={cn('text-destructive text-xs mt-1.5 ml-1', errorClassName)}>
            {errorMessage}
          </p>
        )}
      </div>
    )
  },
)

FloatingLabelInput.displayName = 'FloatingLabelInput'