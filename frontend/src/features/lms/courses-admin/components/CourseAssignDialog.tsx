'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from 'sonner'
import { courseApiService } from '@/features/lms/services/course.service'
import type { BackendCourse } from '@/features/lms/types/course.types'

interface CourseAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: BackendCourse | null
  onSuccess: () => void
}

export function CourseAssignDialog({
  open,
  onOpenChange,
  course,
  onSuccess,
}: CourseAssignDialogProps) {
  const [assignType, setAssignType] = useState<'POSITION' | 'STORE' | 'DEPARTMENT' | 'EMPLOYMENT_STATUS'>('POSITION')
  const [targetId, setTargetId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAssignSubmit = async () => {
    if (!course || !targetId) return
    try {
      setIsSubmitting(true)
      let res: any
      if (assignType === 'POSITION') {
        res = await courseApiService.assignPosition(course.id, targetId)
      } else if (assignType === 'STORE') {
        res = await courseApiService.assignStore(course.id, targetId)
      } else if (assignType === 'DEPARTMENT') {
        res = await courseApiService.assignDepartment(course.id, targetId)
      } else if (assignType === 'EMPLOYMENT_STATUS') {
        res = await courseApiService.assignEmploymentStatus(course.id, targetId)
      }
      toast.success(res?.message || 'Gán khóa học thành công!')
      onOpenChange(false)
      setTargetId('')
      onSuccess()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi gán khóa học')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">Gán Khóa Học Tự Động (Auto-Assign Rule)</DialogTitle>
          <DialogDescription className="text-xs">
            Tự động ghi danh toàn bộ nhân viên theo Chức danh, Cửa hàng hoặc Khâu sản xuất.
          </DialogDescription>
        </DialogHeader>

        {course && (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/30 rounded-lg border border-border text-sm">
              <span className="text-muted-foreground text-xs">Khóa học: </span>
              <span className="font-semibold text-foreground text-xs">{course.title}</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tiêu chí gán tự động</Label>
              <Select value={assignType} onValueChange={(val: any) => setAssignType(val)}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POSITION">Theo Chức danh công việc (LMS-005)</SelectItem>
                  <SelectItem value="EMPLOYMENT_STATUS">Theo Loại nhân sự Học việc / Chính thức (LMS-006)</SelectItem>
                  <SelectItem value="STORE">Theo Cửa hàng / Chi nhánh (LMS-007)</SelectItem>
                  <SelectItem value="DEPARTMENT">Theo Bộ phận / Khâu xưởng sản xuất (LMS-008)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {assignType === 'EMPLOYMENT_STATUS' ? (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Chọn loại nhân sự</Label>
                <Select value={targetId} onValueChange={setTargetId}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROBATION">Nhân viên Học việc (Probation)</SelectItem>
                    <SelectItem value="OFFICIAL">Nhân viên Chính thức (Official)</SelectItem>
                    <SelectItem value="TEMPORARY">Đội ngũ Tăng cường (Temporary)</SelectItem>
                    <SelectItem value="ALL">Toàn bộ nhân sự (All)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Mã định danh ID mục tiêu</Label>
                <Input
                  placeholder="Nhập ID vị trí / cửa hàng / bộ phận..."
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Hệ thống sẽ quét toàn bộ nhân sự khớp với ID này và kích hoạt ghi danh ngay lập tức.
                </p>
              </div>
            )}

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleAssignSubmit}
                disabled={isSubmitting || !targetId}
                className="text-xs font-semibold bg-primary text-primary-foreground cursor-pointer"
              >
                {isSubmitting ? 'Đang gán...' : 'Xác Nhận Gán Khóa'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
