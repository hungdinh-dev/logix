import { QuizType, QuestionType } from '../enums'

export interface IQuizQuestionOptionDTO {
  id: string
  content: string
  isCorrect?: boolean
  orderIndex: number
}

export interface IQuizQuestionDTO {
  id: string
  quizId: string
  questionText: string
  type: QuestionType | string
  points: number
  orderIndex: number
  options: IQuizQuestionOptionDTO[]
}

export interface IQuizDTO {
  id: string
  lessonId?: string | null
  courseId?: string | null
  title: string
  type: QuizType | string
  passingScore: number
  timeLimitMinutes?: number | null
  maxAttempts?: number | null
  questions?: IQuizQuestionDTO[]
}
