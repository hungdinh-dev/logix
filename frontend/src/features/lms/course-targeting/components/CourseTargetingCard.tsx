'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  Building2,
  Store as StoreIcon,
  Briefcase,
  FileCheck2,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  Info,
  Check,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDepartments } from '@/features/admin/hooks/use-departments'

export interface TargetingValues {
  targetPositionId?: string | null
  targetDepartmentId?: string | null
  targetStoreId?: string | null
  targetEmploymentStatus?: 'ALL' | 'PROBATION' | 'OFFICIAL' | 'TEMPORARY' | null
}

interface CourseTargetingCardProps {
  values: TargetingValues
  onChange: (values: TargetingValues) => void
  isOptional?: boolean // Cho phép bật/tắt để trống
  defaultEnabled?: boolean
  className?: string
}

// Danh mục chức danh mẫu đồng bộ theo chuẩn HR F&B Core
export const MOCK_POSITIONS = [
  { id: 'pos-cashier', code: 'CASHIER', name: 'Thu ngân (Cashier)' },
  { id: 'pos-barista', code: 'BARISTA', name: 'Pha chế (Barista)' },
  { id: 'pos-shift-leader', code: 'SHIFT_LEADER', name: 'Quản lý ca (Shift Leader)' },
  { id: 'pos-kitchen', code: 'KITCHEN', name: 'Bếp trưởng & Phụ bếp' },
  { id: 'pos-store-mgr', code: 'STORE_MGR', name: 'Cửa hàng trưởng (Store Manager)' },
  { id: 'pos-ice-cream', code: 'ICE_CREAM_TECH', name: 'Kỹ thuật viên Làm Kem' },
  { id: 'pos-service', code: 'SERVICE', name: 'Nhân viên Phục vụ' },
]

// Danh mục chi nhánh / xưởng
export const MOCK_STORES = [
  { id: 'all', code: 'ALL', name: 'Tất cả chi nhánh cửa hàng (Toàn quốc)' },
  { id: 'store-q1', code: 'STORE-Q1', name: 'Chi nhánh Ba Hưng - Quận 1 (TP.HCM)' },
  { id: 'store-bt', code: 'STORE-BT', name: 'Chi nhánh Ba Hưng - Bình Thạnh (TP.HCM)' },
  { id: 'store-td', code: 'STORE-TD', name: 'Chi nhánh Ba Hưng - Thủ Đức (TP.HCM)' },
  { id: 'store-factory', code: 'FACTORY-BD', name: 'Xưởng Trung Tâm Ba Hưng - Bình Dương' },
]

export function CourseTargetingCard({
  values,
  onChange,
  isOptional = true,
  defaultEnabled = true,
  className = '',
}: CourseTargetingCardProps) {
  const [isEnabled, setIsEnabled] = useState(
    Boolean(
      values.targetPositionId ||
      values.targetDepartmentId ||
      values.targetStoreId ||
      (values.targetEmploymentStatus && values.targetEmploymentStatus !== 'ALL') ||
      defaultEnabled
    )
  )

  const { data: deptData } = useDepartments()
  const departments = deptData?.items || []

  // Tính toán số lượng nhân sự ước tính dựa trên bộ lọc
  const estimatedCount = useMemo(() => {
    if (!isEnabled) return 0
    let base = 1248 // Tổng nhân sự toàn chuỗi

    if (values.targetEmploymentStatus === 'PROBATION') base = Math.round(base * 0.15)
    else if (values.targetEmploymentStatus === 'OFFICIAL') base = Math.round(base * 0.75)
    else if (values.targetEmploymentStatus === 'TEMPORARY') base = Math.round(base * 0.1)

    if (values.targetDepartmentId) base = Math.round(base * 0.35)
    if (values.targetStoreId && values.targetStoreId !== 'all') base = Math.round(base * 0.08)
    if (values.targetPositionId) base = Math.round(base * 0.2)

    return Math.max(base, 12)
  }, [isEnabled, values])

  const handleToggleEnable = (enabled: boolean) => {
    setIsEnabled(enabled)
    if (!enabled) {
      onChange({
        targetPositionId: null,
        targetDepartmentId: null,
        targetStoreId: null,
        targetEmploymentStatus: 'ALL',
      })
    }
  }

  return (
    <Card className={`border-border shadow-sm ${className}`}>
      <CardHeader className="pb-3 border-b flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Phân bổ đối tượng nhân sự tự động</span>
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
              Auto-Enroll
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Khóa học sẽ tự động được gán vào tài khoản học viên khi hồ sơ nhân sự thỏa mãn điều kiện.
          </CardDescription>
        </div>

        {isOptional && (
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <Label htmlFor="toggle-targeting" className="text-xs text-muted-foreground cursor-pointer font-medium">
              {isEnabled ? 'Đang bật phân bổ' : 'Để trống (Cấu hình sau)'}
            </Label>
            <Switch
              id="toggle-targeting"
              checked={isEnabled}
              onCheckedChange={handleToggleEnable}
            />
          </div>
        )}
      </CardHeader>

      {isEnabled ? (
        <CardContent className="space-y-4 pt-5">
          {/* 1. Chức danh nhân sự áp dụng (targetPosition) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-xs flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span>Chức danh nhân sự áp dụng (targetPosition)</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                Đồng bộ theo danh mục vị trí việc làm HR Core
              </span>
            </div>

            {/* Selected positions tags */}
            <div className="flex flex-wrap gap-1.5 items-center p-2.5 rounded-xl border bg-muted/20 min-h-[46px]">
              {MOCK_POSITIONS.map((pos) => {
                const isSelected = values.targetPositionId === pos.id
                return (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...values,
                        targetPositionId: isSelected ? null : pos.id,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'bg-background hover:bg-muted text-foreground border border-border/80'
                    }`}
                  >
                    <span>{pos.name}</span>
                    {isSelected ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3 opacity-50" />
                    )}
                  </button>
                )
              })}

              {values.targetPositionId && (
                <button
                  type="button"
                  onClick={() => onChange({ ...values, targetPositionId: null })}
                  className="text-[11px] text-destructive hover:underline ml-auto flex items-center gap-1 px-1.5 py-0.5"
                >
                  <X className="h-3 w-3" />
                  <span>Bỏ chọn</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Phòng ban & Chi nhánh (2 cột full width) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phòng ban / Khối */}
            <div className="space-y-1.5">
              <Label className="font-semibold text-xs flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Phòng ban / Khối vận hành (targetDepartment)</span>
              </Label>
              <Select
                value={values.targetDepartmentId || 'all'}
                onValueChange={(val) =>
                  onChange({
                    ...values,
                    targetDepartmentId: val === 'all' ? null : val,
                  })
                }
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Tất cả phòng ban & khối" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    Tất cả phòng ban (Toàn công ty)
                  </SelectItem>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id} className="text-xs">
                      {dept.departmentName || dept.name} ({dept.departmentCode || dept.code})
                    </SelectItem>
                  ))}
                  {departments.length === 0 && (
                    <>
                      <SelectItem value="dept-ops" className="text-xs">
                        Khối Cửa Hàng & Vận Hành Chuỗi (Operations)
                      </SelectItem>
                      <SelectItem value="dept-fac" className="text-xs">
                        Khối Xưởng Sản Xuất Ba Hưng (Factory)
                      </SelectItem>
                      <SelectItem value="dept-mkt" className="text-xs">
                        Khối Marketing & Kinh Doanh
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Chi nhánh / Cửa hàng */}
            <div className="space-y-1.5">
              <Label className="font-semibold text-xs flex items-center gap-1.5">
                <StoreIcon className="h-3.5 w-3.5 text-primary" />
                <span>Khối Cửa hàng / Khu vực (targetStore)</span>
              </Label>
              <Select
                value={values.targetStoreId || 'all'}
                onValueChange={(val) =>
                  onChange({
                    ...values,
                    targetStoreId: val === 'all' ? null : val,
                  })
                }
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Tất cả chi nhánh cửa hàng" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STORES.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-xs">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. Tình trạng hợp đồng nhân sự (targetEmploymentStatus) */}
          <div className="space-y-1.5">
            <Label className="font-semibold text-xs flex items-center gap-1.5">
              <FileCheck2 className="h-3.5 w-3.5 text-primary" />
              <span>Tình trạng hợp đồng nhân sự (targetEmploymentStatus)</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { status: 'ALL', label: 'Tất cả trạng thái' },
                { status: 'PROBATION', label: 'Đang thử việc' },
                { status: 'OFFICIAL', label: 'Nhân viên chính thức' },
              ].map((item) => {
                const isSelected =
                  (values.targetEmploymentStatus || 'ALL') === item.status
                return (
                  <button
                    key={item.status}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...values,
                        targetEmploymentStatus: item.status as TargetingValues["targetEmploymentStatus"],
                      })
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm'
                        : 'hover:bg-muted/40 text-muted-foreground border-border'
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {isSelected && (
                        <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Box Ước tính đối tượng áp dụng */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3 text-xs">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground leading-relaxed">
                Ước tính đối tượng áp dụng:{' '}
                <strong className="text-primary font-bold">
                  {estimatedCount.toLocaleString('vi-VN')} nhân sự
                </strong>{' '}
                đang hoạt động thỏa mãn tiêu chí bộ lọc trên.
              </p>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="py-6 text-center text-xs text-muted-foreground space-y-2">
          <Info className="h-5 w-5 mx-auto opacity-50 text-muted-foreground" />
          <p>
            Bạn đang chọn <strong>để trống phân bổ</strong>. Khóa học sẽ được tạo trước và bạn có thể phân chia nhân sự tự động bất cứ lúc nào tại trang quản trị khóa học.
          </p>
        </CardContent>
      )}
    </Card>
  )
}
