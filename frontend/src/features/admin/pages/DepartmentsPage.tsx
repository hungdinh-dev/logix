import { useState } from 'react'
import { Building2, List, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DeptListView, OrgHierarchyView } from '../components/DepartmentsPage'

export default function DepartmentsPage() {
  const [view, setView] = useState<'list' | 'org'>('list')

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background text-foreground">
      <div className="flex items-center gap-2 px-4 h-11 border-b shrink-0 bg-card">
        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
        <h1 className="text-xs font-semibold">Phòng ban</h1>
        <div className="flex-1" />
        <div className="flex items-center rounded-md overflow-hidden border">
          <button
            type="button" onClick={() => setView('list')}
            aria-label="Quản lý danh sách"
            className={cn(
              'h-7 px-3 flex items-center gap-1.5 text-xs transition-colors cursor-pointer',
              view === 'list' ? 'bg-primary/10 text-primary font-medium' : 'bg-card text-muted-foreground hover:bg-muted/50',
            )}
          >
            <List className="w-3.5 h-3.5" />
            Quản lý
          </button>
          <button
            type="button" onClick={() => setView('org')}
            aria-label="Cơ cấu tổ chức"
            className={cn(
              'h-7 px-3 flex items-center gap-1.5 text-xs transition-colors cursor-pointer border-l',
              view === 'org' ? 'bg-primary/10 text-primary font-medium' : 'bg-card text-muted-foreground hover:bg-muted/50',
            )}
          >
            <Share2 className="w-3.5 h-3.5" />
            Cơ cấu
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'list' ? <DeptListView /> : <OrgHierarchyView />}
      </div>
    </div>
  )
}
