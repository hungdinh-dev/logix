'use client'

import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertTriangle } from 'lucide-react'
import type { UserCertificateItem } from '../types/certificate-admin.types'

interface RevokeConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificate?: UserCertificateItem | null
  onConfirm: (id: string, reason: string) => Promise<void>
  isPending: boolean
}

export function RevokeConfirmDialog({
  open,
  onOpenChange,
  certificate,
  onConfirm,
  isPending,
}: RevokeConfirmDialogProps) {
  const [reason, setReason] = useState('')

  if (!certificate) return null

  const handleRevoke = async () => {
    if (!reason.trim()) return
    await onConfirm(certificate.id, reason)
    setReason('')
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle className="text-base font-bold text-foreground">
              Xác Nhận Thu Hồi Chứng Chỉ?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            Bạn có chắc chắn muốn thu hồi chứng chỉ{' '}
            <strong className="text-foreground">{certificate.certificateCode}</strong> của học viên{' '}
            <strong className="text-foreground">{certificate.recipientName || certificate.user?.fullName}</strong>?
            Học viên sẽ không thể sử dụng chứng chỉ này để xếp ca hoặc chứng minh tuân thủ ATTP.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5 py-2">
          <Label className="text-xs font-semibold">
            Lý do thu hồi <span className="text-destructive">*</span>
          </Label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="VD: Vi phạm quy chế thi, phát hiện gian lận..."
            className="h-9 text-xs rounded-lg"
            required
          />
        </div>

        <AlertDialogFooter className="gap-2 pt-2">
          <AlertDialogCancel disabled={isPending} className="h-9 text-xs rounded-lg">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || !reason.trim()}
            onClick={handleRevoke}
            className="h-9 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang thu hồi...</span>
              </>
            ) : (
              <span>Xác Nhận Thu Hồi</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
