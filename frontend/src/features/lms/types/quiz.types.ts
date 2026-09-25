export type BackendQuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'

export type QuestionType =
  | 'single-choice'
  | 'multiple-choice'
  | 'true-false'
  | 'text-input'

export interface AnswerOption {
  readonly id: string
  readonly letter: string
  readonly text: string
  readonly isCorrect?: boolean
}

export interface QuizOptionData {
  id: string
  letter: string
  optionText: string
  sortOrder?: number
  isCorrect?: boolean
}

export interface QuizQuestionData {
  id: string
  number: number
  questionText: string
  questionType: BackendQuestionType
  points: number
  sortOrder?: number
  explanation?: string | null
  options: QuizOptionData[]
  earnedPoints?: number
  isCorrect?: boolean
  userAnswer?: {
    selectedOptionId?: string | null
    selectedOptionIds?: string[]
    textAnswer?: string | null
  }
}

export interface QuizQuestion {
  readonly id: string
  readonly number: number
  readonly type: QuestionType
  readonly points: number
  readonly text: string
  readonly hasImage?: boolean
  readonly options?: readonly AnswerOption[]
  readonly correctOptionId?: string
  readonly explanation?: string | null
  readonly isCorrect?: boolean
}

export interface QuizMeta {
  id: string
  lessonId?: string
  title: string
  description?: string | null
  passScore?: number
  maxAttempts?: number
  timeLimitMinutes?: number | null
  shuffleQuestions?: boolean
  showAnswerFeedback?: boolean
  totalQuestions: number
  totalPoints?: number
  courseName?: string
  durationSeconds?: number
  course?: {
    id: string
    title: string
    code: string
  }
  module?: {
    id: string
    title: string
  }
  lesson?: {
    id: string
    title: string
  }
}

export interface QuizStudentStatus {
  isEnrolled: boolean
  attemptCount: number
  remainingAttempts: number | null
  highestScore: number | null
  isPassed: boolean
  canAttempt: boolean
  previousAttempts: Array<{
    id: string
    attemptNumber: number
    score: number
    isPassed: boolean
    startedAt: string
    submittedAt: string | null
  }>
}

export interface QuizTakeResponse {
  quiz: QuizMeta
  studentStatus: QuizStudentStatus
  questions: QuizQuestionData[]
}

export interface QuizSubmitAnswerItem {
  questionId: string
  selectedOptionId?: string | null
  selectedOptionIds?: string[]
  textAnswer?: string | null
}

export interface QuizSubmitPayload {
  answers: QuizSubmitAnswerItem[]
  timeSpentSeconds?: number
}

export interface QuizSubmitResult {
  attemptId: string
  attemptNumber: number
  score: number
  passScore: number
  isPassed: boolean
  totalPointsEarned: number
  totalPointsPossible: number
  totalQuestions: number
  correctCount: number
  incorrectCount: number
  maxAttempts: number
  remainingAttempts: number | null
  showAnswerFeedback: boolean
  courseId: string
  courseTitle: string
  lessonId: string
  lessonTitle: string
  reviewQuestions: QuizQuestionData[]
  nextLesson?: {
    id: string
    title: string
    lessonType: string
  } | null
  isCourseCompleted: boolean
}
