import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { lessonCommentService } from '../services/lesson-comment.service'
import type {
  LessonCommentItem,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '../types/lesson-comment.types'

export const commentKeys = {
  all: ['lesson-comments'] as const,
  lesson: (lessonId: string) => [...commentKeys.all, lessonId] as const,
}

export function useLessonComments(lessonId: string) {
  return useQuery({
    queryKey: commentKeys.lesson(lessonId),
    queryFn: () => lessonCommentService.getComments(lessonId),
    enabled: Boolean(lessonId),
    staleTime: 1000 * 30, // 30 seconds
  })
}

export function useCreateComment(lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      lessonCommentService.createComment(lessonId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lesson(lessonId) })
      toast.success(
        variables.parentId ? 'Đã gửi câu trả lời!' : 'Đã đăng bình luận thành công!'
      )
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Không thể gửi bình luận. Vui lòng thử lại!'
      )
    },
  })
}

export function useUpdateComment(lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string
      payload: UpdateCommentPayload
    }) => lessonCommentService.updateComment(lessonId, commentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lesson(lessonId) })
      toast.success('Đã cập nhật bình luận!')
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Không thể cập nhật bình luận. Vui lòng thử lại!'
      )
    },
  })
}

export function useDeleteComment(lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) =>
      lessonCommentService.deleteComment(lessonId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lesson(lessonId) })
      toast.success('Đã xóa bình luận thành công!')
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Không thể xóa bình luận. Vui lòng thử lại!'
      )
    },
  })
}

export function useToggleLike(lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) =>
      lessonCommentService.toggleLike(lessonId, commentId),
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.lesson(lessonId) })
      const previousComments = queryClient.getQueryData<LessonCommentItem[]>(
        commentKeys.lesson(lessonId)
      )

      if (previousComments) {
        const updateLikeInTree = (items: LessonCommentItem[]): LessonCommentItem[] => {
          return items.map((item) => {
            if (item.id === commentId) {
              const nextHasLiked = !item.hasLiked
              return {
                ...item,
                hasLiked: nextHasLiked,
                likesCount: nextHasLiked
                  ? item.likesCount + 1
                  : Math.max(0, item.likesCount - 1),
              }
            }
            if (item.replies && item.replies.length > 0) {
              return {
                ...item,
                replies: updateLikeInTree(item.replies),
              }
            }
            return item
          })
        }

        queryClient.setQueryData<LessonCommentItem[]>(
          commentKeys.lesson(lessonId),
          updateLikeInTree(previousComments)
        )
      }

      return { previousComments }
    },
    onError: (_err, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.lesson(lessonId),
          context.previousComments
        )
      }
      toast.error('Lỗi khi cập nhật lượt thích!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lesson(lessonId) })
    },
  })
}

export function useTogglePin(lessonId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, isPinned }: { commentId: string; isPinned?: boolean }) =>
      lessonCommentService.togglePin(lessonId, commentId, isPinned),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lesson(lessonId) })
      toast.success(
        data.isPinned ? 'Đã ghim bình luận lên đầu trang!' : 'Đã bỏ ghim bình luận!'
      )
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Không thể thay đổi trạng thái ghim!'
      )
    },
  })
}
