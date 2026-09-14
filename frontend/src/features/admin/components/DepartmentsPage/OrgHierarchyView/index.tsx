import { useMemo, useState } from 'react'
import { List, Network, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useJobLevels } from '../../../hooks/use-job-levels'
import { ListView } from './ListView'
import { TreeView } from './TreeView'
import type { JobLevelOption } from './types'

export function OrgHierarchyView() {
  const [view, setView] = useState<'list' | 'tree'>('list')

  const { data: jobLevelsData } = useJobLevels({ Top: 100, NeedTotalCount: false })
  const jobLevels: JobLevelOption[] = useMemo(() =>
    (jobLevelsData?.items ?? [])
      .filter(jl => !jl.isDeleted)
      .sort((a, b) => a.levelOrder - b.levelOrder)
      .map(jl => ({ id: jl.id, levelName: jl.levelName })),
    [jobLevelsData],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center gap-2 px-3 h-11 border-b shrink-0 bg-card">
        <Network className="w-3.5 h-3.5 text-muted-foreground" />
        <h1 className="text-xs font-semibold">Cơ cấu tổ chức</h1>
        <div className="flex-1" />
        <div className="flex items-center rounded-md overflow-hidden border">
          <button
            type="button" onClick={() => setView('list')}
            aria-label="Danh sách"
            className={cn(
              'h-7 w-7 flex items-center justify-center transition-colors cursor-pointer',
              view === 'list' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-muted/50',
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button" onClick={() => setView('tree')}
            aria-label="Sơ đồ cây"
            className={cn(
              'h-7 w-7 flex items-center justify-center transition-colors cursor-pointer border-l',
              view === 'tree' ? 'bg-primary/10 text-primary' : 'bg-card text-muted-foreground hover:bg-muted/50',
            )}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 p-2 overflow-hidden">
        {view === 'list'
          ? <ListView jobLevels={jobLevels} />
          : <TreeView jobLevels={jobLevels} />
        }
      </div>
    </div>
  )
}
