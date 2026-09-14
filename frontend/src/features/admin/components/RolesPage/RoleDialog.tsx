import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { roleSchema, type RoleFormValues } from '../../schemas/admin.schemas'
import { useCreateRole, useUpdateRole } from '../../hooks/use-roles'
import type { RoleResponse } from '../../types/admin.types'

interface RoleDialogProps {
  open: boolean
  role?: RoleResponse
  onOpenChange: (open: boolean) => void
}

export function RoleDialog({ open, role, onOpenChange }: RoleDialogProps) {
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
  })

  useEffect(() => {
    if (open) {
      reset({
        roleName: role?.roleName ?? '',
        displayName: role?.displayName ?? '',
        description: role?.description ?? '',
      })
    }
  }, [open, role, reset])

  const onSubmit = async ({ roleName, displayName, description }: RoleFormValues) => {
    if (role) {
      await updateRole.mutateAsync({ id: role.id, data: { displayName, description: description ?? '' } })
    } else {
      await createRole.mutateAsync({ roleName, displayName, description: description ?? '' })
    }
    onOpenChange(false)
  }

  const isPending = createRole.isPending || updateRole.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{role ? 'Chỉnh sửa vai trò' : 'Tạo vai trò'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="roleName">Tên role (code) <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="roleName" {...register('roleName')} placeholder="vd: hr-manager" disabled={!!role} />
            {errors.roleName && <p className="text-xs text-destructive">{errors.roleName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Tên hiển thị <span aria-hidden="true" className="text-destructive">*</span></Label>
            <Input id="displayName" {...register('displayName')} placeholder="vd: HR Manager" />
            {errors.displayName && <p className="text-xs text-destructive">{errors.displayName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" {...register('description')} rows={3} placeholder="Mô tả (tùy chọn)" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : role ? 'Lưu thay đổi' : 'Tạo vai trò'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
