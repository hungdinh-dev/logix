import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { LmsActivityType } from '@prisma/client'
import { lmsActivityLogService, type LmsActivityItem } from '../activity-logs/activity-log.service'
import { certificateService } from '../certificates/certificate.service'
import { UpdateLessonProgressDto } from './progress.dto'


export class ProgressService {
  public async getDashboardProgress(userId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            modules: {
              include: { lessons: true },
            },
          },
        },
      },
    })

    const totalEnrolled = enrollments.length
    const completedCourses = enrollments.filter((e) => e.status === 'COMPLETED').length

    const activeCourses = enrollments.map((e) => {
      const totalLessons = e.course.modules.reduce((sum, m) => sum + m.lessons.length, 0)
      return {
        id: e.course.id,
        title: e.course.title,
        category: e.course.category.name,
        progress: e.completionPercentage,
        totalLessons,
      }
    })

    return {
      summary: {
        enrolledCount: totalEnrolled,
        completedCount: completedCourses,
        inProgressCount: totalEnrolled - completedCourses,
      },
      courses: activeCourses,
    }
  }

  public async checkLessonUnlocked(userId: string, lessonId: string): Promise<boolean> {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  where: { lessons: { some: { isVisible: true } } },
                  orderBy: { sortOrder: 'asc' },
                  include: {
                    lessons: {
                      where: { isVisible: true },
                      orderBy: { sortOrder: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    const course = lesson.module.course
    const progressionMode = (course as any).progressionMode || 'LINEAR_LESSON'

    // Mode 1: FREE - Không khóa bài nào
    if (progressionMode === 'FREE') {
      return true
    }

    // Lấy danh sách ID các bài học đã hoàn thành của user
    const completedProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      select: { lessonId: true },
    })
    const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId))

    // Mode 2: LINEAR_LESSON - Tuần tự từng bài học (chống nhảy cóc bài)
    if (progressionMode === 'LINEAR_LESSON') {
      const allOrderedLessons = course.modules.flatMap((m) => m.lessons)
      const currentIndex = allOrderedLessons.findIndex((l) => l.id === lessonId)

      // Bài đầu tiên luôn mở
      if (currentIndex <= 0) {
        return true
      }

      // Bài hiện tại mở nếu bài liền kề trước đó đã hoàn thành
      const previousLesson = allOrderedLessons[currentIndex - 1]
      return completedLessonIds.has(previousLesson.id)
    }

    // Mode 3: LINEAR_MODULE - Tuần tự từng chương học
    if (progressionMode === 'LINEAR_MODULE') {
      const currentModuleIndex = course.modules.findIndex((m) => m.id === lesson.moduleId)

      // Chương đầu tiên luôn mở toàn bộ bài
      if (currentModuleIndex <= 0) {
        return true
      }

      // Chương hiện tại chỉ mở khi TẤT CẢ các bài trong chương trước đã hoàn thành
      const previousModule = course.modules[currentModuleIndex - 1]
      const prevModuleLessonIds = previousModule.lessons.map((l) => l.id)
      const isPrevModuleCompleted = prevModuleLessonIds.every((id) => completedLessonIds.has(id))

      return isPrevModuleCompleted
    }

    return true
  }

  public async getCourseProgress(userId: string, courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              where: { isVisible: true },
              orderBy: { sortOrder: 'asc' },
              include: {
                quiz: {
                  select: {
                    id: true,
                    title: true,
                    passScore: true,
                    maxAttempts: true,
                    timeLimitMinutes: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!course) {
      throw new NotFoundError('Khóa học')
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    const userProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: {
          module: { courseId },
        },
      },
    })

    const progressMap = new Map(userProgress.map((p) => [p.lessonId, p]))
    const completedLessonIds = new Set(
      userProgress.filter((p) => p.isCompleted).map((p) => p.lessonId)
    )

    const progressionMode = (course as any).progressionMode || 'LINEAR_LESSON'
    const allOrderedLessons = course.modules.flatMap((m) => m.lessons)

    let foundFirstIncomplete = false

    const modulesWithLockStatus = course.modules.map((module, modIndex) => {
      let isModuleLocked = false

      if (progressionMode === 'LINEAR_MODULE' && modIndex > 0) {
        const prevModule = course.modules[modIndex - 1]
        const isPrevModuleCompleted = prevModule.lessons.every((l) => completedLessonIds.has(l.id))
        isModuleLocked = !isPrevModuleCompleted
      }

      const lessonsWithStatus = module.lessons.map((lesson) => {
        const progress = progressMap.get(lesson.id)
        const isCompleted = Boolean(progress?.isCompleted)

        let isLocked = false
        if (progressionMode === 'FREE') {
          isLocked = false
        } else if (progressionMode === 'LINEAR_MODULE') {
          isLocked = isModuleLocked
        } else if (progressionMode === 'LINEAR_LESSON') {
          const lessonIndex = allOrderedLessons.findIndex((l) => l.id === lesson.id)
          if (lessonIndex > 0) {
            const prevLesson = allOrderedLessons[lessonIndex - 1]
            isLocked = !completedLessonIds.has(prevLesson.id)
          }
        }

        let status: 'completed' | 'current' | 'locked' | 'available' = 'available'
        if (isCompleted) {
          status = 'completed'
        } else if (isLocked) {
          status = 'locked'
        } else if (!foundFirstIncomplete) {
          status = 'current'
          foundFirstIncomplete = true
        }

        return {
          id: lesson.id,
          title: lesson.title,
          lessonType: lesson.lessonType,
          duration: lesson.videoDuration || (lesson.estimatedReadTime ? lesson.estimatedReadTime * 60 : 0),
          sopCode: lesson.sopCode,
          isCompleted,
          isLocked,
          status,
          lastPositionSeconds: progress?.lastPositionSeconds || 0,
          quizHighestScore: progress?.quizHighestScore || null,
          quiz: lesson.quiz,
        }
      })

      return {
        id: module.id,
        title: module.title,
        sortOrder: module.sortOrder,
        isLocked: isModuleLocked,
        lessons: lessonsWithStatus,
      }
    })

    return {
      courseId: course.id,
      title: course.title,
      code: course.code,
      progressionMode,
      enrollment: enrollment
        ? {
            id: enrollment.id,
            status: enrollment.status,
            completionPercentage: enrollment.completionPercentage,
            isPassed: enrollment.isPassed,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
          }
        : null,
      modules: modulesWithLockStatus,
    }
  }

  public async updateLessonProgress(userId: string, dto: UpdateLessonProgressDto) {
    const { lessonId, isCompleted, lastPositionSeconds } = dto

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.module.courseId,
        },
      },
    })

    if (!enrollment) {
      throw new BadRequestError('Học viên chưa ghi danh vào khóa học này')
    }

    // Guard: Kiểm tra bài học có bị khóa hay không để chống nhảy cóc
    const isUnlocked = await this.checkLessonUnlocked(userId, lessonId)
    if (!isUnlocked) {
      throw new BadRequestError('Bài học này đang bị khóa. Bạn cần hoàn thành các bài học trước đó theo quy định.')
    }

    const progressRecord = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : undefined,
        lastPositionSeconds: lastPositionSeconds !== undefined ? Number(lastPositionSeconds) : undefined,
        completedAt: isCompleted ? new Date() : undefined,
      },
      create: {
        enrollmentId: enrollment.id,
        userId,
        lessonId,
        isCompleted: Boolean(isCompleted),
        lastPositionSeconds: Number(lastPositionSeconds || 0),
        completedAt: isCompleted ? new Date() : undefined,
      },
    })

    // Log Activity when lesson is completed
    if (isCompleted) {
      await lmsActivityLogService.logActivity({
        userId,
        courseId: lesson.module.courseId,
        lessonId: lesson.id,
        activityType: LmsActivityType.LESSON_COMPLETED,
        actionTitle:
          lesson.lessonType === 'VIDEO'
            ? 'Hoàn thành bài học Video'
            : lesson.lessonType === 'QUIZ'
            ? 'Hoàn thành bài kiểm tra'
            : 'Hoàn thành bài học',
        targetName: `${lesson.title} (${lesson.module.course.title})`,
        status: 'SUCCESS',
        statusLabel: 'Hoàn thành',
      })
    }

    const allLessons = await prisma.lesson.findMany({
      where: {
        module: { courseId: lesson.module.courseId },
        isVisible: true,
      },
      select: { id: true },
    })

    const totalLessonsCount = allLessons.length
    if (totalLessonsCount > 0) {
      const completedCount = await prisma.lessonProgress.count({
        where: {
          userId,
          lessonId: { in: allLessons.map((l) => l.id) },
          isCompleted: true,
        },
      })

      const completionPct = (completedCount / totalLessonsCount) * 100
      const isCourseCompleted = completionPct >= 100

      await prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          completionPercentage: Math.round(completionPct * 100) / 100,
          status: isCourseCompleted ? 'COMPLETED' : 'IN_PROGRESS',
          isPassed: isCourseCompleted,
          completedAt: isCourseCompleted ? new Date() : null,
        },
      })

      // Auto-issue certificate when course is 100% completed
      if (isCourseCompleted) {
        try {
          const course = await prisma.course.findUnique({
            where: { id: lesson.module.courseId },
            include: { certificateTemplate: true },
          })

          if (course && (course.hasCertificate || course.certificateTemplateId)) {
            const existingCert = await prisma.userCertificate.findFirst({
              where: {
                userId,
                courseId: course.id,
                status: { not: 'REVOKED' },
              },
            })

            if (!existingCert) {
              const student = await prisma.user.findUnique({ where: { id: userId } })
              await certificateService.issueCertificate({
                userId,
                courseId: course.id,
                templateId: course.certificateTemplateId || null,
                title: `Chứng chỉ: ${course.title}`,
                recipientName: student?.fullName || 'Học viên',
              })
            }
          }
        } catch (certErr) {
          console.error('[Auto-Issue Certificate] Không thể tự động cấp bằng:', certErr)
        }

        await lmsActivityLogService.logActivity({
          userId,
          courseId: lesson.module.courseId,
          activityType: LmsActivityType.COURSE_COMPLETED,
          actionTitle: 'Hoàn thành toàn bộ khóa học',
          targetName: lesson.module.course.title,
          status: 'SUCCESS',
          statusLabel: 'Đạt chứng chỉ',
        })
      }
    }

    return progressRecord
  }

  public async getAdminDashboardStats() {
    // 1. Total Students & employment breakdown
    const [totalStudents, officialStudents, probationStudents] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true, employmentStatus: 'OFFICIAL' } }),
      prisma.user.count({ where: { isActive: true, employmentStatus: 'PROBATION' } }),
    ])

    // 2. Courses status breakdown
    const [totalCourses, publishedCourses, draftCourses, mandatoryCourses] = await Promise.all([
      prisma.course.count({ where: { isActive: true } }),
      prisma.course.count({ where: { isActive: true, status: 'PUBLISHED' } }),
      prisma.course.count({ where: { isActive: true, status: 'DRAFT' } }),
      prisma.course.count({ where: { isActive: true, isMandatory: true } }),
    ])

    // 3. Average completion rate & total enrollments
    const enrollmentStats = await prisma.courseEnrollment.aggregate({
      _avg: {
        completionPercentage: true,
      },
      _count: {
        id: true,
      },
    })
    const avgCompletionRate = Math.round(enrollmentStats._avg.completionPercentage || 0)
    const totalEnrollments = enrollmentStats._count.id || 0

    // 4. Top courses with enrollments and completion
    const coursesWithEnrollments = await prisma.course.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        code: true,
        isMandatory: true,
        status: true,
        enrollments: {
          select: {
            completionPercentage: true,
            status: true,
          },
        },
      },
    })

    const topCourses = coursesWithEnrollments
      .map((c) => {
        const enrolledCount = c.enrollments.length
        const avgPct =
          enrolledCount > 0
            ? Math.round(
                c.enrollments.reduce((sum, e) => sum + (e.completionPercentage || 0), 0) /
                  enrolledCount
              )
            : 0
        return {
          id: c.id,
          title: c.title,
          code: c.code,
          enrolled: enrolledCount,
          completion: avgPct,
          mandatory: c.isMandatory,
          status: c.status,
        }
      })
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 5)

    // 5. Recent Activities: Query from LmsActivityLog table first
    const loggedActivities = await lmsActivityLogService.getRecentActivities(7)
    let recentActivities: LmsActivityItem[] = loggedActivities


    // Fallback: If LmsActivityLog is empty (e.g. legacy seed data), aggregate from tables
    if (recentActivities.length === 0) {
      const [recentQuizAttempts, recentLessonProgress, recentEnrollments] = await Promise.all([
        prisma.quizAttempt.findMany({
          orderBy: { startedAt: 'desc' },
          take: 8,
          include: {
            user: { select: { id: true, fullName: true, email: true } },
            quiz: {
              select: {
                title: true,
                passScore: true,
                lesson: {
                  select: {
                    title: true,
                    module: {
                      select: {
                        course: { select: { id: true, title: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        prisma.lessonProgress.findMany({
          where: { isCompleted: true },
          orderBy: { updatedAt: 'desc' },
          take: 8,
          include: {
            user: { select: { id: true, fullName: true, email: true } },
            lesson: {
              select: {
                id: true,
                title: true,
                lessonType: true,
                module: {
                  select: {
                    course: { select: { id: true, title: true } },
                  },
                },
              },
            },
          },
        }),
        prisma.courseEnrollment.findMany({
          orderBy: { enrolledAt: 'desc' },
          take: 8,
          include: {
            user: { select: { id: true, fullName: true, email: true } },
            course: { select: { id: true, title: true } },
          },
        }),
      ])

      const getAvatarInitials = (name: string) => {
        if (!name) return 'U'
        const parts = name.trim().split(/\s+/)
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }

      const activities: Array<{
        id: string
        userId: string
        user: string
        avatar: string
        email: string
        action: string
        target: string
        status: 'SUCCESS' | 'ACTIVE' | 'FAILED' | 'IN_PROGRESS'
        statusLabel: string
        timestamp: string
        metadata?: any
      }> = []


      for (const qa of recentQuizAttempts) {
        if (!qa.user || !qa.quiz?.lesson?.module?.course) continue
        const courseTitle = qa.quiz.lesson.module.course.title
        activities.push({
          id: `quiz-${qa.id}`,
          userId: qa.user.id,
          user: qa.user.fullName,
          avatar: getAvatarInitials(qa.user.fullName),
          email: qa.user.email || 'N/A',
          action: qa.isPassed ? 'Hoàn thành bài kiểm tra' : 'Kiểm tra không đạt',
          target: `${qa.quiz.title} (${courseTitle})`,
          status: qa.isPassed ? 'SUCCESS' : 'FAILED',
          statusLabel: qa.isPassed ? `Đạt (${qa.score || 100}%)` : `Chưa đạt (${qa.score || 0}%)`,
          timestamp: (qa.submittedAt || qa.startedAt).toISOString(),
        })
      }

      for (const lp of recentLessonProgress) {
        if (!lp.user || !lp.lesson?.module?.course) continue
        const courseTitle = lp.lesson.module.course.title
        activities.push({
          id: `lesson-${lp.id}`,
          userId: lp.user.id,
          user: lp.user.fullName,
          avatar: getAvatarInitials(lp.user.fullName),
          email: lp.user.email || 'N/A',
          action:
            lp.lesson.lessonType === 'VIDEO'
              ? 'Hoàn thành bài học Video'
              : 'Hoàn thành bài học',
          target: `${lp.lesson.title} (${courseTitle})`,
          status: 'SUCCESS',
          statusLabel: 'Hoàn thành',
          timestamp: (lp.completedAt || lp.updatedAt).toISOString(),
        })
      }

      for (const enr of recentEnrollments) {
        if (!enr.user || !enr.course) continue
        const isCompleted = enr.status === 'COMPLETED'
        activities.push({
          id: `enroll-${enr.id}`,
          userId: enr.user.id,
          user: enr.user.fullName,
          avatar: getAvatarInitials(enr.user.fullName),
          email: enr.user.email || 'N/A',
          action: isCompleted ? 'Hoàn thành toàn bộ khóa học' : 'Ghi danh khóa học',
          target: enr.course.title,
          status: isCompleted ? 'SUCCESS' : 'ACTIVE',
          statusLabel: isCompleted ? 'Đạt chứng chỉ' : 'Đang học',
          timestamp: (enr.completedAt || enr.enrolledAt).toISOString(),
        })
      }

      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      recentActivities = activities.slice(0, 7)
    }

    return {
      metrics: {
        totalStudents,
        officialStudents,
        probationStudents,
        totalCourses,
        publishedCourses,
        draftCourses,
        mandatoryCourses,
        avgCompletionRate,
        totalEnrollments,
      },
      topCourses,
      recentActivities,
    }
  }
}

export const progressService = new ProgressService()


