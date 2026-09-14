import prisma from '../../config/prisma'

export class PermissionModuleService {
  public async getAllPermissions() {
    const permissions = await prisma.permission.findMany({
      where: { isActive: true },
      orderBy: { permissionCode: 'asc' },
    })

    return permissions.map((p) => ({
      id: p.id,
      permissionCode: p.permissionCode,
      module: p.module,
      description: p.permissionName,
    }))
  }
}

export const permissionModuleService = new PermissionModuleService()
