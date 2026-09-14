import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { ROOT_ID } from './utils'

export function RootZone({ isOver, active }: { isOver: boolean; active: boolean }) {
  const { setNodeRef } = useDroppable({ id: ROOT_ID })
  return (
    <div ref={setNodeRef} className={cn(
      'rounded-md border-2 border-dashed px-4 py-2.5 text-xs text-center transition-colors',
      isOver ? 'border-primary bg-primary/5 text-primary'
        : active ? 'border-muted text-muted-foreground' : 'border-muted/40 text-muted-foreground/40',
    )}>
      Kéo vào đây → phòng ban gốc (không có phòng cha)
    </div>
  )
}
