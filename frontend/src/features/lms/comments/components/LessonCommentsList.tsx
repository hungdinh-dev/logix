'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Send,
  Loader2,
  RefreshCw,
  AlertCircle,
  LogIn,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  useLessonComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useToggleLike,
  useTogglePin,
} from '../hooks/use-lesson-comments'
import { LessonCommentItem } from './LessonCommentItem'

interface LessonCommentsListProps {
  lessonId: string
}

export function LessonCommentsList({ lessonId }: LessonCommentsListProps) {
  const { user, isAuthenticated, role } = useAuth()
  const [newCommentText, setNewCommentText] = useState('')

  const {
    data: comments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useLessonComments(lessonId)

  const createCommentMutation = useCreateComment(lessonId)
  const updateCommentMutation = useUpdateComment(lessonId)
  const deleteCommentMutation = useDeleteComment(lessonId)
  const toggleLikeMutation = useToggleLike(lessonId)
  const togglePinMutation = useTogglePin(lessonId)

  const roleCode = typeof role === 'string' ? role.toUpperCase() : ''
  const isPrivilegedUser = Boolean(
    roleCode === 'ADMIN' ||
      roleCode === 'TRAINER' ||
      roleCode === 'INSTRUCTOR' ||
      (user as any)?.userType === 'ADMIN' ||
      (user as any)?.userType === 'SYSTEM_ADMIN'
  )

  const handleCreateTopComment = async () => {
    if (!newCommentText.trim() || createCommentMutation.isPending) return

    await createCommentMutation.mutateAsync({
      content: newCommentText.trim(),
    })
    setNewCommentText('')
  }

  const handleReply = async (
    parentId: string,
    content: string,
    replyToUserId?: string
  ) => {
    await createCommentMutation.mutateAsync({
      parentId,
      content,
      replyToUserId,
    })
  }

  const handleEdit = async (commentId: string, content: string) => {
    await updateCommentMutation.mutateAsync({
      commentId,
      payload: { content },
    })
  }

  const handleDelete = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId)
  }

  const handleLike = (commentId: string) => {
    if (!isAuthenticated) return
    toggleLikeMutation.mutate(commentId)
  }

  const handleTogglePin = async (commentId: string, isPinned?: boolean) => {
    await togglePinMutation.mutateAsync({ commentId, isPinned })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable Comments Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1">
        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="space-y-4 py-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2.5 py-2">
                <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <div className="flex gap-3 pt-1">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="my-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
            <AlertCircle className="mx-auto h-7 w-7 text-destructive mb-2" />
            <p className="text-xs font-medium text-foreground">
              Không thể tải bình luận
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {(error as any)?.message || 'Đã có lỗi xảy ra khi kết nối máy chủ.'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-3 h-7 text-xs gap-1.5"
            >
              <RefreshCw className="h-3 w-3" />
              Thử lại
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && comments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              Chưa có thảo luận nào
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground max-w-[220px]">
              Hãy là người đầu tiên đặt câu hỏi hoặc chia sẻ ý kiến của bạn về bài học này!
            </p>
          </div>
        )}

        {/* Comments List */}
        {!isLoading && !isError && comments.length > 0 && (
          <div className="divide-y divide-border/40">
            {comments.map((c) => (
              <LessonCommentItem
                key={c.id}
                comment={c}
                currentUserId={user?.id}
                isPrivilegedUser={isPrivilegedUser}
                onLike={handleLike}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Composer Bottom Bar */}
      <div className="shrink-0 border-t border-border pt-3 mt-2">
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Đặt câu hỏi hoặc thảo luận về bài học..."
                rows={2}
                maxLength={2000}
                className="w-full resize-none rounded-lg border border-border bg-card p-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <span className="absolute bottom-2 right-2 text-[9px] text-muted-foreground select-none">
                {newCommentText.length}/2000
              </span>
            </div>

            <Button
              type="button"
              onClick={handleCreateTopComment}
              disabled={!newCommentText.trim() || createCommentMutation.isPending}
              className="w-full h-8 text-xs font-medium gap-1.5"
            >
              {createCommentMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Đang đăng...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Đăng bình luận
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Vui lòng đăng nhập để tham gia thảo luận cùng lớp học.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs gap-1.5"
              onClick={() => (window.location.href = '/login')}
            >
              <LogIn className="h-3.5 w-3.5" />
              Đăng nhập ngay
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
