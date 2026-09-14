import { useCallback, useState } from 'react'
import { List, Minus, Network, Plus, Search, Share2 } from 'lucide-react'
import { OrgChartTree, type RenderNodeProps } from '@/features/hr/components/orgchart/OrgChartTree'
import { cn } from '@/lib/utils'
import { RoleHierarchyNode } from '../components/RoleHierarchyPage/RoleHierarchyNode'
import { RoleHierarchySheet } from '../components/RoleHierarchyPage/RoleHierarchySheet'
import { DEFAULT_EXPANDED_ROLE_IDS, ROLE_TREE } from '../components/RoleHierarchyPage/role-hierarchy.data'
import type { RoleNode } from '../types/admin.types'

function renderRoleNode(props: RenderNodeProps<RoleNode>) {
  return <RoleHierarchyNode {...props} />
}

export default function RoleHierarchyPage() {
  const [scale,        setScale]        = useState(1)
  const [expandedIds,  setExpandedIds]  = useState<Set<string>>(new Set(DEFAULT_EXPANDED_ROLE_IDS))
  const [selectedRole, setSelectedRole] = useState<RoleNode | null>(null)
  const [sheetOpen,    setSheetOpen]    = useState(false)
  const [viewMode,     setViewMode]     = useState<'tree' | 'list'>('tree')
  const [search,       setSearch]       = useState('')
  const [focusId,      setFocusId]      = useState<string | null>(null)

  const handleSelect = useCallback((role: RoleNode) => {
    setSelectedRole(role)
    setSheetOpen(true)
  }, [])

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleFocusNode = useCallback((id: string) => {
    setFocusId(id)
    setExpandedIds(new Set(DEFAULT_EXPANDED_ROLE_IDS))
  }, [])

  const zoomIn  = () => setScale(s => Math.min(2,   Math.round((s + 0.1) * 10) / 10))
  const zoomOut = () => setScale(s => Math.max(0.3, Math.round((s - 0.1) * 10) / 10))

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <div className="flex flex-col flex-1 p-6 gap-4 overflow-hidden">

        {/* Toolbar */}
        <div className="bg-card rounded-xl shadow-sm p-4 flex items-center gap-3 flex-wrap shrink-0 border border-border">
          <div className="flex items-center gap-2 mr-2">
            <Network className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Phân cấp vai trò</h1>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 text-sm w-56">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm vai trò..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg overflow-hidden border border-border">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={cn(
                'h-9 w-9 flex items-center justify-center transition-colors cursor-pointer',
                viewMode === 'tree' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground',
              )}
              aria-label="Dạng cây"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'h-9 w-9 flex items-center justify-center transition-colors cursor-pointer border-l border-border',
                viewMode === 'list' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground',
              )}
              aria-label="Dạng danh sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center rounded-lg overflow-hidden border border-border">
            <button
              type="button"
              onClick={zoomOut}
              className="h-9 w-9 flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground"
              aria-label="Thu nhỏ"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium text-muted-foreground px-2 min-w-[44px] text-center select-none">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="h-9 w-9 flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground border-l border-border"
              aria-label="Phóng to"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart area */}
        <div className="flex-1 bg-card rounded-xl shadow-sm overflow-hidden relative border border-border">
          <OrgChartTree
            tree={ROLE_TREE}
            renderNode={renderRoleNode}
            selectedId={selectedRole?.id ?? null}
            expandedIds={expandedIds}
            onSelect={handleSelect}
            onToggle={handleToggle}
            scale={scale}
            onZoomChange={setScale}
            editMode={false}
            focusId={focusId}
          />
        </div>
      </div>

      <RoleHierarchySheet
        role={selectedRole}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onFocusNode={handleFocusNode}
      />
    </div>
  )
}
