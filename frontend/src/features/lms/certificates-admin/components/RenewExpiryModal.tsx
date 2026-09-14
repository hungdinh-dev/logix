'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, RotateCcw, Calendar } from 'lucide-react'
import type { UserCertificateItem } from '../types/certificate-admin.types'

interface RenewExpiryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificate?: UserCertificateItem | null
  onSubmit: (id: string, newExpiryDate: string, notes?: string) => Promise<void>
  isPending: boolean
}

export function RenewExpiryModal({
  open,
  onOpenChange,
  certificate,
  onSubmit,
  isPending,
}: RenewExpiryModalProps) {
  const [newExpiryDate, setNewExpiryDate] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (certificate && open) {
      // Default new expiry date to 1 year from now
      const d = new Date()
      d.setFullYear(d.getFullYear() + 1)
      setNewExpiryDate(d.toISOString().split('T')[0])
      setNotes('')
    }
  }, [certificate, open])

  if (!certificate) return null

  const handleQuickAdd = (months: number) => {
    const base = certificate.expiryDate ? new Date(certificate.expiryDate) : new Date()
    const d = new Date(Math.max(base.getTime(), Date.now()))
    d.setMonth(d.getMonth() + months)
    setNewExpiryDate(d.toISOString().split('T')[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpiryDate) return
    await onSubmit(certificate.id, new Date(newExpiryDate).toISOString(), notes)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Gia Hạn Hiệu Lực Chứng Chỉ</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Cập nhật ngày hết hạn mới cho chứng chỉ <strong>{certificate.certificateCode}</strong>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-xs text-muted-foreground border border-border/60">
            <div>
              Học viên: <strong className="text-foreground">{certificate.recipientName || certificate.user?.fullName}</strong>
            </div>
            <div>
              Khóa học: <span className="text-foreground">{certificate.title}</span>
            </div>
            <div>
              Hạn hiện tại:{' '}
              <strong className="text-foreground">
                {certificate.expiryDate
                  ? new Date(certificate.expiryDate).toLocaleDateString('vi-VN')
                  : 'Vô thời hạn'}
              </strong>
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Gia Hạn Nhanh</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(6)}
                className="h-8 text-xs rounded-lg flex-1"
              >
                +6 Tháng
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(12)}
                className="h-8 text-xs rounded-lg flex-1"
              >
                +1 Năm (ATTP)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(24)}
                className="h-8 text-xs rounded-lg flex-1"
              >
                +2 Năm
              </Button>
            </div>
          </div>

          {/* New Expiry Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Ngày Hết Hạn Mới <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={newExpiryDate}
              onChange={(e) => setNewExpiryDate(e.target.value)}
              className="h-9 text-xs rounded-lg"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Ghi Chú Gia Hạn</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Đã hoàn thành khóa tái đào tạo định kỳ..."
              className="h-9 text-xs rounded-lg"
            />
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="rounded-lg h-9 text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !newExpiryDate}
              className="gap-2 rounded-lg h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <span>Xác Nhận Gia Hạn</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
