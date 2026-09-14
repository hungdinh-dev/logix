import { Request, Response } from 'express'
import { roleService } from './role.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'

export class RoleController {
  public getAllRoles = async (req: Request, res: Response) => {
    const roles = await roleService.getAllRoles()
    return res.json(ApiResponse.success(roles, 'Lấy danh sách vai trò thành công'))
  }

  public getRoleById = async (req: Request, res: Response) => {
    const role = await roleService.getRoleById(req.params.id)
    return res.json(ApiResponse.success(role, 'Lấy chi tiết vai trò thành công'))
  }

  public createRole = async (req: Request, res: Response) => {
    const roleId = await roleService.createRole(req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(roleId, 'Tạo vai trò mới thành công', HttpStatus.CREATED))
  }

  public updateRole = async (req: Request, res: Response) => {
    await roleService.updateRole(req.params.id, req.body)
    return res.json(ApiResponse.success(null, 'Cập nhật vai trò thành công'))
  }

  public deleteRole = async (req: Request, res: Response) => {
    await roleService.deleteRole(req.params.id)
    return res.json(ApiResponse.success(null, 'Xóa vai trò thành công'))
  }

  public assignPermissions = async (req: Request, res: Response) => {
    await roleService.assignPermissions(req.params.id, req.body.permissionIds)
    return res.json(ApiResponse.success(null, 'Gán quyền cho vai trò thành công'))
  }

  public getPermissionsByRoleId = async (req: Request, res: Response) => {
    const permissions = await roleService.getPermissionsByRoleId(req.params.roleId)
    return res.json(ApiResponse.success(permissions, 'Lấy danh sách quyền của vai trò thành công'))
  }

  public getUsersByRoleId = async (req: Request, res: Response) => {
    const users = await roleService.getUsersByRoleId(req.params.roleId)
    return res.json(ApiResponse.success(users, 'Lấy danh sách nhân sự của vai trò thành công'))
  }

  public syncRoleUsers = async (req: Request, res: Response) => {
    await roleService.syncRoleUsers(req.params.roleId, req.body)
    return res.json(ApiResponse.success(null, 'Cập nhật danh sách nhân sự thành công'))
  }
}

export const roleController = new RoleController()
