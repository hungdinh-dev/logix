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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Award, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type {
  CertificateTemplateItem,
  IssueCertificatePayload,
} from '../types/certificate-admin.types'

interface IssueCertificateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templates: CertificateTemplateItem[]
  onSubmit: (payload: IssueCertificatePayload) => Promise<void>
  isPending: boolean
}

export function IssueCertificateModal({
  open,
  onOpenChange,
  templates,
  onSubmit,
  isPending,
}: IssueCertificateModalProps) {
  // Fetch users list for selection
  const { data: usersData } = useQuery({
    queryKey: ['users', 'list-select'],
    queryFn: async () => {
      const res = await api.get(apiRoutes.users.base, { params: { limit: 100 } })
      return res.data.data || []
    },
    enabled: open,
  })

  // Fetch courses list for selection
  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'list-select'],
    queryFn: async () => {
      const res = await api.get(apiRoutes.courses.base, { params: { limit: 100 } })
      return res.data.data || []
    },
    enabled: open,
  })

  const [userId, setUserId] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [courseId, setCourseId] = useState('')
  const [templateId, setTemplateId] = useState('')
  const [title, setTitle] = useState('')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [expiryDate, setExpiryDate] = useState('')
  const [finalScore, setFinalScore] = useState('')
  const [isExternal, setIsExternal] = useState(false)
  const [issuingOrganization, setIssuingOrganization] = useState(
    'Công ty Cổ phần Bánh Ba Hưng'
  )

  // Auto-fill recipientName when user selected
  const handleUserChange = (uId: string) => {
    setUserId(uId)
    const selectedUser = usersData?.find((u: any) => u.id === uId)
    if (selectedUser) {
      setRecipientName(selectedUser.fullName)
    }
  }

  // Auto-fill title when course selected
  const handleCourseChange = (cId: string) => {
    setCourseId(cId)
    const selectedCourse = coursesData?.find((c: any) => c.id === cId)
    if (selectedCourse) {
      setTitle(`Chứng nhận: ${selectedCourse.title}`)
      if (selectedCourse.certificateTemplateId) {
        setTemplateId(selectedCourse.certificateTemplateId)
      }
    }
  }

  // Auto-calculate expiryDate when template or issueDate changes
  useEffect(() => {
    if (templateId && issueDate) {
      const selectedTmpl = templates.find((t) => t.id === templateId)
      if (selectedTmpl?.validityMonths) {
        const d = new Date(issueDate)
        d.setMonth(d.getMonth() + selectedTmpl.validityMonths)
        setExpiryDate(d.toISOString().split('T')[0])
      } else {
        setExpiryDate('')
      }
    }
  }, [templateId, issueDate, templates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !title || !recipientName) return

    await onSubmit({
      userId,
      courseId: courseId || null,
      templateId: templateId || null,
      title,
      recipientName,
      issueDate: issueDate ? new Date(issueDate).toISOString() : undefined,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      finalScore: finalScore ? parseFloat(finalScore) : null,
      isExternal,
      issuingOrganization,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Cấp Chứng Chỉ Đào Tạo</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Cấp phát văn bằng nội bộ hoặc ghi nhận chứng chỉ ngoại kiểm cho nhân viên.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* User Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Học Viên / Nhân Sự <span className="text-destructive">*</span>
            </Label>
            <Select value={userId} onValueChange={handleUserChange} required>
              <SelectTrigger className="h-9 text-xs rounded-lg">
                <SelectValue placeholder="Chọn nhân sự nhận chứng chỉ" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {usersData?.map((u: any) => (
                  <SelectItem key={u.id} value={u.id} className="text-xs">
                    {u.fullName} ({u.employeeCode || u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recipient Full Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Tên Hiển Thị Trên Bằng <span className="text-destructive">*</span>
            </Label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Họ và tên đầy đủ"
              className="h-9 text-xs rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Course Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Khóa Học Liên Kết</Label>
              <Select value={courseId} onValueChange={handleCourseChange}>
                <SelectTrigger className="h-9 text-xs rounded-lg">
                  <SelectValue placeholder="Chọn khóa học (nếu có)" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {coursesData?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mẫu Phôi Chuẩn</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger className="h-9 text-xs rounded-lg">
                  <SelectValue placeholder="Chọn mẫu phôi" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs">
                      {t.name} ({t.validityMonths ? `${t.validityMonths}m ATTP` : 'Vô hạn'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Tiêu Đề Chứng Chỉ <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chứng chỉ Vệ Sinh An Toàn Thực Phẩm Chuỗi Ba Hưng"
              className="h-9 text-xs rounded-lg"
              required
            />
          </div>

          {/* Dates & Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Ngày Cấp</Label>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="h-9 text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Ngày Hết Hạn (ATTP)</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="Để trống nếu vô hạn"
                className="h-9 text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Điểm Tổng Kết (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={finalScore}
                onChange={(e) => setFinalScore(e.target.value)}
                placeholder="VD: 95"
                className="h-9 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* External cert toggle */}
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="isExternal"
              checked={isExternal}
              onCheckedChange={(checked) => setIsExternal(Boolean(checked))}
            />
            <label
              htmlFor="isExternal"
              className="text-xs font-medium leading-none cursor-pointer text-foreground"
            >
              Đây là chứng chỉ ngoại kiểm (Học viên hoàn thành khóa đào tạo bên ngoài nộp về)
            </label>
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
              disabled={isPending || !userId || !title || !recipientName}
              className="gap-2 rounded-lg h-9 text-xs font-semibold cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang cấp chứng chỉ...</span>
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  <span>Xác Nhận Cấp Bằng</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
