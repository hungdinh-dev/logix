import { useState } from 'react'
import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissions } from '../hooks/use-permissions'

export default function PermissionsPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = usePermissions()

  // ponytail: BE GetPermissions has no server-side search — filter client-side
  const filtered = (data ?? []).filter(
    (permission) => !search || permission.permissionCode.toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, p) => {
    const resource = p.permissionCode.split(':')[0] ?? 'other'
    ;(acc[resource] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <HRPageHeader
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Phân quyền', isActive: true },
        ]}
      />

      <div className="flex flex-col flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 md:px-8 py-5 gap-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Quyền hạn</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tự động từ API · {filtered.length} quyền
            </p>
          </div>
          <Input
            placeholder="Tìm quyền hạn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
          />
        </div>

        <div className="overflow-auto flex-1 min-h-0">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([resource, permissions]) => (
              <div key={resource} className="rounded-lg border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{resource}</span>
                  <Badge variant="secondary" className="text-[10px]">{permissions.length}</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã quyền</TableHead>
                      <TableHead>Hành động</TableHead>
                      <TableHead>Mô tả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => {
                      const action = permission.permissionCode.split(':')[1] ?? ''
                      return (
                        <TableRow key={permission.id}>
                          <TableCell className="font-mono text-sm">{permission.permissionCode}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{action}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{permission.description ?? '—'}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
            {Object.keys(grouped).length === 0 && (
              <div className="rounded-lg border bg-card py-12 text-center text-sm text-muted-foreground">
                Không có quyền nào. Khởi động API để tự động tạo quyền.
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
