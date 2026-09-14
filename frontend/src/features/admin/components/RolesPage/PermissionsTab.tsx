import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { PermissionResponse } from '../../types/admin.types'

interface PermissionsTabProps {
  permissions: PermissionResponse[]
  isLoading: boolean
}

export function PermissionsTab({ permissions, isLoading }: PermissionsTabProps) {
  const [search, setSearch] = useState('')

  // ponytail: BE has no search param — filter client-side
  const filtered = permissions.filter(
    (p) => !search || p.permissionCode.toLowerCase().includes(search.toLowerCase()),
  )

  const grouped = filtered.reduce<Record<string, PermissionResponse[]>>((acc, p) => {
    const resource = p.permissionCode.split(':')[0] ?? 'other'
    ;(acc[resource] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Quyền hạn</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Tự động từ API · {filtered.length} quyền</p>
        </div>
        <Input
          placeholder="Tìm quyền hạn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-56"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="rounded-lg border bg-card py-12 text-center text-sm text-muted-foreground">
          Không có quyền nào. Khởi động API để tự động tạo quyền.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([resource, perms]) => (
            <div key={resource} className="rounded-lg border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{resource}</span>
                <Badge variant="secondary" className="text-[10px]">{perms.length}</Badge>
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
                  {perms.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.permissionCode}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.permissionCode.split(':')[1] ?? ''}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.description ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
