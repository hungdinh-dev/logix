import { Request, Response } from 'express'
import { lessonService } from './lesson.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'

export class LessonController {
  public getLessonById = async (req: Request, res: Response) => {
    const lesson = await lessonService.getLessonById(req.params.id)
    return res.json(ApiResponse.success(lesson, 'Lấy chi tiết bài học thành công'))
  }

  public createLesson = async (req: AuthenticatedRequest, res: Response) => {
    const lesson = await lessonService.createLesson(req.params.moduleId, req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(lesson, 'Tạo bài học mới thành công', HttpStatus.CREATED))
  }

  public updateLesson = async (req: AuthenticatedRequest, res: Response) => {
    const lesson = await lessonService.updateLesson(req.params.id, req.body)
    return res.json(ApiResponse.success(lesson, 'Cập nhật bài học thành công'))
  }

  public deleteLesson = async (req: AuthenticatedRequest, res: Response) => {
    const result = await lessonService.deleteLesson(req.params.id)
    return res.json(ApiResponse.success(result, 'Xóa bài học thành công'))
  }

  public reorderLessons = async (req: AuthenticatedRequest, res: Response) => {
    const lessons = await lessonService.reorderLessons(req.params.moduleId, req.body)
    return res.json(ApiResponse.success(lessons, 'Sắp xếp lại thứ tự bài học thành công'))
  }

  public parseYoutubeUrl = async (req: Request, res: Response) => {
    const result = lessonService.parseYoutubeUrl(req.body)
    return res.json(ApiResponse.success(result, 'Trích xuất video YouTube thành công'))
  }

  public getLessonResources = async (req: Request, res: Response) => {
    const resources = await lessonService.getLessonResources(req.params.id)
    return res.json(ApiResponse.success(resources, 'Lấy danh sách tài nguyên bài học thành công'))
  }

  public addLessonResource = async (req: AuthenticatedRequest, res: Response) => {
    const resource = await lessonService.addLessonResource(req.params.id, req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(resource, 'Thêm tài nguyên bài học thành công', HttpStatus.CREATED))
  }

  public updateLessonResource = async (req: AuthenticatedRequest, res: Response) => {
    const resource = await lessonService.updateLessonResource(req.params.resourceId, req.body)
    return res.json(ApiResponse.success(resource, 'Cập nhật tài nguyên bài học thành công'))
  }

  public deleteLessonResource = async (req: AuthenticatedRequest, res: Response) => {
    const result = await lessonService.deleteLessonResource(req.params.resourceId)
    return res.json(ApiResponse.success(result, 'Xóa tài nguyên bài học thành công'))
  }
}

export const lessonController = new LessonController()
