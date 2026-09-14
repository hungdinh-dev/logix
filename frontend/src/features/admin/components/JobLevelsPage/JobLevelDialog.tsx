import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { jobLevelSchema, type JobLevelFormValues } from '../../schemas/admin.schemas'
import { useCreateJobLevel, useUpdateJobLevel } from '../../hooks/use-job-levels'
import { SCOPE_TYPE_LABELS, type JobLevelResponse } from '../../types/admin.types'

interface JobLevelDialogProps {
  open: boolean
  jobLevel?: JobLevelResponse
  onOpenChange: (open: boolean) => void
}

export function JobLevelDialog({ open, jobLevel, onOpenChange }: JobLevelDialogProps) {
  const create = useCreateJobLevel()
  const update = useUpdateJobLevel()
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<JobLevelFormValues>({
    resolver: zodResolver(jobLevelSchema) as any,
  })

  useEffect(() => {
    if (open) {
      reset({
        levelName: jobLevel?.levelName ?? '',
        levelOrder: jobLevel?.levelOrder ?? 1,
        defaultScopeType: jobLevel?.defaultScopeType ?? 4,
        description: jobLevel?.description ?? '',
        baseSalaryMin: jobLevel?.baseSalaryMin,
        baseSalaryMax: jobLevel?.baseSalaryMax,
      })
    }
  }, [open, jobLevel, reset])

  const onSubmit = async (values: JobLevelFormValues) => {
    if (jobLevel) {
      await update.mutateAsync({ id: jobLevel.id, data: values })
    } else {
      await create.mutateAsync(values)
    }
    onOpenChange(false)
  }

  const isPending = create.isPending || update.isPending
  const scopeType = watch('defaultScopeType')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{jobLevel ? 'Chỉnh sửa cấp bậc' : 'Tạo cấp bậc'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="levelName">Tên cấp bậc <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="levelName" {...register('levelName')} placeholder="vd: Manager" />
              {errors.levelName && <p className="text-xs text-destructive">{errors.levelName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="levelOrder">Thứ tự <span aria-hidden="true" className="text-destructive">*</span></Label>
              <Input id="levelOrder" type="number" {...register('levelOrder')} min={1} />
              {errors.levelOrder && <p className="text-xs text-destructive">{errors.levelOrder.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Phạm vi mặc định <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Select
              value={String(scopeType ?? 4)}
              onValueChange={(value) => setValue('defaultScopeType', Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(SCOPE_TYPE_LABELS) as [string, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="baseSalaryMin">Lương tối thiểu</Label>
              <Input id="baseSalaryMin" type="number" {...register('baseSalaryMin')} placeholder="0" min={0} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="baseSalaryMax">Lương tối đa</Label>
              <Input id="baseSalaryMax" type="number" {...register('baseSalaryMax')} placeholder="0" min={0} />
            </div>
          </div>
          {(errors.baseSalaryMin || errors.baseSalaryMax) && (
            <p className="text-xs text-destructive">{errors.baseSalaryMin?.message ?? errors.baseSalaryMax?.message}</p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" {...register('description')} rows={2} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : jobLevel ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
