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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Layers } from 'lucide-react'
import type {
  CertificateTemplateItem,
  CertificateTemplatePayload,
} from '../types/certificate-admin.types'

interface CertificateTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateToEdit?: CertificateTemplateItem | null
  onSubmit: (payload: CertificateTemplatePayload) => Promise<void>
  isPending: boolean
}

export function CertificateTemplateModal({
  open,
  onOpenChange,
  templateToEdit,
  onSubmit,
  isPending,
}: CertificateTemplateModalProps) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [validityType, setValidityType] = useState<'lifetime' | '12' | '24' | '36' | 'custom'>('12')
  const [customMonths, setCustomMonths] = useState('12')
  const [issuingOrganization, setIssuingOrganization] = useState(
    'Trung tâm Đào tạo & Khảo thí Ba Hưng'
  )
  const [signatoryName, setSignatoryName] = useState('Ban Giám Đốc')
  const [signatoryTitle, setSignatoryTitle] = useState(
    'Giám đốc Đào tạo & Quản lý Chất lượng'
  )

  useEffect(() => {
    if (templateToEdit) {
      setName(templateToEdit.name)
      setCode(templateToEdit.code)
      setDescription(templateToEdit.description || '')
      setIssuingOrganization(templateToEdit.issuingOrganization)
      setSignatoryName(templateToEdit.signatoryName)
      setSignatoryTitle(templateToEdit.signatoryTitle)

      if (!templateToEdit.validityMonths) {
        setValidityType('lifetime')
      } else if ([12, 24, 36].includes(templateToEdit.validityMonths)) {
        setValidityType(String(templateToEdit.validityMonths) as any)
      } else {
        setValidityType('custom')
        setCustomMonths(String(templateToEdit.validityMonths))
      }
    } else {
      setName('')
      setCode('')
      setDescription('')
      setValidityType('12')
      setCustomMonths('12')
      setIssuingOrganization('Trung tâm Đào tạo & Khảo thí Ba Hưng')
      setSignatoryName('Ban Giám Đốc')
      setSignatoryTitle('Giám đốc Đào tạo & Quản lý Chất lượng')
    }
  }, [templateToEdit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !code) return

    let validityMonths: number | null = null
    if (validityType === 'lifetime') {
      validityMonths = null
    } else if (validityType === 'custom') {
      validityMonths = parseInt(customMonths, 10) || null
    } else {
      validityMonths = parseInt(validityType, 10)
    }

    await onSubmit({
      name,
      code: code.toUpperCase(),
      description,
      validityMonths,
      issuingOrganization,
      signatoryName,
      signatoryTitle,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {templateToEdit ? 'Chỉnh Sửa Mẫu Phôi Chứng Chỉ' : 'Tạo Mẫu Phôi Chứng Chỉ Mới'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Định nghĩa khung phôi văn bằng chuẩn tái sử dụng cho các khóa học F&B.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          {/* Name & Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold">
                Tên Mẫu Phôi <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Chứng chỉ An Toàn Vệ Sinh Thực Phẩm 12 Tháng"
                className="h-9 text-xs rounded-lg"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Mã Phôi <span className="text-destructive">*</span>
              </Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="VD: ATTP-12M"
                className="h-9 text-xs font-mono rounded-lg uppercase"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Mô Tả Tiêu Chuẩn</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú quy chuẩn, đối tượng áp dụng..."
              className="text-xs rounded-lg resize-none h-16"
            />
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Thời Hạn Hiệu Lực</Label>
              <Select
                value={validityType}
                onValueChange={(val: any) => setValidityType(val)}
              >
                <SelectTrigger className="h-9 text-xs rounded-lg">
                  <SelectValue placeholder="Chọn thời hạn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 Tháng (1 Năm - Chuẩn ATTP)</SelectItem>
                  <SelectItem value="24">24 Tháng (2 Năm)</SelectItem>
                  <SelectItem value="36">36 Tháng (3 Năm)</SelectItem>
                  <SelectItem value="lifetime">Vô thời hạn (Vĩnh viễn)</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh số tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {validityType === 'custom' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Số Tháng Hiệu Lực</Label>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={customMonths}
                  onChange={(e) => setCustomMonths(e.target.value)}
                  placeholder="VD: 6"
                  className="h-9 text-xs rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Organization & Signatory */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Đơn Vị Cấp Chứng Nhận</Label>
            <Input
              value={issuingOrganization}
              onChange={(e) => setIssuingOrganization(e.target.value)}
              placeholder="Trung tâm Đào tạo & Khảo thí Ba Hưng"
              className="h-9 text-xs rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Người Ký Thẩm Quyền</Label>
              <Input
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="Ban Giám Đốc"
                className="h-9 text-xs rounded-lg"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Chức Danh Người Ký</Label>
              <Input
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                placeholder="Giám đốc Đào tạo & QA"
                className="h-9 text-xs rounded-lg"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3 border-t border-border/60">
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
              disabled={isPending || !name || !code}
              className="gap-2 rounded-lg h-9 text-xs font-semibold cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4" />
                  <span>{templateToEdit ? 'Lưu Thay Đổi' : 'Tạo Mẫu Phôi'}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
