import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type {
  QuizTakeResponse,
  QuizSubmitPayload,
  QuizSubmitResult,
} from '../types/quiz.types'

export const quizService = {
  /**
   * Lấy đề thi thực tế cho học viên làm bài (LMS-065)
   * Hỗ trợ truyền vào quizId hoặc lessonId
   */
  getQuizForTake: async (quizOrLessonId: string): Promise<QuizTakeResponse> => {
    const res = await api.get(apiRoutes.quizzes.take(quizOrLessonId))
    return res.data?.data
  },

  /**
   * Nộp bài kiểm tra trắc nghiệm (LMS-066)
   */
  submitQuiz: async (
    quizOrLessonId: string,
    payload: QuizSubmitPayload
  ): Promise<QuizSubmitResult> => {
    const res = await api.post(apiRoutes.quizzes.submit(quizOrLessonId), payload)
    return res.data?.data
  },

  /**
   * Lấy lịch sử các lần thi của học viên (LMS-069)
   */
  getQuizAttempts: async (quizOrLessonId: string) => {
    const res = await api.get(apiRoutes.quizzes.attempts(quizOrLessonId))
    return res.data?.data
  },

  /**
   * Lấy chi tiết Quiz theo ID
   */
  getQuizById: async (quizId: string) => {
    const res = await api.get(apiRoutes.quizzes.byId(quizId))
    return res.data?.data
  },

  /**
   * Lấy Quiz theo Lesson ID
   */
  getQuizByLessonId: async (lessonId: string) => {
    const res = await api.get(apiRoutes.quizzes.byLessonId(lessonId))
    return res.data?.data
  },
}
