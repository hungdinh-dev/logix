import { useCallback, useEffect, useMemo, useState } from 'react'
import { GitBranch, Minus, Network, Plus, User2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { OrgChartTree, type RenderNodeProps } from '@/features/hr/components/orgchart/OrgChartTree'
import { cn } from '@/lib/utils'
import { useDepartmentTree, useUpdateDepartment } from '../../../hooks/use-departments'
import type { DepartmentTreeResponse } from '../../../types/admin.types'
import { MembersContent } from './MembersPanel'
import type { JobLevelOption } from './types'

type DeptNode = DepartmentTreeResponse & { children: readonly DeptNode[] }

function DeptOrgCard({ node, selected, onSelect }: RenderNodeProps<DeptNode>) {
  if (node.id === '__root__') {
    return (
      <button
        type="button" onClick={() => onSelect?.(node)}
        className="w-36 rounded-lg border-2 border-primary/30 bg-primary/5 px-3 py-2 text-center cursor-pointer hover:border-primary/60 transition-colors"
      >
        <Network className="w-4 h-4 text-primary mx-auto mb-1" />
        <p className="text-xs font-semibold text-primary leading-tight">{node.departmentName}</p>
      </button>
    )
  }

  return (
    <button
      type="button" onClick={() => onSelect?.(node)}
      className={cn(
        'w-44 text-left rounded-lg border bg-card px-3 py-2.5 cursor-pointer',
        'hover:border-primary/50 hover:bg-muted/30 transition-all duration-150',
        selected && 'border-primary ring-1 ring-primary/20 bg-primary/5',
        !node.isActive && 'opacity-50 grayscale border-dashed',
      )}
    >
      <p className="text-[10px] font-mono text-muted-foreground mb-0.5 leading-none">{node.departmentCode}</p>
      <p className="text-xs font-semibold leading-snug line-clamp-2">{node.departmentName}</p>
      {node.managerName && (
        <p className="text-[10px] text-muted-foreground mt-1 truncate leading-none">{node.managerName}</p>
      )}
      <div className="flex items-center gap-1 mt-1.5">
        <Users className="w-2.5 h-2.5 text-muted-foreground/60" />
        <span className="text-[10px] text-muted-foreground/80">
          {node.children.length > 0 ? `${node.children.length} phòng con` : 'Không có phòng con'}
        </span>
      </div>
    </button>
  )
}

function renderDeptCard(props: RenderNodeProps<DeptNode>) {
  return <DeptOrgCard {...props} />
}

function ChildrenList({ items }: { items: DeptNode[] }) {
  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full py-12 gap-2 text-center">
      <GitBranch className="w-7 h-7 text-muted-foreground/30" />
      <p className="text-xs text-muted-foreground">Không có phòng con</p>
    </div>
  )
  return (
    <div className="flex-1 overflow-y-auto">
      {items.map(child => (
        <div key={child.id} className="flex items-center gap-3 px-3 py-2.5 border-b hover:bg-muted/30 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1 rounded">
                {child.departmentCode}
              </span>
            </div>
            <p className="text-xs font-medium leading-snug">{child.departmentName}</p>
            {child.managerName && (
              <p className="text-[10px] text-muted-foreground mt-0.5">{child.managerName}</p>
            )}
          </div>
          {child.children.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 h-4 shrink-0 gap-0.5">
              <GitBranch className="w-2.5 h-2.5" />{child.children.length}
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}

export function TreeView({ jobLevels }: { jobLevels: JobLevelOption[] }) {
  const [scale, setScale] = useState(1)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'members' | 'children'>('members')
  const [addOpen, setAddOpen] = useState(false)
  const { data: tree, isLoading } = useDepartmentTree()
  const updateDept = useUpdateDepartment()

  function findNode(node: DeptNode, id: string): DeptNode | null {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findNode(child as DeptNode, id)
      if (found) return found
    }
    return null
  }

  const root = useMemo((): DeptNode | null => {
    const roots = (tree ?? []) as DeptNode[]
    if (roots.length === 0) return null
    if (roots.length === 1) return roots[0]
    return {
      id: '__root__',
      departmentName: 'Cơ cấu tổ chức',
      departmentCode: '',
      isActive: true,
      children: roots,
    }
  }, [tree])

  const selectedDept = useMemo(
    () => (selectedDeptId && root) ? findNode(root, selectedDeptId) ?? null : null,
    [root, selectedDeptId], // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Auto-expand tất cả nodes khi data load xong
  useEffect(() => {
    if (!root) return
    const ids = new Set<string>()
    const collect = (n: DeptNode) => { ids.add(n.id); n.children.forEach(collect) }
    collect(root)
    setExpandedIds(ids)
  }, [root])

  const handleSelect = useCallback((node: DeptNode) => {
    if (node.id === '__root__') return
    setSelectedDeptId(node.id)
    setActiveTab('members')
    setAddOpen(false)
  }, [])

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card border rounded-lg">
        <Skeleton className="w-40 h-12 rounded-lg" />
      </div>
    )
  }

  if (!root) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card border rounded-lg border-dashed">
        <div className="text-center space-y-1.5">
          <Network className="w-8 h-8 text-muted-foreground/25 mx-auto" />
          <p className="text-xs text-muted-foreground">Chưa có phòng ban nào</p>
          <p className="text-[11px] text-muted-foreground/60">Tạo phòng ban đầu tiên trong tab Quản lý</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div className="absolute top-3 right-3 z-10 flex items-center rounded-md overflow-hidden border bg-card shadow-sm">
        <button type="button" onClick={() => setScale(s => Math.max(0.3, Math.round((s - 0.1) * 10) / 10))}
          className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer text-muted-foreground">
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-[10px] font-medium text-muted-foreground px-1.5 min-w-[36px] text-center select-none tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <button type="button" onClick={() => setScale(s => Math.min(2, Math.round((s + 0.1) * 10) / 10))}
          className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors cursor-pointer text-muted-foreground border-l">
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 bg-card border rounded-lg overflow-hidden">
        <OrgChartTree
          tree={root as DeptNode}
          renderNode={renderDeptCard}
          selectedId={selectedDeptId}
          expandedIds={expandedIds}
          onSelect={handleSelect}
          onToggle={handleToggle}
          scale={scale}
          onZoomChange={setScale}
          editMode={false}
        />
      </div>

      <Sheet open={!!selectedDeptId} onOpenChange={open => { if (!open) { setSelectedDeptId(null); setAddOpen(false) } }}>
        <SheetContent side="right" className="w-[420px] p-0 flex flex-col gap-0">
          {selectedDept && (
            <>
              {/* Dept info header */}
              <div className="shrink-0 border-b">
                <SheetHeader className="px-3 pt-3 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                      {selectedDept.departmentCode}
                    </span>
                    {selectedDept.isActive ? (
                      <Badge variant="outline" className="text-[9px] px-1.5 h-4 text-green-600 border-green-600/30 bg-green-500/5">
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] px-1.5 h-4 text-muted-foreground border-dashed">
                        Vô hiệu
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        'h-5 px-2 text-[10px] gap-1 ml-auto',
                        selectedDept.isActive
                          ? 'text-destructive border-destructive/30 hover:bg-destructive/10'
                          : 'text-green-600 border-green-600/40 hover:bg-green-500/10',
                      )}
                      onClick={() => updateDept.mutate({
                        id: selectedDept.id,
                        data: {
                          departmentName: selectedDept.departmentName,
                          departmentCode: selectedDept.departmentCode,
                          parentDepartmentId: selectedDept.parentDepartmentId,
                          managerId: selectedDept.managerId,
                          isActive: !selectedDept.isActive,
                        },
                      })}
                      disabled={updateDept.isPending}
                    >
                      {selectedDept.isActive ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                    </Button>
                  </div>
                  <SheetTitle className="text-sm font-semibold text-left leading-tight">
                    {selectedDept.departmentName}
                  </SheetTitle>
                </SheetHeader>
                <div className="px-3 pb-2.5 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <User2 className="w-3 h-3 shrink-0" />
                    <span className={cn(!selectedDept.managerName && 'italic opacity-60')}>
                      {selectedDept.managerName ?? 'Chưa có trưởng phòng'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <GitBranch className="w-3 h-3 shrink-0" />
                    <span>{selectedDept.children.length} phòng con</span>
                  </div>
                </div>
              </div>

              {/* Tab bar */}
              <div className="shrink-0 border-b flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('members')}
                  className={cn(
                    'h-9 px-4 flex items-center gap-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer',
                    activeTab === 'members'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Users className="w-3 h-3" />
                  Thành viên
                </button>
                {selectedDept.children.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('children')}
                    className={cn(
                      'h-9 px-4 flex items-center gap-1.5 text-xs font-medium border-b-2 transition-colors cursor-pointer',
                      activeTab === 'children'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <GitBranch className="w-3 h-3" />
                    Phòng con
                    <span className="text-[10px] bg-muted rounded-full px-1.5 leading-4">
                      {selectedDept.children.length}
                    </span>
                  </button>
                )}
                {activeTab === 'members' && (
                  <Button
                    size="sm"
                    className="h-6 px-2 text-[11px] gap-1 ml-auto mr-3 shrink-0"
                    onClick={() => setAddOpen(true)}
                  >
                    <Plus className="w-3 h-3" />Thêm
                  </Button>
                )}
              </div>

              {/* Tab content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeTab === 'members' ? (
                  <MembersContent dept={selectedDept} jobLevels={jobLevels} addOpen={addOpen} onAddOpenChange={setAddOpen} />
                ) : (
                  <ChildrenList items={selectedDept.children as DeptNode[]} />
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
