import { Request, Response } from 'express'
import { permissionModuleService } from './permission.service'
import { ApiResponse } from '../../common/responses/api-response'

export class PermissionController {
  public getAllPermissions = async (req: Request, res: Response) => {
    const permissions = await permissionModuleService.getAllPermissions()
    return res.json(ApiResponse.success(permissions, 'Lấy danh sách quyền thành công'))
  }
}

export const permissionController = new PermissionController()
