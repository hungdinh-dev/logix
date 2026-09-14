import { useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteJobLevel, useJobLevels } from '../hooks/use-job-levels'
import { SCOPE_TYPE_LABELS, type JobLevelResponse, type ScopeType } from '../types/admin.types'
import { JobLevelDialog } from '../components/JobLevelsPage/JobLevelDialog'

const SCOPE_BADGE_STYLE: Record<ScopeType, string> = {
  1: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  2: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  3: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800',
  4: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
}

function formatSalary(value: number | undefined) {
  if (value == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
}

export default function JobLevelsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editLevel, setEditLevel] = useState<JobLevelResponse | undefined>()

  const { data, isLoading } = useJobLevels({ Top: 100, NeedTotalCount: true })
  const deleteJobLevel = useDeleteJobLevel()

  const levels = (data?.items ?? []).sort((a, b) => a.levelOrder - b.levelOrder)

  const openCreate = () => { setEditLevel(undefined); setDialogOpen(true) }
  const openEdit = (level: JobLevelResponse) => { setEditLevel(level); setDialogOpen(true) }

  const handleDelete = (level: JobLevelResponse) => {
    if (!confirm(`Xóa cấp bậc "${level.levelName}"?`)) return
    deleteJobLevel.mutate(level.id)
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Job Levels', isActive: true }]} />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Cấp bậc</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data?.totalCount ?? 0} cấp bậc</p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Thêm cấp bậc
          </Button>
        </div>

        <div className="rounded-lg border bg-card overflow-auto max-h-full min-h-0">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Phạm vi</TableHead>
                <TableHead>Khoảng lương</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-[80px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : levels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    Không có cấp bậc nào
                  </TableCell>
                </TableRow>
              ) : (
                levels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell className="text-muted-foreground text-sm tabular-nums">{level.levelOrder}</TableCell>
                    <TableCell className="font-medium">{level.levelName}</TableCell>
                    <TableCell>
                      <Badge className={SCOPE_BADGE_STYLE[level.defaultScopeType]}>
                        {SCOPE_TYPE_LABELS[level.defaultScopeType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {level.baseSalaryMin != null || level.baseSalaryMax != null
                        ? `${formatSalary(level.baseSalaryMin)} – ${formatSalary(level.baseSalaryMax)}`
                        : '—'
                      }
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {level.description ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(level)} aria-label={`Edit ${level.levelName}`}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(level)} aria-label={`Delete ${level.levelName}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <JobLevelDialog open={dialogOpen} jobLevel={editLevel} onOpenChange={setDialogOpen} />
    </div>
  )
}
