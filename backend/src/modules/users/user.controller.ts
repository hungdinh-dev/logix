import { Request, Response } from 'express'
import { userService } from './user.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'

export class UserController {
  public getAllUsers = async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined
    const users = await userService.getAllUsers(search)
    return res.json(ApiResponse.success(users, 'Lấy danh sách người dùng thành công'))
  }

  public createUser = async (req: Request, res: Response) => {
    const userId = await userService.createUser(req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(userId, 'Tạo người dùng thành công', HttpStatus.CREATED))
  }
}

export const userController = new UserController()
