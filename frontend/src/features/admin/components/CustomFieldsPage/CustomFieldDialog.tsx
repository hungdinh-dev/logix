import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useCreateCustomField, useUpdateCustomField } from '../../hooks/use-custom-fields'
import { FIELD_TYPE_LABELS, type CustomFieldDefinitionResponse, type CustomFieldType } from '../../types/admin.types'

const FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as CustomFieldType[]
const SELECT_TYPES: CustomFieldType[] = ['Select', 'MultiSelect']

const FIELD_TYPE_ICONS: Record<string, string> = {
  Text: 'Aa', Number: '123', Date: '📅', Select: '▾', MultiSelect: '☑', Checkbox: '✓', TextArea: '¶',
}

const optionSchema = z.object({
  id: z.string().optional(),
  value: z.string().min(1, 'Bắt buộc'),
  label: z.string().min(1, 'Bắt buộc'),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

const schema = z.object({
  code: z.string().min(1).max(50).regex(/^[A-Za-z0-9_]+$/, 'Chỉ chữ, số, dấu _'),
  name: z.string().min(1).max(200),
  fieldType: z.enum(['Text', 'Number', 'Date', 'Select', 'MultiSelect', 'Checkbox', 'TextArea']),
  module: z.string().min(1).max(50),
  isRequired: z.boolean(),
  sortOrder: z.coerce.number(),
  placeholder: z.string().max(200).optional(),
  helpText: z.string().max(500).optional(),
  group: z.string().max(100).optional(),
  options: z.array(optionSchema).optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  definition?: CustomFieldDefinitionResponse
  onOpenChange: (v: boolean) => void
}

function SectionLabel({ children }: { readonly children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </p>
  )
}

export function CustomFieldDialog({ open, definition, onOpenChange }: Props) {
  const isEdit = !!definition
  const create = useCreateCustomField()
  const update = useUpdateCustomField()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, control, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { fieldType: 'Text', isRequired: false, sortOrder: 0, module: 'Employee' },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'options' })
  const fieldType = watch('fieldType')
  const isRequired = watch('isRequired')
  const needsOptions = SELECT_TYPES.includes(fieldType)

  useEffect(() => {
    if (open) {
      reset(definition ? {
        code: definition.code,
        name: definition.name,
        fieldType: definition.fieldType,
        module: definition.module,
        isRequired: definition.isRequired,
        sortOrder: definition.sortOrder,
        placeholder: definition.placeholder ?? '',
        helpText: definition.helpText ?? '',
        group: definition.group ?? '',
        options: definition.options.map(o => ({ ...o })),
      } : { fieldType: 'Text', isRequired: false, sortOrder: 0, module: 'Employee' })
    }
  }, [open, definition, reset])

  const onSubmit = async (values: FormValues) => {
    if (isEdit) {
      await update.mutateAsync({ id: definition!.id, data: {
        name: values.name,
        isRequired: values.isRequired,
        isActive: true,
        sortOrder: values.sortOrder,
        placeholder: values.placeholder || undefined,
        helpText: values.helpText || undefined,
        group: values.group || undefined,
        options: values.options,
      }})
    } else {
      await create.mutateAsync({
        code: values.code,
        name: values.name,
        fieldType: values.fieldType,
        module: values.module,
        isRequired: values.isRequired,
        sortOrder: values.sortOrder,
        placeholder: values.placeholder || undefined,
        helpText: values.helpText || undefined,
        group: values.group || undefined,
        options: values.options?.map((o, i) => ({ value: o.value, label: o.label, sortOrder: i })),
      })
    }
    onOpenChange(false)
  }

  const [showConfirm, setShowConfirm] = useState(false)

  const handleOpenChange = (v: boolean) => {
    if (!v && isDirty) { setShowConfirm(true); return }
    onOpenChange(v)
  }

  const handleConfirmClose = () => { setShowConfirm(false); onOpenChange(false) }

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg p-0 gap-0 max-h-[90vh] flex flex-col overflow-hidden"
        onInteractOutside={e => { if (isDirty) e.preventDefault() }}
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border">
          <DialogTitle className="text-base font-semibold">
            {isEdit ? 'Chỉnh sửa trường' : 'Tạo trường tùy chỉnh'}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEdit
              ? `Chỉnh sửa cấu hình cho trường "${definition?.name}"`
              : 'Định nghĩa trường dữ liệu mở rộng cho nhân viên'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-0 flex-1">
          <div className="px-5 py-4 space-y-5 overflow-y-auto flex-1">

            {/* ── Phần 1: Định danh ── */}
            <div>
              <SectionLabel>Định danh</SectionLabel>
              <div className="space-y-3">
                {/* Tên + Thứ tự */}
                <div className="grid grid-cols-[1fr_80px] gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tên hiển thị <span className="text-destructive">*</span></Label>
                    <Input {...register('name')} placeholder="vd: Nhóm máu" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Thứ tự</Label>
                    <Input type="number" {...register('sortOrder')} className="text-center" />
                  </div>
                </div>

                {/* Mã trường */}
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Mã trường <span className="text-destructive">*</span>
                    {isEdit && <span className="ml-2 text-[10px] font-normal text-muted-foreground">(không thể thay đổi)</span>}
                  </Label>
                  <Input
                    {...register('code')}
                    disabled={isEdit}
                    placeholder="vd: blood_type"
                    className="font-mono text-sm"
                  />
                  {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
                </div>

                {/* Loại trường + Module badge + Bắt buộc */}
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Loại trường <span className="text-destructive">*</span></Label>
                    <Select
                      defaultValue={definition?.fieldType ?? 'Text'}
                      disabled={isEdit}
                      onValueChange={v => setValue('fieldType', v as CustomFieldType)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start" sideOffset={4}>
                        {FIELD_TYPES.map(t => (
                          <SelectItem key={t} value={t}>
                            <span className="font-mono text-xs text-muted-foreground mr-2 w-5 inline-block">
                              {FIELD_TYPE_ICONS[t]}
                            </span>
                            {FIELD_TYPE_LABELS[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Module */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Module</Label>
                    <Input
                      {...register('module')}
                      disabled={isEdit}
                      placeholder="vd: Employee"
                      className="font-mono text-sm"
                      maxLength={50}
                    />
                  </div>

                  {/* Bắt buộc toggle */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Bắt buộc</Label>
                    <button
                      type="button"
                      onClick={() => setValue('isRequired', !isRequired)}
                      className={`h-8 px-3 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                        isRequired
                          ? 'bg-destructive/10 border-destructive/40 text-destructive'
                          : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isRequired ? 'Bắt buộc' : 'Tuỳ chọn'}
                    </button>
                  </div>
                </div>

                {/* Nhóm */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Nhóm (Group)</Label>
                  <Input {...register('group')} placeholder="vd: Thông tin cá nhân" />
                </div>
              </div>
            </div>

            {/* ── Phần 2: Lựa chọn (chỉ Select/MultiSelect) ── */}
            {needsOptions && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>Danh sách lựa chọn</SectionLabel>
                  <Button
                    type="button" variant="outline" size="sm"
                    className="h-6 gap-1 text-xs px-2 -mt-3"
                    onClick={() => append({ value: '', label: '', sortOrder: fields.length, isActive: true })}
                  >
                    <Plus className="h-3 w-3" /> Thêm
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                  {fields.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-3">
                      Chưa có lựa chọn — nhấn Thêm để bắt đầu
                    </p>
                  )}
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 cursor-grab" aria-hidden />
                      <Input
                        {...register(`options.${idx}.value`)}
                        placeholder="key"
                        className="h-7 text-xs flex-1 font-mono"
                      />
                      <Input
                        {...register(`options.${idx}.label`)}
                        placeholder="Nhãn hiển thị"
                        className="h-7 text-xs flex-[2]"
                      />
                      <Button
                        type="button" variant="ghost" size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => remove(idx)}
                        aria-label="Xóa lựa chọn"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Phần 3: Tuỳ chọn nâng cao (collapsible) ── */}
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between group cursor-pointer">
                <SectionLabel>Nâng cao</SectionLabel>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground -mt-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs">Placeholder</Label>
                  <Input {...register('placeholder')} placeholder="Gợi ý nhập liệu..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Chú thích (Help text)</Label>
                  <Textarea {...register('helpText')} rows={2} placeholder="Mô tả ngắn về trường này" className="resize-none text-sm" />
                </div>
              </CollapsibleContent>
            </Collapsible>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 shrink-0">
            <Button type="button" variant="outline" className="min-w-[80px]" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="min-w-[100px]" disabled={isSubmitting || create.isPending || update.isPending}>
              {(isSubmitting || create.isPending || update.isPending)
                ? 'Đang lưu...'
                : isEdit ? 'Lưu thay đổi' : 'Tạo trường'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Bỏ thay đổi?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Dữ liệu bạn đã nhập sẽ không được lưu.</p>
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setShowConfirm(false)}>Tiếp tục chỉnh sửa</Button>
          <Button variant="destructive" onClick={handleConfirmClose}>Bỏ thay đổi</Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
