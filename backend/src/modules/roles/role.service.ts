import prisma from '../../config/prisma'
import { invalidatePermissionCacheForRole, invalidatePermissionCacheForUser } from '../../services/permission.service'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { CreateRoleDto, UpdateRoleDto, SyncRoleUsersDto } from './role.dto'

export class RoleService {
  /**
   * Lấy danh sách tất cả các Role đang hoạt động (Ẩn các Role đã bị xóa mềm)
   */
  public async getAllRoles() {
    const roles = await prisma.role.findMany({
      where: { isActive: true },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return roles.map((r) => ({
      id: r.id,
      roleName: r.roleName,
      displayName: r.displayName,
      description: r.displayName,
      isSystemRole: r.isSystemRole,
      permissions: r.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        permissionCode: rp.permission.permissionCode,
        module: rp.permission.module,
        description: rp.permission.permissionName,
      })),
    }))
  }

  /**
   * Lấy chi tiết Role theo ID (Chỉ lấy nếu isActive = true)
   */
  public async getRoleById(id: string) {
    const role = await prisma.role.findFirst({
      where: { id, isActive: true },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    })

    if (!role) {
      throw new NotFoundError('Role')
    }

    return {
      id: role.id,
      roleName: role.roleName,
      displayName: role.displayName,
      description: role.displayName,
      isSystemRole: role.isSystemRole,
      permissions: role.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        permissionCode: rp.permission.permissionCode,
        module: rp.permission.module,
        description: rp.permission.permissionName,
      })),
    }
  }

  /**
   * Tạo Role mới (Hỗ trợ tái kích hoạt nếu roleName đã từng bị xóa mềm)
   */
  public async createRole(dto: CreateRoleDto) {
    const existing = await prisma.role.findUnique({
      where: { roleName: dto.roleName },
    })

    if (existing) {
      if (existing.isActive) {
        throw new BadRequestError('Mã vai trò đã tồn tại')
      }

      // Tái kích hoạt nếu vai trò trước đó đã bị xóa mềm
      const updated = await prisma.role.update({
        where: { id: existing.id },
        data: {
          displayName: dto.displayName || dto.roleName,
          isActive: true,
        },
      })
      return updated.id
    }

    const role = await prisma.role.create({
      data: {
        roleName: dto.roleName,
        displayName: dto.displayName || dto.roleName,
        isActive: true,
      },
    })
    return role.id
  }

  /**
   * Cập nhật Role (Chỉ áp dụng cho Role đang hoạt động)
   */
  public async updateRole(id: string, dto: UpdateRoleDto) {
    const existing = await prisma.role.findFirst({
      where: { id, isActive: true },
    })
    if (!existing) {
      throw new NotFoundError('Role')
    }

    await prisma.role.update({
      where: { id },
      data: {
        displayName: dto.displayName || dto.description,
      },
    })

    await invalidatePermissionCacheForRole(id)
  }

  /**
   * XÓA MỀM (Soft Delete): Đánh dấu isActive = false
   * Ẩn vai trò khỏi danh sách Frontend, vô hiệu hóa quyền hạn của user thuộc vai trò này nhưng vẫn bảo lưu dữ liệu
   */
  public async deleteRole(id: string) {
    const existing = await prisma.role.findUnique({ where: { id } })
    if (!existing || !existing.isActive) {
      throw new NotFoundError('Role')
    }

    if (existing.isSystemRole) {
      throw new BadRequestError('Không thể xóa vai trò hệ thống mặc định')
    }

    // Thực hiện Xóa mềm: Chuyển isActive sang false
    await prisma.role.update({
      where: { id },
      data: { isActive: false },
    })

    // Xóa cache quyền hạn của các User đang thuộc Role này để lập tức thu hồi quyền
    await invalidatePermissionCacheForRole(id)
  }

  public async assignPermissions(roleId: string, permissionIds: string[]) {
    const existing = await prisma.role.findFirst({
      where: { id: roleId, isActive: true },
    })
    if (!existing) {
      throw new NotFoundError('Role')
    }

    await prisma.rolePermission.deleteMany({ where: { roleId } })

    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((pId) => ({
          roleId,
          permissionId: pId,
        })),
      })
    }

    await invalidatePermissionCacheForRole(roleId)
  }

  public async getPermissionsByRoleId(roleId: string) {
    const existing = await prisma.role.findFirst({
      where: { id: roleId, isActive: true },
    })
    if (!existing) {
      throw new NotFoundError('Role')
    }

    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    })

    return rolePermissions.map((rp) => ({
      id: rp.permission.id,
      permissionCode: rp.permission.permissionCode,
      module: rp.permission.module,
      description: rp.permission.permissionName,
    }))
  }

  public async getUsersByRoleId(roleId: string) {
    const existing = await prisma.role.findFirst({
      where: { id: roleId, isActive: true },
    })
    if (!existing) {
      throw new NotFoundError('Role')
    }

    const userRoles = await prisma.userRole.findMany({
      where: { roleId, isActive: true },
      include: { user: true },
    })

    return userRoles.map((ur) => ({
      id: ur.user.id,
      fullName: ur.user.fullName,
      employeeCode: ur.user.employeeCode || '',
      email: ur.user.email || '',
      avatarUrl: undefined,
    }))
  }

  public async syncRoleUsers(roleId: string, dto: SyncRoleUsersDto) {
    const existing = await prisma.role.findFirst({
      where: { id: roleId, isActive: true },
    })
    if (!existing) {
      throw new NotFoundError('Role')
    }

    const { toAdd = [], toRemove = [], expiresAt } = dto

    if (toRemove.length > 0) {
      await prisma.userRole.deleteMany({
        where: {
          roleId,
          userId: { in: toRemove },
        },
      })
      toRemove.forEach((uId) => invalidatePermissionCacheForUser(uId))
    }

    if (toAdd.length > 0) {
      for (const userId of toAdd) {
        const existingUr = await prisma.userRole.findFirst({
          where: { userId, roleId },
        })

        if (existingUr) {
          await prisma.userRole.update({
            where: { id: existingUr.id },
            data: {
              isActive: true,
              revokedAt: null,
              expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
          })
        } else {
          await prisma.userRole.create({
            data: {
              userId,
              roleId,
              expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
          })
        }
        invalidatePermissionCacheForUser(userId)
      }
    }
  }
}

export const roleService = new RoleService()
