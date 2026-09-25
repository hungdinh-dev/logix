export type LessonType = 'VIDEO' | 'ARTICLE' | 'QUIZ'

export type QuizQuestionOption = {
  id: string
  text: string
  isCorrect: boolean
}

export type QuizQuestionItem = {
  id: string
  questionText: string
  questionType?: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE'
  explanation?: string | null
  options: QuizQuestionOption[]
}

export type ResourceType = 'EXTERNAL_LINK' | 'DOCUMENT_FILE'

export type ResourceAttachment = {
  id: string
  name: string
  url: string
  size?: string
  type?: ResourceType
  description?: string | null
  extension?: string | null
  fileSizeBytes?: number | null
}

export type TranscriptEntry = {
  id: string
  timestamp: string
  timestampSeconds: number
  text: string
}

export type LessonItem = {
  id: string
  title: string
  type: LessonType
  durationMinutes: number
  videoUrl?: string
  content?: string
  sopCode?: string
  allowSeeking?: boolean
  quizPassScore?: number
  quizTimeLimit?: number
  quizQuestions?: QuizQuestionItem[]
  resources?: ResourceAttachment[]
  transcripts?: TranscriptEntry[]
}

export type ModuleItem = {
  id: string
  title: string
  order: number
  lessons: LessonItem[]
}
