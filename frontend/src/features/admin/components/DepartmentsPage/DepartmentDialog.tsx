import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { departmentSchema, type DepartmentFormValues } from '../../schemas/admin.schemas'
import { useCreateDepartment, useUpdateDepartment } from '../../hooks/use-departments'
import type { DepartmentResponse } from '../../types/admin.types'

interface DepartmentDialogProps {
  open: boolean
  department?: DepartmentResponse
  allDepartments: DepartmentResponse[]
  onOpenChange: (open: boolean) => void
}

export function DepartmentDialog({ open, department, allDepartments, onOpenChange }: DepartmentDialogProps) {
  const create = useCreateDepartment()
  const update = useUpdateDepartment()

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
  })

  useEffect(() => {
    if (open) {
      form.reset({
        departmentName: department?.departmentName ?? '',
        departmentCode: department?.departmentCode ?? '',
        parentDepartmentId: department?.parentDepartmentId ?? '',
        managerId: '',
        isActive: department?.isActive ?? true,
      })
    }
  }, [open, department, form])

  const onSubmit = async (values: DepartmentFormValues) => {
    const payload = {
      departmentName: values.departmentName,
      departmentCode: values.departmentCode,
      parentDepartmentId: values.parentDepartmentId || undefined,
      managerId: values.managerId || undefined,
      isActive: values.isActive,
    }
    if (department) {
      await update.mutateAsync({ id: department.id, data: payload })
    } else {
      await create.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  const isPending = create.isPending || update.isPending
  const isActive = form.watch('isActive')
  const parents = allDepartments.filter(d => d.id !== department?.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">
        <DialogHeader className="flex-row items-center gap-3 px-6 py-4 border-b">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-base">
              {department ? 'Chỉnh sửa phòng ban' : 'Tạo phòng ban mới'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {department ? `Đang chỉnh sửa · ${department.departmentCode}` : 'Điền thông tin phòng ban mới'}
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="departmentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Tên phòng ban <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="vd: Phòng Nhân sự" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Mã phòng ban <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="vd: HR-01" className="font-mono" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="parentDepartmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Phòng ban cấp trên</FormLabel>
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Không có (gốc)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Không có (gốc)</SelectItem>
                        {parents.map(d => (
                          <SelectItem key={d.id} value={d.id}>
                            <span className="flex items-center gap-2">
                              <span>{d.departmentName}</span>
                              <span className="text-xs text-muted-foreground font-mono">({d.departmentCode})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {department && (
                <div className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-3 transition-colors duration-200',
                  isActive
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-border bg-muted/20',
                )}>
                  <div>
                    <p className="text-sm font-medium">Trạng thái hoạt động</p>
                    <p className={cn('text-xs mt-0.5 transition-colors', isActive ? 'text-green-500' : 'text-muted-foreground')}>
                      {isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                    </p>
                  </div>
                  <Switch
                    checked={isActive ?? true}
                    onCheckedChange={val => form.setValue('isActive', val)}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-muted/20">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Đang lưu...' : department ? 'Lưu thay đổi' : 'Tạo phòng ban'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
