'use client'

import React from 'react'
import {
  ShieldCheck,
  Users,
  BookOpen,
  Compass,
  Lock,
  BookOpenCheck,
  Infinity as InfinityIcon,
  Award,
  LockKeyhole,
  Loader2,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CourseTargetingCard,
  TargetingValues,
} from '@/features/lms/course-targeting/components/CourseTargetingCard'
import { CreateCoursePayload } from '../types/course-create.types'

interface CourseTrainingAttributesCardProps {
  formData: CreateCoursePayload
  setFormData: React.Dispatch<React.SetStateAction<CreateCoursePayload>>
  hasDurationLimit: boolean
  setHasDurationLimit: (val: boolean) => void
  certificateTemplates: any[]
  isLoadingCertificates?: boolean
  targeting: TargetingValues
  setTargeting: (val: TargetingValues) => void
}

export function CourseTrainingAttributesCard({
  formData,
  setFormData,
  hasDurationLimit,
  setHasDurationLimit,
  certificateTemplates,
  isLoadingCertificates,
  targeting,
  setTargeting,
}: CourseTrainingAttributesCardProps) {
  return (
    <div className="space-y-6">
      {/* Card 1: Thuộc tính đào tạo */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Thuộc tính đào tạo</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Phân loại tính chất và cơ chế học
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          {/* Course Type (Loại khóa học - 3 cards) */}
          <div className="space-y-2">
            <Label className="font-semibold text-xs">Course Type (Loại khóa học)</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'ONBOARDING', title: 'Onboarding', sub: 'Hội nhập', icon: Users },
                { type: 'ATTP', title: 'ATTP / HSE', sub: 'An toàn', icon: ShieldCheck },
                { type: 'STANDARD', title: 'Tiêu chuẩn', sub: 'Tự chọn', icon: BookOpen },
              ].map((item) => {
                const IconComp = item.icon
                const isSelected = formData.courseType === item.type
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        courseType: item.type as 'STANDARD' | 'ATTP' | 'ONBOARDING',
                      })
                    }
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 font-bold shadow-sm'
                        : 'hover:bg-muted/50 text-muted-foreground border-border'
                    }`}
                  >
                    <IconComp className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-semibold block leading-tight">{item.title}</span>
                    <span className="text-[10px] opacity-75 block">{item.sub}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Khóa học bắt buộc (Mandatory) */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
            <div className="space-y-0.5">
              <Label htmlFor="mandatory-switch" className="font-semibold text-xs cursor-pointer block">
                Khóa học bắt buộc (Mandatory) <span className="text-destructive">•</span>
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Bắt buộc đối với đối tượng được chỉ định, ảnh hưởng KPI hoàn thành.
              </p>
            </div>
            <Switch
              id="mandatory-switch"
              checked={formData.isMandatory || false}
              onCheckedChange={(val) => setFormData({ ...formData, isMandatory: val })}
            />
          </div>

          {/* Progression Mode (Tiến trình học - 3 cards) */}
          <div className="space-y-2">
            <Label className="font-semibold text-xs">Progression Mode (Tiến trình học)</Label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  mode: 'FREE',
                  title: 'Học tự do',
                  sub: 'Xem bất kỳ bài nào không giới hạn thứ tự.',
                  icon: Compass,
                  isDefault: true,
                },
                {
                  mode: 'LINEAR_LESSON',
                  title: 'Học tuần tự theo bài',
                  sub: 'Xong bài trước và đạt quiz mới mở bài sau (Khuyên dùng).',
                  icon: Lock,
                  isDefault: false,
                },
                {
                  mode: 'LINEAR_MODULE',
                  title: 'Học tuần tự theo chương',
                  sub: 'Hoàn thành hết bài trong Chương 1 mới mở Chương 2.',
                  icon: BookOpenCheck,
                  isDefault: false,
                },
              ].map((item) => {
                const IconComp = item.icon
                const isSelected = formData.progressionMode === item.mode
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setFormData({ ...formData, progressionMode: item.mode as any })}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 font-bold shadow-sm'
                        : 'hover:bg-muted/50 text-muted-foreground border-border'
                    }`}
                  >
                    <IconComp
                      className={`h-4 w-4 mt-0.5 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold block leading-tight">{item.title}</span>
                      <span className="text-[10px] opacity-75 block">{item.sub}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Thời hạn hoàn thành (durationDays) có switch Vô thời hạn */}
          <div className="space-y-2 p-3 rounded-xl border bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="duration-switch" className="font-semibold text-xs cursor-pointer block">
                  Thời hạn hoàn thành (durationDays)
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  {hasDurationLimit
                    ? 'Quy định hạn chót hoàn thành khóa học.'
                    : 'Khóa học vô thời hạn, học viên học bất kỳ lúc nào.'}
                </p>
              </div>
              <Switch
                id="duration-switch"
                checked={hasDurationLimit}
                onCheckedChange={setHasDurationLimit}
              />
            </div>

            {hasDurationLimit ? (
              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="flex rounded-md border border-input overflow-hidden w-32 bg-background">
                  <input
                    id="duration-days"
                    type="number"
                    min={1}
                    max={365}
                    value={formData.durationDays || 14}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationDays: parseInt(e.target.value) || 14,
                      })
                    }
                    className="w-full bg-transparent px-3 py-1.5 text-xs font-bold text-center focus:outline-none"
                  />
                  <span className="inline-flex items-center px-2.5 bg-muted text-muted-foreground text-xs border-l select-none">
                    ngày
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Kể từ ngày học viên được cấp quyền truy cập.
                </span>
              </div>
            ) : (
              <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-primary font-medium">
                <InfinityIcon className="h-4 w-4" />
                <span>Vô thời hạn (Không giới hạn số ngày học)</span>
              </div>
            )}
          </div>

          {/* Cấp Chứng Chỉ & Mẫu Phôi (Certificate Configuration) */}
          <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cert-switch" className="font-semibold text-xs cursor-pointer block flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Cấp Chứng Chỉ Khi Hoàn Thành</span>
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Tự động trao văn bằng chứng nhận (kèm mã QR &amp; hạn ATTP) khi học viên đạt 100% khóa học.
                </p>
              </div>
              <Switch
                id="cert-switch"
                checked={formData.hasCertificate || false}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, hasCertificate: checked })
                }
              />
            </div>

            {formData.hasCertificate && (
              <div className="pt-2.5 border-t border-border/50 space-y-2">
                <Label className="text-xs font-semibold">Chọn Mẫu Phôi Chứng Chỉ Áp Dụng</Label>
                <Select
                  value={formData.certificateTemplateId || ''}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      certificateTemplateId: val || null,
                    })
                  }
                  disabled={isLoadingCertificates}
                >
                  <SelectTrigger className="h-9 text-xs bg-background">
                    {isLoadingCertificates ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Đang tải danh sách phôi chứng chỉ...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="-- Chọn mẫu phôi (VD: ATTP 12 tháng, Nghiệp vụ...) --" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {certificateTemplates.map((t: any) => (
                      <SelectItem key={t.id} value={t.id} className="text-xs">
                        {t.name} ({t.validityMonths ? `${t.validityMonths} Tháng (ATTP)` : 'Vô thời hạn'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Học viên hoàn thành khóa sẽ tự động được cấp bằng theo mẫu phôi và thời hạn đã chọn.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Quyền riêng tư & Lưu hành */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-primary" />
            <span>Quyền riêng tư & Lưu hành</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Phạm vi công bố và kinh doanh
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          {/* Khóa học nội bộ */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
            <div className="space-y-0.5">
              <Label htmlFor="internal-switch" className="font-semibold text-xs cursor-pointer block">
                Khóa học nội bộ (isInternal)
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Chỉ nhân viên nội bộ đăng nhập SSO mới có quyền xem.
              </p>
            </div>
            <Switch
              id="internal-switch"
              checked={formData.isInternal !== false}
              onCheckedChange={(val) => setFormData({ ...formData, isInternal: val })}
            />
          </div>

          {/* Khóa học thương mại */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
            <div className="space-y-0.5">
              <Label htmlFor="commercial-switch" className="font-semibold text-xs cursor-pointer block">
                Khóa học thương mại (isCommercial)
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Mở bán cho đối tác & học viên ngoài chuỗi (Horeca B2B/B2C).
              </p>
            </div>
            <Switch
              id="commercial-switch"
              checked={formData.isCommercial === true}
              onCheckedChange={(val) => setFormData({ ...formData, isCommercial: val })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Targeting Card */}
      <CourseTargetingCard
        values={targeting}
        onChange={setTargeting}
        isOptional={true}
        defaultEnabled={false}
      />
    </div>
  )
}
