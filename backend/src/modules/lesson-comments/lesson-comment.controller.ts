import { Response } from 'express'
import { lessonCommentService } from './lesson-comment.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'

export class LessonCommentController {
  public getComments = async (req: AuthenticatedRequest, res: Response) => {
    const comments = await lessonCommentService.getComments(
      req.params.lessonId,
      req.user?.id
    )
    return res.json(
      ApiResponse.success(comments, 'Lấy danh sách bình luận thành công')
    )
  }

  public createComment = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error('Vui lòng đăng nhập để bình luận', HttpStatus.UNAUTHORIZED))
    }

    const comment = await lessonCommentService.createComment(
      req.params.lessonId,
      req.user.id,
      req.body
    )

    return res
      .status(HttpStatus.CREATED)
      .json(
        ApiResponse.success(
          comment,
          'Thêm bình luận thành công',
          HttpStatus.CREATED
        )
      )
  }

  public updateComment = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error('Vui lòng đăng nhập', HttpStatus.UNAUTHORIZED))
    }

    const updated = await lessonCommentService.updateComment(
      req.params.commentId,
      req.user.id,
      req.body.content
    )

    return res.json(
      ApiResponse.success(updated, 'Cập nhật bình luận thành công')
    )
  }

  public deleteComment = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error('Vui lòng đăng nhập', HttpStatus.UNAUTHORIZED))
    }

    const result = await lessonCommentService.deleteComment(
      req.params.commentId,
      req.user.id
    )

    return res.json(
      ApiResponse.success(result, 'Xóa bình luận thành công')
    )
  }

  public toggleLike = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error('Vui lòng đăng nhập để thích bình luận', HttpStatus.UNAUTHORIZED))
    }

    const result = await lessonCommentService.toggleLike(
      req.params.commentId,
      req.user.id
    )

    return res.json(
      ApiResponse.success(result, 'Cập nhật lượt thích thành công')
    )
  }

  public togglePin = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponse.error('Vui lòng đăng nhập', HttpStatus.UNAUTHORIZED))
    }

    const result = await lessonCommentService.togglePin(
      req.params.commentId,
      req.user.id,
      req.body.isPinned
    )

    return res.json(
      ApiResponse.success(result, 'Cập nhật trạng thái ghim thành công')
    )
  }
}

export const lessonCommentController = new LessonCommentController()
