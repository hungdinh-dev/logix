import prisma from '../../config/prisma'
import { CreateLessonCommentInput } from './lesson-comment.dto'
import { notificationService } from '../notifications/notification.service'

export class LessonCommentService {
  /**
   * Check if user has trainer or admin privileges
   */
  private async checkIsInstructorOrAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    })

    if (!user) return false

    if (user.userType === 'ADMIN' || user.userType === 'SYSTEM_ADMIN') {
      return true
    }

    return user.userRoles.some((ur) => {
      const roleName = ur.role.roleName.toUpperCase()
      const displayName = ur.role.displayName.toLowerCase()
      return (
        roleName === 'ADMIN' ||
        roleName === 'TRAINER' ||
        roleName === 'INSTRUCTOR' ||
        displayName.includes('giảng viên') ||
        displayName.includes('đào tạo') ||
        displayName.includes('quản trị')
      )
    })
  }

  /**
   * Lấy danh sách bình luận của bài học kèm phản hồi lồng nhau (2 cấp)
   */
  async getComments(lessonId: string, currentUserId?: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    })

    if (!lesson) {
      throw new Error('Không tìm thấy bài học tương ứng')
    }

    const comments = await prisma.lessonComment.findMany({
      where: {
        lessonId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
            userType: true,
            department: {
              select: {
                deptName: true,
              },
            },
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                employeeCode: true,
                userType: true,
                department: {
                  select: {
                    deptName: true,
                  },
                },
              },
            },
            replyToUser: {
              select: {
                id: true,
                fullName: true,
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return comments.map((comment) => {
      const hasLiked = currentUserId
        ? comment.likes.some((l) => l.userId === currentUserId)
        : false

      const formattedReplies = comment.replies.map((reply) => ({
        id: reply.id,
        lessonId: reply.lessonId,
        userId: reply.userId,
        parentId: reply.parentId,
        replyToUserId: reply.replyToUserId,
        replyToUser: reply.replyToUser,
        content: reply.content,
        isInstructorReply: reply.isInstructorReply,
        isPinned: reply.isPinned,
        likesCount: reply.likes.length,
        hasLiked: currentUserId
          ? reply.likes.some((l) => l.userId === currentUserId)
          : false,
        user: reply.user,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      }))

      return {
        id: comment.id,
        lessonId: comment.lessonId,
        userId: comment.userId,
        parentId: comment.parentId,
        replyToUserId: comment.replyToUserId,
        content: comment.content,
        isInstructorReply: comment.isInstructorReply,
        isPinned: comment.isPinned,
        likesCount: comment.likes.length,
        hasLiked,
        user: comment.user,
        replies: formattedReplies,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      }
    })
  }

  /**
   * Tạo bình luận mới hoặc phản hồi
   */
  async createComment(lessonId: string, userId: string, input: CreateLessonCommentInput) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, title: true },
    })

    if (!lesson) {
      throw new Error('Không tìm thấy bài học')
    }

    let finalParentId: string | null = null
    let targetRecipientId: string | null = null

    if (input.parentId) {
      const parentComment = await prisma.lessonComment.findUnique({
        where: { id: input.parentId },
        select: { id: true, userId: true, lessonId: true, parentId: true },
      })

      if (!parentComment || parentComment.lessonId !== lessonId) {
        throw new Error('Bình luận gốc không tồn tại hoặc không thuộc bài học này')
      }

      // Giữ tối đa 2 cấp: nếu reply vào reply, gắn vào parent gốc
      finalParentId = parentComment.parentId ? parentComment.parentId : parentComment.id

      // Xác định người nhận thông báo: nếu chỉ định replyToUserId thì gửi tới đó, ngược lại gửi tới chủ comment cha
      targetRecipientId = input.replyToUserId || parentComment.userId
    }

    const isInstructor = await this.checkIsInstructorOrAdmin(userId)

    const newComment = await prisma.lessonComment.create({
      data: {
        lessonId,
        userId,
        content: input.content.trim(),
        parentId: finalParentId,
        replyToUserId: input.replyToUserId || null,
        isInstructorReply: isInstructor,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
            userType: true,
            department: {
              select: {
                deptName: true,
              },
            },
          },
        },
        replyToUser: {
          select: {
            id: true,
            fullName: true,
          },
        },
        likes: true,
      },
    })

    // Bắn thông báo Realtime nếu trả lời người khác
    if (targetRecipientId && targetRecipientId !== userId) {
      try {
        const actor = await prisma.user.findUnique({
          where: { id: userId },
          select: { fullName: true },
        })

        await notificationService.createAndPushNotification({
          userId: targetRecipientId,
          actorId: userId,
          type: 'COMMENT_REPLY',
          title: `${actor?.fullName || 'Một học viên'} đã trả lời bình luận của bạn`,
          content: `Trong bài học "${lesson.title || 'bài học'}": "${input.content.slice(0, 90)}"`,
          linkUrl: `/lms/lessons/${lessonId}?commentId=${newComment.id}`,
        })
      } catch (notifErr) {
        console.error('Error triggering notification on comment reply:', notifErr)
      }
    }

    return {
      id: newComment.id,
      lessonId: newComment.lessonId,
      userId: newComment.userId,
      parentId: newComment.parentId,
      replyToUserId: newComment.replyToUserId,
      replyToUser: newComment.replyToUser,
      content: newComment.content,
      isInstructorReply: newComment.isInstructorReply,
      isPinned: newComment.isPinned,
      likesCount: 0,
      hasLiked: false,
      user: newComment.user,
      replies: [],
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
    }
  }

  /**
   * Chỉnh sửa bình luận (chỉ tác giả)
   */
  async updateComment(commentId: string, userId: string, content: string) {
    const comment = await prisma.lessonComment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new Error('Bình luận không tồn tại')
    }

    if (comment.userId !== userId) {
      throw new Error('Chỉ tác giả mới có quyền chỉnh sửa bình luận này')
    }

    const updated = await prisma.lessonComment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
            userType: true,
            department: {
              select: {
                deptName: true,
              },
            },
          },
        },
      },
    })

    return updated
  }

  /**
   * Xóa bình luận (Tác giả hoặc Admin / Giảng viên)
   */
  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.lessonComment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new Error('Bình luận không tồn tại')
    }

    const isPrivileged = await this.checkIsInstructorOrAdmin(userId)
    if (comment.userId !== userId && !isPrivileged) {
      throw new Error('Bạn không có quyền xóa bình luận này')
    }

    await prisma.lessonComment.delete({
      where: { id: commentId },
    })

    return { id: commentId, parentId: comment.parentId }
  }

  /**
   * Toggle Like bình luận
   */
  async toggleLike(commentId: string, userId: string) {
    const comment = await prisma.lessonComment.findUnique({
      where: { id: commentId },
      select: { id: true, likesCount: true },
    })

    if (!comment) {
      throw new Error('Bình luận không tồn tại')
    }

    const existingLike = await prisma.lessonCommentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })

    if (existingLike) {
      await prisma.$transaction([
        prisma.lessonCommentLike.delete({
          where: { id: existingLike.id },
        }),
        prisma.lessonComment.update({
          where: { id: commentId },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        }),
      ])

      const count = await prisma.lessonCommentLike.count({
        where: { commentId },
      })

      return { hasLiked: false, likesCount: count }
    } else {
      await prisma.$transaction([
        prisma.lessonCommentLike.create({
          data: {
            commentId,
            userId,
          },
        }),
        prisma.lessonComment.update({
          where: { id: commentId },
          data: {
            likesCount: {
              increment: 1,
            },
          },
        }),
      ])

      const count = await prisma.lessonCommentLike.count({
        where: { commentId },
      })

      return { hasLiked: true, likesCount: count }
    }
  }

  /**
   * Ghim / Bỏ ghim bình luận (Admin / Giảng viên)
   */
  async togglePin(commentId: string, userId: string, isPinned?: boolean) {
    const isPrivileged = await this.checkIsInstructorOrAdmin(userId)
    if (!isPrivileged) {
      throw new Error('Chỉ giảng viên hoặc quản trị viên mới có quyền ghim bình luận')
    }

    const comment = await prisma.lessonComment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new Error('Bình luận không tồn tại')
    }

    const targetPinned = isPinned !== undefined ? isPinned : !comment.isPinned

    const updated = await prisma.lessonComment.update({
      where: { id: commentId },
      data: { isPinned: targetPinned },
    })

    return updated
  }
}

export const lessonCommentService = new LessonCommentService()
