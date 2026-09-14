import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit2, GripVertical, Shield, Trash2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import type { RoleResponse } from '../../types/admin.types'
import { cn } from '@/lib/utils'

interface Props {
  role: RoleResponse
  isDragDisabled: boolean
  onEdit: (role: RoleResponse) => void
  onDelete: (role: RoleResponse) => void
  onPermissions: (role: RoleResponse) => void
  onUsers: (role: RoleResponse) => void
}

const DESC_LIMIT = 40

function DescriptionCell({ text }: { text?: string }) {
  if (!text) return <span className="text-muted-foreground/40">—</span>
  if (text.length <= DESC_LIMIT) return <span>{text}</span>
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default">{text.slice(0, DESC_LIMIT)}…</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{text}</TooltipContent>
    </Tooltip>
  )
}

function PermissionsPreview({ role, onOpen }: { role: RoleResponse; onOpen: () => void }) {
  const grouped = role.permissions.reduce<Record<string, string[]>>((acc, p) => {
    ;(acc[p.module] ??= []).push(p.permissionCode)
    return acc
  }, {})

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onOpen}>
          <Shield className="h-3.5 w-3.5 mr-1" />
          Quyền
        </Button>
      </HoverCardTrigger>
      {role.permissions.length > 0 && (
        <HoverCardContent side="left" align="end" className="w-64 p-3">
          <p className="text-xs font-semibold mb-2 text-foreground">
            {role.permissions.length} quyền — {role.displayName ?? role.roleName}
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Object.entries(grouped).map(([module, codes]) => (
              <div key={module}>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">{module}</p>
                <div className="flex flex-wrap gap-1">
                  {codes.map((code) => (
                    <Badge key={code} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t">Click để quản lý chi tiết</p>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}

export function SortableRoleRow({ role, isDragDisabled, onEdit, onDelete, onPermissions, onUsers }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: role.id,
    disabled: isDragDisabled,
  })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn('group', isDragging && 'opacity-40 ring-2 ring-inset ring-primary/30 bg-muted/50')}
    >
      <TableCell className="w-8 pr-0">
        {!isDragDisabled && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded text-muted-foreground/40 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Kéo để sắp xếp vai trò ${role.roleName}`}
            tabIndex={0}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </TableCell>

      <TableCell className="font-medium">{role.roleName}</TableCell>
      <TableCell className="text-sm">{role.displayName ?? <span className="text-muted-foreground/40">—</span>}</TableCell>
      <TableCell className="text-muted-foreground text-sm max-w-[180px]">
        <DescriptionCell text={role.description} />
      </TableCell>
      <TableCell>
        {role.isSystemRole
          ? <Badge variant="secondary">Hệ thống</Badge>
          : <Badge variant="outline">Tùy chỉnh</Badge>}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{role.permissions.length}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <PermissionsPreview role={role} onOpen={() => onPermissions(role)} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onUsers(role)}
                aria-label={`Gán người dùng vào ${role.roleName}`}
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                Users
              </Button>
            </TooltipTrigger>
            <TooltipContent>Gán người dùng vào vai trò</TooltipContent>
          </Tooltip>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onEdit(role)}
            aria-label={`Chỉnh sửa ${role.roleName}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(role)}
            disabled={role.isSystemRole}
            aria-label={`Xóa ${role.roleName}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
