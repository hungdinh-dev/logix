import { useEffect, useMemo, useState, useDeferredValue, memo } from 'react'
import { Search, Users, X, GripVertical, ArrowRight } from 'lucide-react'
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
import { useAllUsers, useRoleUsers, useSyncRoleUsers } from '../../hooks/use-roles'
import type { RoleResponse, UserSummaryResponse } from '../../types/admin.types'
import { cn } from '@/lib/utils'

interface AssignUsersSheetProps {
  open: boolean
  role: RoleResponse | undefined
  onOpenChange: (open: boolean) => void
}

function userInitials(name?: string) {
  if (!name) return '?'
  return name.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
}

const UserChip = memo(function UserChip({
  user,
  containerId,
  onRemove,
  onAdd,
}: {
  user: UserSummaryResponse
  containerId: string
  onRemove?: () => void
  onAdd?: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${containerId}:${user.id}`,
    data: { userId: user.id, from: containerId },
  })

  return (
    <div
      ref={setNodeRef}
      onClick={onAdd}
      className={cn(
        'group flex items-center gap-2 px-2 py-1.5 rounded-lg border bg-card text-sm',
        'cursor-grab active:cursor-grabbing select-none transition-all w-full relative',
        isDragging ? 'opacity-0' : 'hover:border-primary/50 hover:bg-accent',
        onAdd && 'cursor-pointer',
      )}
    >
      <span
        {...attributes}
        {...listeners}
        className="touch-none shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-foreground" />
      </span>
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-[11px] font-semibold shrink-0">
        {userInitials(user.fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate leading-none mb-0.5">{user.fullName}</p>
        <p className="text-[11px] text-muted-foreground truncate">{user.employeeCode}</p>
      </div>

      {onAdd && (
        <ArrowRight className="h-3.5 w-3.5 bg-primary text-primary-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-auto text-muted-foreground/40 hover:text-destructive transition-colors shrink-0"
          aria-label={`Gỡ ${user.fullName}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
})

function DroppablePanel({
  id,
  children,
  isEmpty,
  placeholder,
}: {
  id: string
  children: React.ReactNode
  isEmpty: boolean
  placeholder: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-full rounded-lg border-2 border-dashed transition-colors p-2 space-y-1',
          isOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
        )}
      >
        {isEmpty ? (
          <div className="min-h-[160px] flex items-center justify-center text-xs text-muted-foreground text-center p-4 whitespace-pre-line">
            {placeholder}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export function AssignUsersSheet({ open, role, onOpenChange }: AssignUsersSheetProps) {
  const { data: allUsers = [], isLoading: usersLoading } = useAllUsers()
  const { data: roleUsers = [], isLoading: roleUsersLoading } = useRoleUsers(open ? role?.id : undefined)
  const syncUsers = useSyncRoleUsers()

  const [assigned, setAssigned] = useState<Set<string>>(new Set())
  const [initialAssigned, setInitialAssigned] = useState<Set<string>>(new Set())
  const [searchAvail, setSearchAvail] = useState('')
  const [searchAssigned, setSearchAssigned] = useState('')
  const [activeUser, setActiveUser] = useState<UserSummaryResponse | null>(null)

  const deferredSearchAvail = useDeferredValue(searchAvail)
  const deferredSearchAssigned = useDeferredValue(searchAssigned)

  const isLoading = usersLoading || roleUsersLoading

  useEffect(() => {
    if (open && role?.id && !roleUsersLoading) {
      const ids = new Set(roleUsers.map((u) => u.id))
      setAssigned(ids)
      setInitialAssigned(ids)
    } else if (!open) {
      setSearchAvail('')
      setSearchAssigned('')
    }
  }, [open, role?.id, roleUsersLoading])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers])

  const { available, assignedList } = useMemo(() => {
    const qAvail = deferredSearchAvail.toLowerCase().trim()
    const qAssigned = deferredSearchAssigned.toLowerCase().trim()
    const matches = (u: UserSummaryResponse, q: string) =>
      !q || u.fullName.toLowerCase().includes(q) || u.employeeCode.toLowerCase().includes(q)

    return {
      available: allUsers.filter((u) => !assigned.has(u.id) && matches(u, qAvail)),
      assignedList: allUsers.filter((u) => assigned.has(u.id) && matches(u, qAssigned)),
    }
  }, [allUsers, assigned, deferredSearchAvail, deferredSearchAssigned])

  const add = (id: string) => setAssigned((prev) => new Set([...prev, id]))
  const remove = (id: string) => setAssigned((prev) => { const s = new Set(prev); s.delete(id); return s })

  const handleDragStart = (e: DragStartEvent) => {
    const { userId } = e.active.data.current as { userId: string; from: string }
    setActiveUser(userMap.get(userId) ?? null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveUser(null)
    const { over, active } = e
    if (!over) return
    const { userId, from } = active.data.current as { userId: string; from: string }
    if (from === 'available' && over.id === 'assigned') add(userId)
    else if (from === 'assigned' && over.id === 'available') remove(userId)
  }

  const handleSave = async () => {
    if (!role) return
    const toAdd = [...assigned].filter((id) => !initialAssigned.has(id))
    const toRemove = [...initialAssigned].filter((id) => !assigned.has(id))

    if (toAdd.length === 0 && toRemove.length === 0) {
      onOpenChange(false)
      return
    }

    try {
      await syncUsers.mutateAsync({ roleId: role.id, toAdd, toRemove })
      onOpenChange(false)
    } catch {
      // Giữ Sheet mở để người dùng có thể thử lại nếu lỗi
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[min(800px,95vw)] sm:max-w-none flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden="true" />
            Gán người dùng — {role?.displayName ?? role?.roleName}
            <Badge variant="secondary" className="ml-auto text-xs font-normal">
              {assigned.size} người dùng
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
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-hidden grid grid-cols-2 gap-0 divide-x">
                {/* LEFT: available */}
                <div className="flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chưa có vai trò</span>
                      <span className="text-xs text-muted-foreground">{available.length} người</span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Tìm nhân sự..."
                        value={searchAvail}
                        onChange={(e) => setSearchAvail(e.target.value)}
                        className="pl-8 h-7 text-xs"
                      />
                    </div>
                  </div>
                  <DroppablePanel id="available" isEmpty={available.length === 0} placeholder="Tất cả nhân sự đã được gán">
                    {available.map((u) => (
                      <UserChip key={u.id} user={u} containerId="available" onAdd={() => add(u.id)} />
                    ))}
                  </DroppablePanel>
                </div>

                {/* RIGHT: assigned */}
                <div className="flex flex-col overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Đã gán</span>
                      <span className="text-xs text-muted-foreground">{assignedList.length} người</span>
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
                  <DroppablePanel id="assigned" isEmpty={assignedList.length === 0} placeholder={'Kéo nhân sự vào đây\nhoặc click vào tên bên trái'}>
                    {assignedList.map((u) => (
                      <UserChip key={u.id} user={u} containerId="assigned" onRemove={() => remove(u.id)} />
                    ))}
                  </DroppablePanel>
                </div>
              </div>
            )}

            <DragOverlay modifiers={[restrictToWindowEdges]}>
              {activeUser && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary bg-card shadow-xl text-sm opacity-95 cursor-grabbing pointer-events-none w-52">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center shrink-0">
                    {userInitials(activeUser.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{activeUser.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">{activeUser.employeeCode}</p>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center shrink-0">
          <span className="text-xs text-muted-foreground">
            {assigned.size} / {allUsers.length} nhân sự được gán
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={syncUsers.isPending}>
              {syncUsers.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
