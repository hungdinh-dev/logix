import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Building2, Edit2, GripVertical, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { FlatRow } from './utils'

interface DeptRowProps {
  row: FlatRow
  isOver: boolean
  isPending: boolean
  onEdit: () => void
  onDelete: () => void
}

export function DeptRow({ row, isOver, isPending, onEdit, onDelete }: DeptRowProps) {
  const { setNodeRef: drop } = useDroppable({ id: row.node.id })
  const { attributes, listeners, setNodeRef: drag, isDragging } = useDraggable({ id: row.node.id })

  return (
    <tr ref={drop} className={cn(
      'border-b transition-all hover:bg-muted/30 group',
      isOver && !isDragging && 'bg-primary/5 ring-1 ring-inset ring-primary/30',
      isDragging && 'opacity-30',
      isPending && 'opacity-50',
    )}>
      <td className="py-2 pl-3 pr-2">
        <div className="flex items-center" style={{ paddingLeft: `${row.depth * 20}px` }}>
          <button
            ref={drag} type="button" {...attributes} {...listeners}
            className="mr-1.5 cursor-grab touch-none text-muted-foreground/30 hover:text-muted-foreground active:cursor-grabbing shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Kéo để thay đổi phòng cha"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <Building2 className="w-3 h-3 shrink-0 text-muted-foreground/50 mr-1.5" />
          <span className="text-sm font-medium truncate">{row.node.departmentName}</span>
        </div>
      </td>
      <td className="py-2 px-3 text-xs font-mono text-muted-foreground">{row.node.departmentCode}</td>
      <td className="py-2 px-3">
        {row.node.isActive
          ? <Badge className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:text-green-400 text-xs">Hoạt động</Badge>
          : <Badge variant="destructive" className="text-xs">Vô hiệu</Badge>}
      </td>
      <td className="py-2 px-3">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost" size="sm" className="h-7 w-7 p-0"
            onClick={onEdit} aria-label={`Sửa ${row.node.departmentName}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={onDelete} aria-label={`Xóa ${row.node.departmentName}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
