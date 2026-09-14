import { Request, Response } from 'express'
import { quizService } from './quiz.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'

export class QuizController {
  // Lấy Quiz theo Lesson ID
  public getQuizByLessonId = async (req: Request, res: Response) => {
    const quiz = await quizService.getQuizByLessonId(req.params.lessonId)
    return res.json(ApiResponse.success(quiz, 'Lấy thông tin đề thi thành công'))
  }

  // Lấy chi tiết Quiz theo Quiz ID
  public getQuizById = async (req: Request, res: Response) => {
    const quiz = await quizService.getQuizById(req.params.id)
    return res.json(ApiResponse.success(quiz, 'Lấy chi tiết bài kiểm tra thành công'))
  }

  // Cập nhật cấu hình đề thi
  public updateQuizConfig = async (req: AuthenticatedRequest, res: Response) => {
    const quiz = await quizService.updateQuizConfig(req.params.id, req.body)
    return res.json(ApiResponse.success(quiz, 'Cập nhật cấu hình đề thi thành công'))
  }

  // Thêm câu hỏi mới vào đề thi
  public createQuestion = async (req: AuthenticatedRequest, res: Response) => {
    const question = await quizService.createQuestion(req.params.quizId, req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(question, 'Thêm câu hỏi mới thành công', HttpStatus.CREATED))
  }

  // Sửa câu hỏi
  public updateQuestion = async (req: AuthenticatedRequest, res: Response) => {
    const question = await quizService.updateQuestion(req.params.questionId, req.body)
    return res.json(ApiResponse.success(question, 'Cập nhật câu hỏi thành công'))
  }

  // Xóa câu hỏi
  public deleteQuestion = async (req: AuthenticatedRequest, res: Response) => {
    const result = await quizService.deleteQuestion(req.params.questionId)
    return res.json(ApiResponse.success(result, 'Xóa câu hỏi thành công'))
  }

  // Sắp xếp lại thứ tự câu hỏi
  public reorderQuestions = async (req: AuthenticatedRequest, res: Response) => {
    const questions = await quizService.reorderQuestions(req.params.quizId, req.body)
    return res.json(ApiResponse.success(questions, 'Sắp xếp lại thứ tự câu hỏi thành công'))
  }

  // Preview đề thi
  public getQuizPreview = async (req: Request, res: Response) => {
    const preview = await quizService.getQuizPreview(req.params.id)
    return res.json(ApiResponse.success(preview, 'Xem trước đề thi thành công'))
  }
}

export const quizController = new QuizController()
