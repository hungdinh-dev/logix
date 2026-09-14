import { useEffect, useMemo, useState } from 'react'
import { Search, Shield, X, GripVertical, ArrowRight } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { restrictToWindowEdges } from '@/lib/dnd-modifiers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useAssignPermissions } from '../../hooks/use-roles'
import { usePermissions } from '../../hooks/use-permissions'
import type { RoleResponse } from '../../types/admin.types'
import { cn } from '@/lib/utils'

interface PermissionsSheetProps {
  open: boolean
  role: RoleResponse | undefined
  onOpenChange: (open: boolean) => void
}

// ── Draggable permission chip ──────────────────────────────────────────────
function DraggableChip({
  id,
  label,
  containerId,
  onRemove,
}: {
  id: string
  label: string
  containerId: string
  onRemove?: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${containerId}:${id}`,
    data: { permId: id, from: containerId },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-md border bg-card text-xs font-mono',
        'cursor-grab active:cursor-grabbing select-none transition-all',
        isDragging ? 'opacity-0' : 'hover:border-primary/50 hover:bg-accent',
      )}
    >
      <span {...attributes} {...listeners} className="touch-none">
        <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0" />
      </span>
      <span className="truncate max-w-[140px]" title={label}>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-auto text-muted-foreground/50 hover:text-destructive transition-colors shrink-0"
          aria-label={`Gỡ quyền ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// ── Droppable panel ────────────────────────────────────────────────────────
function DroppablePanel({
  id,
  children,
  isEmpty,
  placeholder,
  isOver,
}: {
  id: string
  children: React.ReactNode
  isEmpty: boolean
  placeholder: string
  isOver?: boolean
}) {
  const { setNodeRef, isOver: dndOver } = useDroppable({ id })
  const over = isOver ?? dndOver

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-full rounded-lg border-2 border-dashed transition-colors p-3',
          over ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
        )}
      >
        {isEmpty ? (
          <div className="min-h-[160px] flex items-center justify-center text-xs text-muted-foreground text-center p-4">
            {placeholder}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">{children}</div>
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function PermissionsSheet({ open, role, onOpenChange }: PermissionsSheetProps) {
  const { data: allPermissions, isLoading } = usePermissions()
  const assignPermissions = useAssignPermissions()

  const [assigned, setAssigned] = useState<Set<string>>(new Set())
  const [searchAvail, setSearchAvail] = useState('')
  const [searchAssigned, setSearchAssigned] = useState('')
  const [activeChip, setActiveChip] = useState<{ id: string; label: string } | null>(null)

  useEffect(() => {
    if (open && role) {
      setAssigned(new Set(role.permissions.map((p) => p.id)))
    } else if (!open) {
      setAssigned(new Set())
      setSearchAvail('')
      setSearchAssigned('')
    }
  }, [open, role?.id, role?.permissions])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  // Split into available vs assigned
  const { available, assignedList } = useMemo(() => {
    const all = allPermissions ?? []
    const qAvail = searchAvail.toLowerCase()
    const qAssigned = searchAssigned.toLowerCase()
    return {
      available: all.filter((p) => !assigned.has(p.id) && (!qAvail || p.permissionCode.toLowerCase().includes(qAvail))),
      assignedList: all.filter((p) => assigned.has(p.id) && (!qAssigned || p.permissionCode.toLowerCase().includes(qAssigned))),
    }
  }, [allPermissions, assigned, searchAvail, searchAssigned])

  const groupByResource = (list: typeof available) =>
    list.reduce<Record<string, typeof available>>((acc, p) => {
      const resource = p.permissionCode.split(':')[0] ?? 'other'
      ;(acc[resource] ??= []).push(p)
      return acc
    }, {})

  // Group available by resource
  const grouped = useMemo(() => groupByResource(available), [available])
  const groupedAssigned = useMemo(() => groupByResource(assignedList), [assignedList])

  const assign = (id: string) => setAssigned((prev) => new Set([...prev, id]))
  const unassign = (id: string) => setAssigned((prev) => { const next = new Set(prev); next.delete(id); return next })

  const handleDragStart = (event: DragStartEvent) => {
    const { permId, from } = event.active.data.current as { permId: string; from: string }
    const perm = allPermissions?.find((p) => p.id === permId)
    if (perm) {
      const action = from === 'available'
        ? perm.permissionCode
        : perm.permissionCode.split(':')[1] ?? perm.permissionCode
      setActiveChip({ id: permId, label: action })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveChip(null)
    const { over, active } = event
    if (!over) return
    const { permId, from } = active.data.current as { permId: string; from: string }
    const to = over.id as string
    if (from === 'available' && to === 'assigned') assign(permId)
    else if (from === 'assigned' && to === 'available') unassign(permId)
  }

  const handleSave = async () => {
    if (!role) return
    await assignPermissions.mutateAsync({ roleId: role.id, permissionIds: [...assigned] })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[min(800px,95vw)] sm:max-w-none flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Phân quyền — {role?.roleName}
            <Badge variant="secondary" className="ml-auto text-xs font-normal">
              {assigned.size} quyền đã gán
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <DndContext
            sensors={sensors}
            modifiers={[restrictToWindowEdges]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {isLoading ? (
              <div className="p-6 grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 rounded-md" />
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-hidden grid grid-cols-2 gap-0 divide-x">
                {/* ── LEFT: available ─────────────────────────────── */}
                <div className="flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Có sẵn
                      </span>
                      <span className="text-xs text-muted-foreground">{available.length} quyền</span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Tìm quyền..."
                        value={searchAvail}
                        onChange={(e) => setSearchAvail(e.target.value)}
                        className="pl-8 h-7 text-xs"
                      />
                    </div>
                  </div>

                  <DroppablePanel id="available" isEmpty={available.length === 0} placeholder="Tất cả quyền đã được gán">
                    <div className="w-full space-y-3">
                      {Object.entries(grouped).map(([resource, perms]) => (
                        <div key={resource}>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 px-0.5">
                            {resource}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {perms.map((p) => {
                              const action = p.permissionCode.split(':')[1] ?? p.permissionCode
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => assign(p.id)}
                                  className="group relative"
                                  title={`Gán: ${p.permissionCode}`}
                                >
                                  <DraggableChip id={p.id} label={action} containerId="available" />
                                  <ArrowRight className="absolute -right-1 -top-1 h-3 w-3 bg-primary text-primary-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DroppablePanel>
                </div>

                {/* ── RIGHT: assigned ──────────────────────────────── */}
                <div className="flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Đã gán
                      </span>
                      <span className="text-xs text-muted-foreground">{assignedList.length} quyền</span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Lọc đã gán..."
                        value={searchAssigned}
                        onChange={(e) => setSearchAssigned(e.target.value)}
                        className="pl-8 h-7 text-xs"
                      />
                    </div>
                  </div>

                  <DroppablePanel
                    id="assigned"
                    isEmpty={assignedList.length === 0}
                    placeholder={'Kéo quyền vào đây để gán\nhoặc click vào quyền bên trái'}
                  >
                    <div className="w-full space-y-3">
                      {Object.entries(groupedAssigned).map(([resource, perms]) => (
                        <div key={resource}>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5 px-0.5">
                            {resource}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {perms.map((p) => {
                              const action = p.permissionCode.split(':')[1] ?? p.permissionCode
                              return (
                                <DraggableChip
                                  key={p.id}
                                  id={p.id}
                                  label={action}
                                  containerId="assigned"
                                  onRemove={() => unassign(p.id)}
                                />
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DroppablePanel>
                </div>
              </div>
            )}

            <DragOverlay modifiers={[restrictToWindowEdges]}>
              {activeChip && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-primary bg-card shadow-xl text-xs font-mono opacity-95 cursor-grabbing pointer-events-none">
                  <GripVertical className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                  <span>{activeChip.label}</span>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center shrink-0">
          <span className="text-xs text-muted-foreground">
            {assigned.size} / {(allPermissions ?? []).length} quyền được gán
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={assignPermissions.isPending}>
              {assignPermissions.isPending ? 'Đang lưu...' : 'Lưu quyền hạn'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
