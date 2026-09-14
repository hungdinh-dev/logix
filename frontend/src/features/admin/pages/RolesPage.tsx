import { HRPageHeader } from '@/features/hr/components/HRPageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRoles } from '../hooks/use-roles'
import { usePermissions } from '../hooks/use-permissions'
import { PermissionsTab, RolesTab } from '../components/RolesPage'

export default function RolesPage() {
  const { data: roles = [], isLoading: rolesLoading } = useRoles()
  const { data: permissions = [], isLoading: permissionsLoading } = usePermissions()

  return (
    <div className="min-h-full bg-background text-foreground">
      <HRPageHeader breadcrumbs={[{ label: 'Admin' }, { label: 'Vai trò & Quyền hạn', isActive: true }]} />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs defaultValue="roles" className="flex-col gap-5">
          <TabsList variant="line" className="w-full justify-start border-b rounded-none pb-0 gap-0">
            <TabsTrigger value="roles" className="px-4 pb-2.5 rounded-none">Vai trò</TabsTrigger>
            <TabsTrigger value="permissions" className="px-4 pb-2.5 rounded-none">Quyền hạn</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-0">
            <RolesTab roles={roles} isLoading={rolesLoading} />
          </TabsContent>

          <TabsContent value="permissions" className="mt-0">
            <PermissionsTab permissions={permissions} isLoading={permissionsLoading} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
