import { Request, Response } from 'express'
import { authService } from './auth.service'
import { ApiResponse } from '../../common/responses/api-response'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'

export class AuthController {
  public login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body)
    return res.json(ApiResponse.success(result, 'Đăng nhập thành công'))
  }

  public refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    const result = await authService.refreshToken(refreshToken)
    return res.json(ApiResponse.success(result, 'Làm mới token thành công'))
  }

  public getProfile = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json(ApiResponse.error('Chưa xác thực', 401))
    }
    const result = await authService.getProfile(userId)
    return res.json(ApiResponse.success(result, 'Lấy thông tin người dùng thành công'))
  }

  public logout = async (req: AuthenticatedRequest, res: Response) => {
    const userAccountId = req.user?.userAccountId
    const userId = req.user?.id
    const result = await authService.logout(userAccountId, userId)
    return res.json(ApiResponse.success(result, 'Đăng xuất thành công'))
  }
}

export const authController = new AuthController()
