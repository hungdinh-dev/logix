'use client'

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertCircle, AlertTriangle, Info, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfirmVariant = 'default' | 'destructive' | 'warning' | 'info' | 'success'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: ConfirmVariant
  icon?: React.ReactNode
  isLoading?: boolean
  onConfirm: () => Promise<void> | void
  onCancel?: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  icon,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const getIcon = () => {
    if (icon) return icon
    switch (variant) {
      case 'destructive':
        return <Trash2 className="h-5 w-5 text-destructive shrink-0" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
      case 'info':
        return <Info className="h-5 w-5 text-primary shrink-0" />
      default:
        return <AlertCircle className="h-5 w-5 text-primary shrink-0" />
    }
  }

  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold text-xs'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs'
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs'
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs'
    }
  }

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    await onConfirm()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[460px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-base text-foreground font-semibold">
            {getIcon()}
            <span>{title}</span>
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription asChild>
              <div className="text-xs text-muted-foreground pt-2 text-left space-y-2">
                {description}
              </div>
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-3 gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            onClick={handleCancel}
            className="cursor-pointer text-xs h-8"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn('cursor-pointer h-8 transition-colors', getConfirmButtonClasses())}
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
