import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { GripVertical, Plus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  useDeleteDepartment,
  useDepartmentTree,
  useUpdateDepartment,
} from '../../../hooks/use-departments'
import type { DepartmentResponse, DepartmentTreeResponse } from '../../../types/admin.types'
import { DepartmentDialog } from '../DepartmentDialog'
import { DeptRow } from './DeptRow'
import { RootZone } from './RootZone'
import {
  ROOT_ID,
  descendantIds,
  findNode,
  flatten,
  insertNode,
  removeNode,
} from './utils'

const TREE_KEY = ['departments', 'tree']

export function DeptListView() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDept, setEditDept] = useState<DepartmentResponse | undefined>()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [deleteDept, setDeleteDept] = useState<{ id: string; name: string } | null>(null)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  const queryClient = useQueryClient()
  const { data: tree, isLoading } = useDepartmentTree()
  const update = useUpdateDepartment()
  const del = useDeleteDepartment()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const rows = useMemo(() => flatten(tree ?? []), [tree])

  const filtered = useMemo(() => {
    let result = rows
    if (statusFilter === 'active') result = result.filter(r => r.node.isActive)
    if (statusFilter === 'inactive') result = result.filter(r => !r.node.isActive)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.node.departmentName.toLowerCase().includes(q) ||
        r.node.departmentCode.toLowerCase().includes(q),
      )
    }
    return result
  }, [rows, search, statusFilter])

  // ponytail: convert flat rows to DepartmentResponse for DepartmentDialog compat
  const allDepts = useMemo((): DepartmentResponse[] =>
    rows.map(r => ({
      id: r.node.id,
      departmentName: r.node.departmentName,
      departmentCode: r.node.departmentCode,
      parentDepartmentId: r.parentId ?? undefined,
      isActive: r.node.isActive,
    })),
  [rows])

  const activeNode = useMemo(
    () => (activeId ? findNode(tree ?? [], activeId) : null),
    [activeId, tree],
  )

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveId(null)
    setOverId(null)
    if (!over) return

    const draggedId = active.id as string
    const targetId = over.id as string
    if (draggedId === targetId) return

    const currentTree = tree ?? []
    const dragged = findNode(currentTree, draggedId)
    const draggedRow = rows.find(r => r.node.id === draggedId)
    if (!dragged || !draggedRow) return

    const newParentId = targetId === ROOT_ID ? null : targetId
    if (draggedRow.parentId === newParentId) return
    if (newParentId && descendantIds(dragged).has(newParentId)) return

    const baseData = {
      departmentName: draggedRow.node.departmentName,
      departmentCode: draggedRow.node.departmentCode,
      isActive: draggedRow.node.isActive,
    }

    const prev = queryClient.getQueryData<DepartmentTreeResponse[]>(TREE_KEY)
    const { tree: without, removed } = removeNode(currentTree, draggedId)
    if (removed) {
      queryClient.setQueryData(TREE_KEY, insertNode(without, newParentId, removed))
      setPendingIds(s => new Set(s).add(draggedId))
    }

    update.mutate(
      { id: draggedId, data: { ...baseData, parentDepartmentId: newParentId ?? undefined } },
      {
        onError: () => { if (prev) queryClient.setQueryData(TREE_KEY, prev) },
        onSettled: () => {
          setPendingIds(s => { const next = new Set(s); next.delete(draggedId); return next })
          queryClient.invalidateQueries({ queryKey: TREE_KEY })
        },
      },
    )
  }, [tree, rows, queryClient, update])

  const openEdit = (row: ReturnType<typeof flatten>[number]) => {
    setEditDept({
      id: row.node.id,
      departmentName: row.node.departmentName,
      departmentCode: row.node.departmentCode,
      parentDepartmentId: row.parentId ?? undefined,
      isActive: row.node.isActive,
    })
    setDialogOpen(true)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragOver={({ over }) => setOverId((over?.id as string) ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { setActiveId(null); setOverId(null) }}
    >
      <div className="h-full overflow-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{rows.length} phòng ban</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border overflow-hidden text-xs">
                {(['all', 'active', 'inactive'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStatusFilter(v)}
                    className={cn(
                      'px-3 py-1.5 transition-colors cursor-pointer',
                      statusFilter === v
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted/50',
                      v !== 'all' && 'border-l',
                    )}
                  >
                    {v === 'all' ? 'Tất cả' : v === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Tìm phòng ban..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-56"
              />
              <Button onClick={() => { setEditDept(undefined); setDialogOpen(true) }} size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Thêm phòng ban
              </Button>
            </div>
          </div>

          {!search && rows.length > 0 && <RootZone isOver={overId === ROOT_ID} active={!!activeId} />}

          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2 pl-3 pr-2 text-left text-xs font-medium text-muted-foreground">Tên</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Mã</th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Trạng thái</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground w-[80px]">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j} className="py-2 px-3"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                      {search ? 'Không tìm thấy phòng ban nào' : 'Không có phòng ban nào'}
                    </td>
                  </tr>
                ) : (
                  filtered.map(row => (
                    <DeptRow
                      key={row.node.id}
                      row={row}
                      isOver={overId === row.node.id && activeId !== row.node.id}
                      isPending={pendingIds.has(row.node.id)}
                      onEdit={() => openEdit(row)}
                      onDelete={() => setDeleteDept({ id: row.node.id, name: row.node.departmentName })}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!search && rows.length > 0 && (
            <p className="text-[11px] text-muted-foreground text-center">
              Kéo <GripVertical className="inline w-3 h-3" /> để thay đổi phòng cha · Hover để thấy nút kéo
            </p>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeNode && (
          <div className="rounded-md border bg-card shadow-xl px-3 py-2 text-sm font-medium whitespace-nowrap max-w-[280px] w-fit cursor-grabbing rotate-1 scale-105 ring-1 ring-primary/20 truncate">
            {activeNode.departmentName}
          </div>
        )}
      </DragOverlay>

      <AlertDialog open={!!deleteDept} onOpenChange={open => { if (!open) setDeleteDept(null) }}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phòng ban</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa phòng ban <strong>{deleteDept?.name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => { if (deleteDept) del.mutate(deleteDept.id); setDeleteDept(null) }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DepartmentDialog
        open={dialogOpen}
        department={editDept}
        allDepartments={allDepts}
        onOpenChange={setDialogOpen}
      />
    </DndContext>
  )
}
