import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteRole } from '../../hooks/use-roles'
import type { RoleResponse } from '../../types/admin.types'

interface RoleDeleteDialogProps {
  role: RoleResponse | null
  onClose: () => void
}

export function RoleDeleteDialog({ role, onClose }: RoleDeleteDialogProps) {
  const deleteRole = useDeleteRole()

  return (
    <AlertDialog open={!!role} onOpenChange={(open) => { if (!open) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa vai trò</AlertDialogTitle>
          <AlertDialogDescription>
            Xóa vai trò <span className="font-semibold text-foreground">"{role?.roleName}"</span>?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => { if (role) deleteRole.mutate(role.id) }}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
