import { useState } from 'react'
import type { RoleResponse } from '../../types/admin.types'
import { RoleDeleteDialog } from './RoleDeleteDialog'
import { RoleDialog } from './RoleDialog'
import { RolesTable } from './RolesTable'
import { RolesToolbar, type TypeFilter } from './RolesToolbar'
import { PermissionsSheet } from './PermissionsSheet'
import { AssignUsersSheet } from './AssignUsersSheet'

interface RolesTabProps {
  roles: RoleResponse[]
  isLoading: boolean
}

export function RolesTab({ roles, isLoading }: RolesTabProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editRole, setEditRole] = useState<RoleResponse | undefined>()
  const [permSheet, setPermSheet] = useState<RoleResponse | undefined>()
  const [usersSheet, setUsersSheet] = useState<RoleResponse | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<RoleResponse | null>(null)

  const isFiltering = typeFilter !== 'all' || search.trim().length > 0

  const filtered = roles.filter((r) => {
    if (search && !r.roleName.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter === 'system' && !r.isSystemRole) return false
    if (typeFilter === 'custom' && r.isSystemRole) return false
    return true
  })

  return (
    <div className="space-y-5">
      <RolesToolbar
        count={filtered.length}
        search={search}
        typeFilter={typeFilter}
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
        onCreateClick={() => { setEditRole(undefined); setDialogOpen(true) }}
      />

      <RolesTable
        roles={filtered}
        isLoading={isLoading}
        isFiltering={isFiltering}
        onEdit={(role) => { setEditRole(role); setDialogOpen(true) }}
        onDelete={setDeleteTarget}
        onPermissions={setPermSheet}
        onUsers={setUsersSheet}
      />

      <RoleDialog open={dialogOpen} role={editRole} onOpenChange={setDialogOpen} />

      <PermissionsSheet
        open={!!permSheet}
        role={permSheet}
        onOpenChange={(open) => { if (!open) setPermSheet(undefined) }}
      />

      <AssignUsersSheet
        open={!!usersSheet}
        role={usersSheet}
        onOpenChange={(open) => { if (!open) setUsersSheet(undefined) }}
      />

      <RoleDeleteDialog role={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  )
}
