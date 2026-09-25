export interface LessonCommentUser {
  id: string
  fullName: string
  employeeCode: string | null
  userType: string
  department?: {
    deptName: string
  } | null
}

export interface LessonCommentItem {
  id: string
  lessonId: string
  userId: string
  parentId: string | null
  replyToUserId?: string | null
  replyToUser?: {
    id: string
    fullName: string
  } | null
  content: string
  isInstructorReply: boolean
  isPinned: boolean
  likesCount: number
  hasLiked: boolean
  user: LessonCommentUser
  replies?: LessonCommentItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateCommentPayload {
  content: string
  parentId?: string | null
  replyToUserId?: string | null
}

export interface UpdateCommentPayload {
  content: string
}
