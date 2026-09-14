import { useEffect, useState } from 'react'
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'
import {
  DndContext, DragOverlay, KeyboardSensor, PointerSensor,
  closestCenter, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@/lib/dnd-modifiers'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { RoleResponse } from '../../types/admin.types'
import { SortableRoleRow } from './SortableRoleRow'

type SortKey = 'roleName' | 'permissions'
type SortDir = 'asc' | 'desc'

interface RolesTableProps {
  roles: RoleResponse[]
  isLoading: boolean
  isFiltering: boolean
  onEdit: (role: RoleResponse) => void
  onDelete: (role: RoleResponse) => void
  onPermissions: (role: RoleResponse) => void
  onUsers: (role: RoleResponse) => void
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
  return sortDir === 'asc'
    ? <ChevronUp className="h-3 w-3 ml-1" />
    : <ChevronDown className="h-3 w-3 ml-1" />
}

export function RolesTable({ roles, isLoading, isFiltering, onEdit, onDelete, onPermissions, onUsers }: RolesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('roleName')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [localRoles, setLocalRoles] = useState<RoleResponse[]>(roles)
  const [activeRole, setActiveRole] = useState<RoleResponse | null>(null)

  useEffect(() => { setLocalRoles(roles) }, [roles])

  const sorted = [...localRoles].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1
    if (sortKey === 'roleName') return mul * a.roleName.localeCompare(b.roleName)
    return mul * (a.permissions.length - b.permissions.length)
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = (e: DragStartEvent) => {
    setActiveRole(localRoles.find((r) => r.id === e.active.id) ?? null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveRole(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    setLocalRoles((prev) => {
      const oldIdx = prev.findIndex((r) => r.id === active.id)
      const newIdx = prev.findIndex((r) => r.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>
                <button
                  className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                  onClick={() => toggleSort('roleName')}
                >
                  Tên vai trò
                  <SortIcon col="roleName" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead>Tên hiển thị</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>
                <button
                  className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                  onClick={() => toggleSort('permissions')}
                >
                  Số quyền
                  <SortIcon col="permissions" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </TableHead>
              <TableHead className="w-[140px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  {isFiltering ? 'Không tìm thấy vai trò nào' : 'Không có vai trò nào'}
                </TableCell>
              </TableRow>
            ) : (
              <SortableContext items={sorted.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                {sorted.map((role) => (
                  <SortableRoleRow
                    key={role.id}
                    role={role}
                    isDragDisabled={isFiltering || role.isSystemRole}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPermissions={onPermissions}
                    onUsers={onUsers}
                  />
                ))}
              </SortableContext>
            )}
          </TableBody>
        </Table>

        <DragOverlay>
          {activeRole && (
            <table className="w-full">
              <tbody>
                <tr className="bg-card border rounded-lg shadow-2xl ring-1 ring-border flex items-center px-2">
                  <td className="w-8 p-2 text-muted-foreground/60">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                  </td>
                  <td className="flex-1 p-2 font-medium text-sm">{activeRole.roleName}</td>
                  <td className="p-2 text-sm hidden sm:table-cell">{activeRole.displayName ?? '—'}</td>
                  <td className="p-2 text-muted-foreground text-sm hidden sm:table-cell">{activeRole.description ?? '—'}</td>
                  <td className="p-2">
                    {activeRole.isSystemRole
                      ? <Badge variant="secondary">Hệ thống</Badge>
                      : <Badge variant="outline">Tùy chỉnh</Badge>}
                  </td>
                  <td className="p-2 text-sm text-muted-foreground">{activeRole.permissions.length}</td>
                </tr>
              </tbody>
            </table>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
