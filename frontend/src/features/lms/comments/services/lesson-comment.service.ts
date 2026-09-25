import { api } from '@/lib/axios'
import type {
  LessonCommentItem,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '../types/lesson-comment.types'

export const lessonCommentService = {
  async getComments(lessonId: string): Promise<LessonCommentItem[]> {
    const res = await api.get(`/api/lessons/${lessonId}/comments`)
    return res.data?.data || []
  },

  async createComment(
    lessonId: string,
    payload: CreateCommentPayload
  ): Promise<LessonCommentItem> {
    const res = await api.post(`/api/lessons/${lessonId}/comments`, payload)
    return res.data?.data
  },

  async updateComment(
    lessonId: string,
    commentId: string,
    payload: UpdateCommentPayload
  ): Promise<LessonCommentItem> {
    const res = await api.put(
      `/api/lessons/${lessonId}/comments/${commentId}`,
      payload
    )
    return res.data?.data
  },

  async deleteComment(
    lessonId: string,
    commentId: string
  ): Promise<{ id: string; parentId: string | null }> {
    const res = await api.delete(
      `/api/lessons/${lessonId}/comments/${commentId}`
    )
    return res.data?.data
  },

  async toggleLike(
    lessonId: string,
    commentId: string
  ): Promise<{ hasLiked: boolean; likesCount: number }> {
    const res = await api.post(
      `/api/lessons/${lessonId}/comments/${commentId}/like`
    )
    return res.data?.data
  },

  async togglePin(
    lessonId: string,
    commentId: string,
    isPinned?: boolean
  ): Promise<LessonCommentItem> {
    const res = await api.post(
      `/api/lessons/${lessonId}/comments/${commentId}/pin`,
      { isPinned }
    )
    return res.data?.data
  },
}
