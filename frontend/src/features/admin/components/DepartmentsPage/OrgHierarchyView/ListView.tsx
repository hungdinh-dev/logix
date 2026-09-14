import { useMemo, useState } from 'react'
import { Building2, ChevronRight, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useDepartmentTree } from '../../../hooks/use-departments'
import type { DepartmentTreeResponse } from '../../../types/admin.types'
import { MembersContent } from './MembersPanel'
import type { JobLevelOption } from './types'

function DeptTreeNode({ dept, selectedId, onSelect, depth = 0 }: {
  dept: DepartmentTreeResponse
  selectedId: string | null
  onSelect: (d: DepartmentTreeResponse) => void
  depth?: number
}) {
  const [expanded, setExpanded] = useState(depth === 0)
  const hasChildren = dept.children.length > 0

  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(dept)}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={cn(
          'w-full flex items-center gap-1 py-1.5 pr-2 text-xs text-left rounded-sm cursor-pointer',
          'hover:bg-muted/50 transition-colors',
          selectedId === dept.id && 'bg-primary/10 text-primary font-medium',
        )}
      >
        {hasChildren ? (
          <span
            role="button" tabIndex={-1}
            onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
            className="shrink-0 p-0.5 hover:bg-muted rounded cursor-pointer"
          >
            <ChevronRight className={cn('w-3 h-3 text-muted-foreground transition-transform duration-150', expanded && 'rotate-90')} />
          </span>
        ) : <span className="w-4 shrink-0" />}
        <Building2 className="w-3 h-3 shrink-0 text-muted-foreground" />
        <span className="truncate flex-1">{dept.departmentName}</span>
        {hasChildren && <span className="text-[9px] text-muted-foreground tabular-nums">{dept.children.length}</span>}
      </button>
      {expanded && hasChildren && dept.children.map(c => (
        <DeptTreeNode key={c.id} dept={c} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  )
}

export function ListView({ jobLevels }: { jobLevels: JobLevelOption[] }) {
  const [selectedDept, setSelectedDept] = useState<DepartmentTreeResponse | null>(null)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const { data: tree, isLoading } = useDepartmentTree()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const filter = (nodes: DepartmentTreeResponse[]): DepartmentTreeResponse[] =>
      nodes.map(n => ({ ...n, children: filter(n.children) }))
        .filter(n => !q || n.departmentName.toLowerCase().includes(q) || n.departmentCode.toLowerCase().includes(q) || n.children.length > 0)
    return filter(tree ?? [])
  }, [tree, search])

  return (
    <div className="flex flex-1 gap-2 overflow-hidden">
      <div className="w-56 shrink-0 flex flex-col bg-card border rounded-lg overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 py-2 border-b shrink-0">
          <svg className="w-3 h-3 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm phòng ban..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-1">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full mb-0.5" />)
            : filtered.length === 0
              ? <p className="text-[11px] text-muted-foreground text-center py-6">Không tìm thấy</p>
              : filtered.map(d => <DeptTreeNode key={d.id} dept={d} selectedId={selectedDept?.id ?? null} onSelect={setSelectedDept} />)
          }
        </div>
      </div>

      {selectedDept ? (
        <div className="flex-1 flex flex-col bg-card border rounded-lg overflow-hidden min-w-0">
          <MembersContent dept={selectedDept} jobLevels={jobLevels} addOpen={addOpen} onAddOpenChange={setAddOpen} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-card border rounded-lg border-dashed">
          <div className="text-center space-y-1.5">
            <Users className="w-8 h-8 text-muted-foreground/25 mx-auto" />
            <p className="text-xs text-muted-foreground">Chọn phòng ban để xem thành viên</p>
          </div>
        </div>
      )}
    </div>
  )
}
