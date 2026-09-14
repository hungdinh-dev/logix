import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { createEmployeeSchema, type CreateEmployeeFormValues } from '../../schemas/admin.schemas'
import { useCreateEmployee } from '../../hooks/use-employees'
import { useJobLevels } from '../../hooks/use-job-levels'
import { useAllUsers } from '../../hooks/use-roles'
import { CONTRACT_TYPE_LABELS, GENDER_LABELS, type ContractType, type Gender } from '../../types/admin.types'
import { DynamicFormSection } from './DynamicFormSection'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GENDERS = Object.entries(GENDER_LABELS) as [Gender, string][]
const CONTRACT_TYPES = Object.entries(CONTRACT_TYPE_LABELS) as [ContractType, string][]

export function CreateEmployeeSheet({ open, onOpenChange }: Props) {
  const create = useCreateEmployee()
  const { data: jobLevelsData } = useJobLevels({ Top: 100, NeedTotalCount: false })
  const { data: users } = useAllUsers()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { dateOfJoin: new Date().toISOString().slice(0, 10) },
  })

  useEffect(() => {
    if (open) reset({ dateOfJoin: new Date().toISOString().slice(0, 10) })
  }, [open, reset])

  const onSubmit = async (values: CreateEmployeeFormValues) => {
    const payload = {
      ...values,
      employeeCode: values.employeeCode || undefined,
      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      identityCardNumber: values.identityCardNumber || undefined,
      identityCardIssuedDate: values.identityCardIssuedDate || undefined,
      identityCardIssuedPlace: values.identityCardIssuedPlace || undefined,
      phoneNumber: values.phoneNumber || undefined,
      permanentAddress: values.permanentAddress || undefined,
      currentAddress: values.currentAddress || undefined,
      taxCode: values.taxCode || undefined,
      socialInsuranceCode: values.socialInsuranceCode || undefined,
      managerId: values.managerId || undefined,
      contractType: values.contractType || undefined,
      bankName: values.bankName || undefined,
      bankAccountNumber: values.bankAccountNumber || undefined,
      customFieldValues:
        values.customFieldValues && Object.keys(values.customFieldValues).length > 0
          ? (values.customFieldValues as Record<string, string>)
          : undefined,
    }
    await create.mutateAsync(payload)
    onOpenChange(false)
  }

  const gender = watch('gender')
  const jobLevelId = watch('jobLevelId')
  const managerId = watch('managerId')
  const contractType = watch('contractType')
  const customFieldValues = (watch('customFieldValues') ?? {}) as Record<string, string>

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Tạo nhân sự mới</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <Accordion type="multiple" defaultValue={['basic', 'employment']} className="w-full">

            {/* ── Thông tin cơ bản ── */}
            <AccordionItem value="basic">
              <AccordionTrigger className="text-sm font-medium">Thông tin cơ bản</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Họ tên <span className="text-destructive">*</span></Label>
                  <Input id="fullName" {...register('fullName')} placeholder="Nguyễn Văn A" />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" {...register('email')} placeholder="email@bahung.vn" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="employeeCode">Mã nhân viên</Label>
                    <Input id="employeeCode" {...register('employeeCode')} placeholder="NV0001 (tự động)" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber">Điện thoại</Label>
                    <Input id="phoneNumber" {...register('phoneNumber')} placeholder="0901234567" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Giới tính</Label>
                    <Select value={gender ?? ''} onValueChange={(v) => setValue('gender', v as Gender || undefined)}>
                      <SelectTrigger><SelectValue placeholder="Chọn..." /></SelectTrigger>
                      <SelectContent>
                        {GENDERS.map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Thông tin công việc ── */}
            <AccordionItem value="employment">
              <AccordionTrigger className="text-sm font-medium">Thông tin công việc</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Cấp bậc <span className="text-destructive">*</span></Label>
                    <Select value={jobLevelId ?? ''} onValueChange={(v) => setValue('jobLevelId', v)}>
                      <SelectTrigger><SelectValue placeholder="Chọn cấp bậc" /></SelectTrigger>
                      <SelectContent>
                        {(jobLevelsData?.items ?? []).map((jl) => (
                          <SelectItem key={jl.id} value={jl.id}>{jl.levelName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.jobLevelId && <p className="text-xs text-destructive">{errors.jobLevelId.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dateOfJoin">Ngày vào làm <span className="text-destructive">*</span></Label>
                    <Input id="dateOfJoin" type="date" {...register('dateOfJoin')} />
                    {errors.dateOfJoin && <p className="text-xs text-destructive">{errors.dateOfJoin.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Quản lý trực tiếp</Label>
                  <Select value={managerId ?? ''} onValueChange={(v) => setValue('managerId', v || undefined)}>
                    <SelectTrigger><SelectValue placeholder="Không có" /></SelectTrigger>
                    <SelectContent>
                      {(users ?? []).map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.fullName} ({u.employeeCode})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Giấy tờ tùy thân ── */}
            <AccordionItem value="identity">
              <AccordionTrigger className="text-sm font-medium">Giấy tờ tùy thân</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="identityCardNumber">Số CCCD</Label>
                    <Input id="identityCardNumber" {...register('identityCardNumber')} placeholder="012345678901" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="identityCardIssuedDate">Ngày cấp</Label>
                    <Input id="identityCardIssuedDate" type="date" {...register('identityCardIssuedDate')} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="identityCardIssuedPlace">Nơi cấp</Label>
                  <Input id="identityCardIssuedPlace" {...register('identityCardIssuedPlace')} placeholder="Cục CSQLHC về TTXH - Bộ Công An" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="taxCode">Mã số thuế cá nhân</Label>
                    <Input id="taxCode" {...register('taxCode')} placeholder="8123456789" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="socialInsuranceCode">Mã số BHXH</Label>
                    <Input id="socialInsuranceCode" {...register('socialInsuranceCode')} placeholder="0123456789" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Địa chỉ ── */}
            <AccordionItem value="address">
              <AccordionTrigger className="text-sm font-medium">Địa chỉ</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="permanentAddress">Địa chỉ thường trú</Label>
                  <Input id="permanentAddress" {...register('permanentAddress')} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currentAddress">Địa chỉ cư trú hiện tại</Label>
                  <Input id="currentAddress" {...register('currentAddress')} placeholder="Để trống nếu giống thường trú" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Ngân hàng & hợp đồng ── */}
            <AccordionItem value="finance">
              <AccordionTrigger className="text-sm font-medium">Ngân hàng &amp; hợp đồng</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label>Loại hợp đồng</Label>
                  <Select
                    value={contractType ?? ''}
                    onValueChange={(v) => setValue('contractType', (v as ContractType) || undefined)}
                  >
                    <SelectTrigger><SelectValue placeholder="Chọn loại hợp đồng" /></SelectTrigger>
                    <SelectContent>
                      {CONTRACT_TYPES.map(([v, label]) => (
                        <SelectItem key={v} value={v}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="bankName">Ngân hàng</Label>
                    <Input id="bankName" {...register('bankName')} placeholder="Vietcombank" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bankAccountNumber">Số tài khoản</Label>
                    <Input id="bankAccountNumber" {...register('bankAccountNumber')} placeholder="1234567890" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ── Trường tùy chỉnh ── */}
            <AccordionItem value="customFields">
              <AccordionTrigger className="text-sm font-medium">Trường tùy chỉnh</AccordionTrigger>
              <AccordionContent className="pt-2">
                <DynamicFormSection
                  values={customFieldValues}
                  onChange={(id, value) => setValue('customFieldValues', { ...customFieldValues, [id]: value })}
                />
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Đang tạo...' : 'Tạo nhân sự'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
