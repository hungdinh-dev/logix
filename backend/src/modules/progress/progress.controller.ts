import { Response } from 'express'
import { progressService } from './progress.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'

export class ProgressController {
  public getDashboardProgress = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error('Chưa xác thực', HttpStatus.UNAUTHORIZED))
    }
    const data = await progressService.getDashboardProgress(userId)
    return res.json(ApiResponse.success(data, 'Lấy tổng quan tiến độ học tập thành công'))
  }

  public getCourseProgress = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id
    const courseId = req.params.courseId
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error('Chưa xác thực', HttpStatus.UNAUTHORIZED))
    }
    const data = await progressService.getCourseProgress(userId, courseId)
    return res.json(ApiResponse.success(data, 'Lấy tiến độ và cấu trúc khóa học thành công'))
  }

  public updateLessonProgress = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error('Chưa xác thực', HttpStatus.UNAUTHORIZED))
    }
    const progress = await progressService.updateLessonProgress(userId, req.body)
    return res.json(ApiResponse.success(progress, 'Cập nhật tiến độ bài học thành công'))
  }

  public getAdminDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
    const data = await progressService.getAdminDashboardStats()
    return res.json(ApiResponse.success(data, 'Lấy dữ liệu thống kê Admin Dashboard thành công'))
  }
}

export const progressController = new ProgressController()

