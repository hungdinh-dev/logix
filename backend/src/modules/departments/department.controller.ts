import { Request, Response } from 'express'
import { departmentService } from './department.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'

export class DepartmentController {
  public getDepartmentsList = async (req: Request, res: Response) => {
    const data = await departmentService.getDepartmentsList()
    return res.json(ApiResponse.success(data, 'Lấy danh sách phòng ban thành công'))
  }

  public getDepartmentTree = async (req: Request, res: Response) => {
    const tree = await departmentService.getDepartmentTree()
    return res.json(ApiResponse.success(tree, 'Lấy sơ đồ tổ chức phòng ban thành công'))
  }

  public createDepartment = async (req: Request, res: Response) => {
    const id = await departmentService.createDepartment(req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(id, 'Tạo phòng ban mới thành công', HttpStatus.CREATED))
  }

  public updateDepartment = async (req: Request, res: Response) => {
    await departmentService.updateDepartment(req.params.id, req.body)
    return res.json(ApiResponse.success(null, 'Cập nhật phòng ban thành công'))
  }

  public deleteDepartment = async (req: Request, res: Response) => {
    await departmentService.deleteDepartment(req.params.id)
    return res.json(ApiResponse.success(null, 'Xóa phòng ban thành công'))
  }

  public getDepartmentMembers = async (req: Request, res: Response) => {
    const members = await departmentService.getDepartmentMembers(req.params.departmentId)
    return res.json(ApiResponse.success(members, 'Lấy danh sách thành viên phòng ban thành công'))
  }
}

export const departmentController = new DepartmentController()
