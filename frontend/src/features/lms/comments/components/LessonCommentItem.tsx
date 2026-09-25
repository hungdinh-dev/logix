'use client'

import { useState } from 'react'
import {
  ThumbsUp,
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
  Pin,
  Loader2,
  Send,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import type { LessonCommentItem as LessonCommentType } from '../types/lesson-comment.types'

function formatTimeAgo(dateString: string): string {
  try {
    const diff = Math.max(0, Date.now() - new Date(dateString).getTime())
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return 'Vừa xong'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} phút trước`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} giờ trước`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} ngày trước`
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch {
    return 'Vừa xong'
  }
}

function getInitials(name: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface LessonCommentItemProps {
  comment: LessonCommentType
  currentUserId?: string
  isPrivilegedUser?: boolean
  onLike: (commentId: string) => void
  onReply: (parentId: string, content: string, replyToUserId?: string) => Promise<void>
  onEdit: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  onTogglePin?: (commentId: string, isPinned?: boolean) => Promise<void>
  isSubReply?: boolean
}

export function LessonCommentItem({
  comment,
  currentUserId,
  isPrivilegedUser = false,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onTogglePin,
  isSubReply = false,
}: LessonCommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAuthor = Boolean(currentUserId && comment.userId === currentUserId)
  const canDelete = isAuthor || isPrivilegedUser
  const canEdit = isAuthor

  const handleStartReply = () => {
    setIsReplying(true)
    if (isSubReply) {
      setReplyText(`@${comment.user?.fullName || 'User'} `)
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || isSubmittingReply) return
    setIsSubmittingReply(true)
    try {
      const rootParentId = isSubReply ? (comment.parentId || comment.id) : comment.id
      const replyToUserId = isSubReply ? comment.userId : undefined
      await onReply(rootParentId, replyText.trim(), replyToUserId)
      setReplyText('')
      setIsReplying(false)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editText.trim() || isSubmittingEdit) return
    setIsSubmittingEdit(true)
    try {
      await onEdit(comment.id, editText.trim())
      setIsEditing(false)
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await onDelete(comment.id)
      setShowDeleteDialog(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={cn(
        'group transition-colors rounded-lg',
        isSubReply ? 'pt-2 pb-1' : 'py-3 border-b border-border/60 last:border-b-0'
      )}
    >
      <div className="flex gap-2.5 items-start">
        {/* Avatar Initials */}
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full font-semibold select-none',
            comment.isInstructorReply
              ? 'h-7 w-7 bg-primary text-primary-foreground text-[10px] ring-2 ring-primary/20'
              : 'h-6 w-6 bg-muted text-muted-foreground text-[9px]'
          )}
        >
          {getInitials(comment.user?.fullName || 'User')}
        </div>

        {/* Comment Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                {comment.user?.fullName || 'Người dùng'}
              </span>

              {comment.isInstructorReply && (
                <Badge
                  variant="outline"
                  className="h-4 border-primary/30 bg-primary/10 px-1 py-0 text-[9px] font-medium text-primary"
                >
                  Giảng viên
                </Badge>
              )}

              {comment.isPinned && !isSubReply && (
                <Badge
                  variant="outline"
                  className="h-4 border-amber-500/30 bg-amber-500/10 px-1 py-0 text-[9px] font-medium text-amber-600 dark:text-amber-400 gap-0.5"
                >
                  <Pin className="h-2.5 w-2.5 fill-amber-500" />
                  Đã ghim
                </Badge>
              )}

              <span className="text-[10px] text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            {/* Actions Dropdown */}
            {(canEdit || canDelete || (isPrivilegedUser && onTogglePin && !isSubReply)) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Tác vụ bình luận"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="text-xs cursor-pointer gap-2"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  )}
                  {isPrivilegedUser && onTogglePin && !isSubReply && (
                    <DropdownMenuItem
                      onClick={() => onTogglePin(comment.id, !comment.isPinned)}
                      className="text-xs cursor-pointer gap-2"
                    >
                      <Pin className="h-3.5 w-3.5" />
                      {comment.isPinned ? 'Bỏ ghim' : 'Ghim bài'}
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-xs cursor-pointer text-destructive focus:text-destructive gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa bình luận
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Body or Edit Input */}
          {isEditing ? (
            <div className="mt-1.5 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-md border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                placeholder="Nhập nội dung chỉnh sửa..."
              />
              <div className="flex justify-end gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] px-2"
                  onClick={() => {
                    setIsEditing(false)
                    setEditText(comment.content)
                  }}
                  disabled={isSubmittingEdit}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-6 text-[11px] px-2.5"
                  onClick={handleSaveEdit}
                  disabled={isSubmittingEdit || !editText.trim()}
                >
                  {isSubmittingEdit && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                  Lưu
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
              {comment.replyToUser && (
                <span className="text-primary font-semibold mr-1.5 inline-flex items-center select-none bg-primary/10 px-1.5 py-0.2 rounded text-[11px]">
                  @{comment.replyToUser.fullName}
                </span>
              )}
              {comment.content}
            </p>
          )}

          {/* Action Footer: Like, Reply */}
          {!isEditing && (
            <div className="mt-1.5 flex items-center gap-3 select-none">
              <button
                type="button"
                onClick={() => onLike(comment.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-1 text-[11px] transition-colors',
                  comment.hasLiked
                    ? 'font-medium text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label={comment.hasLiked ? 'Bỏ thích' : 'Thích'}
              >
                <ThumbsUp
                  className={cn(
                    'h-3 w-3 transition-transform active:scale-125',
                    comment.hasLiked && 'fill-primary text-primary'
                  )}
                />
                <span>{comment.likesCount || 0}</span>
              </button>

              <button
                type="button"
                onClick={handleStartReply}
                className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-3 w-3" />
                <span>Trả lời</span>
              </button>
            </div>
          )}

          {/* Inline Reply Box */}
          {isReplying && (
            <div className="mt-2.5 rounded-lg border border-border bg-muted/30 p-2 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  Trả lời{' '}
                  <strong className="text-foreground font-medium">
                    {comment.user?.fullName}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Viết câu trả lời của bạn..."
                rows={2}
                className="w-full resize-none rounded border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                autoFocus
              />
              <div className="flex justify-end gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] px-2"
                  onClick={() => setIsReplying(false)}
                  disabled={isSubmittingReply}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-6 text-[11px] px-2.5"
                  onClick={handleSendReply}
                  disabled={isSubmittingReply || !replyText.trim()}
                >
                  {isSubmittingReply ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="mr-1 h-3 w-3" />
                  )}
                  Gửi
                </Button>
              </div>
            </div>
          )}

          {/* Nested Replies (2-level hierarchy) */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2.5 space-y-1 border-l-2 border-border/60 pl-3">
              {comment.replies.map((reply) => (
                <LessonCommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  isPrivilegedUser={isPrivilegedUser}
                  onLike={onLike}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                  isSubReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-semibold">
              Xác nhận xóa bình luận?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-relaxed text-muted-foreground">
              Bình luận này và tất cả các phản hồi liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isDeleting} className="h-8 text-xs">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="h-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            >
              {isDeleting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
