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

    // Guard: Người dùng chưa ghi danh khóa học thì toàn bộ bài học đều khóa
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    })
    if (!enrollment) {
      return false
    }

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

    const isEnrolled = Boolean(enrollment)

    const modulesWithLockStatus = course.modules.map((module, modIndex) => {
      let isModuleLocked = !isEnrolled

      if (isEnrolled && progressionMode === 'LINEAR_MODULE' && modIndex > 0) {
        const prevModule = course.modules[modIndex - 1]
        const isPrevModuleCompleted = prevModule.lessons.every((l) => completedLessonIds.has(l.id))
        isModuleLocked = !isPrevModuleCompleted
      }

      const lessonsWithStatus = module.lessons.map((lesson) => {
        const progress = progressMap.get(lesson.id)
        const isCompleted = Boolean(progress?.isCompleted)

        let isLocked = !isEnrolled
        if (isEnrolled) {
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
        }

        let status: 'completed' | 'current' | 'locked' | 'available' = 'available'
        if (!isEnrolled) {
          status = 'locked'
        } else if (isCompleted) {
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

  // ==========================================
  // LMS-045: Admin Progress Tracking (Real DB)
  // ==========================================

  public async getAdminProgressTracking(params?: {
    page?: number
    pageSize?: number
    search?: string
    courseId?: string
    departmentId?: string
    storeId?: string
    status?: string
    sortField?: string
    sortDirection?: string
  }) {
    const page = Math.max(1, Number(params?.page) || 1)
    const pageSize = Math.max(1, Math.min(100, Number(params?.pageSize) || 10))
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (params?.status && params.status !== 'ALL') {
      where.status = params.status
    }

    if (params?.courseId && params.courseId !== 'ALL') {
      where.courseId = params.courseId
    }

    const userWhere: any = {}
    if (params?.departmentId && params.departmentId !== 'ALL') {
      userWhere.departmentId = params.departmentId
    }
    if (params?.storeId && params.storeId !== 'ALL') {
      userWhere.storeId = params.storeId
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.trim()
      where.OR = [
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
        { user: { employeeCode: { contains: q, mode: 'insensitive' } } },
        { course: { title: { contains: q, mode: 'insensitive' } } },
        { course: { code: { contains: q, mode: 'insensitive' } } },
      ]
    }

    if (Object.keys(userWhere).length > 0) {
      where.user = { ...where.user, ...userWhere }
    }

    // Determine sorting
    let orderBy: any = { enrolledAt: 'desc' }
    if (params?.sortField === 'completionPercentage') {
      orderBy = { completionPercentage: params.sortDirection === 'asc' ? 'asc' : 'desc' }
    } else if (params?.sortField === 'completedAt') {
      orderBy = { completedAt: params.sortDirection === 'asc' ? 'asc' : 'desc' }
    } else if (params?.sortField === 'fullName') {
      orderBy = { user: { fullName: params.sortDirection === 'asc' ? 'asc' : 'desc' } }
    } else if (params?.sortField === 'courseTitle') {
      orderBy = { course: { title: params.sortDirection === 'asc' ? 'asc' : 'desc' } }
    } else if (params?.sortField === 'enrolledAt') {
      orderBy = { enrolledAt: params.sortDirection === 'asc' ? 'asc' : 'desc' }
    }

    const [total, enrollments, allEnrollmentsStats, coursesList, departmentsList] = await Promise.all([
      prisma.courseEnrollment.count({ where }),
      prisma.courseEnrollment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              employeeCode: true,
              department: { select: { id: true, deptName: true, deptCode: true } },
              position: { select: { id: true, positionName: true, positionCode: true } },
              store: { select: { id: true, storeName: true, storeCode: true } },
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              code: true,
              isMandatory: true,
              durationDays: true,
              _count: {
                select: {
                  modules: true,
                },
              },
            },
          },
        },
      }),
      // Stats count across the whole system
      prisma.courseEnrollment.groupBy({
        by: ['status'],
        _count: { id: true },
        _avg: { completionPercentage: true },
      }),
      // Courses list for filter dropdown
      prisma.course.findMany({
        where: { isActive: true },
        select: { id: true, title: true, code: true },
        orderBy: { title: 'asc' },
      }),
      // Departments list for filter dropdown
      prisma.department.findMany({
        where: { isActive: true },
        select: { id: true, deptName: true, deptCode: true },
        orderBy: { deptName: 'asc' },
      }),
    ])

    let totalEnrollments = 0
    let completedCount = 0
    let inProgressCount = 0
    let enrolledCount = 0
    let sumRate = 0
    let countRate = 0

    for (const stat of allEnrollmentsStats) {
      totalEnrollments += stat._count.id
      if (stat.status === 'COMPLETED') completedCount = stat._count.id
      if (stat.status === 'IN_PROGRESS') inProgressCount = stat._count.id
      if (stat.status === 'ENROLLED') enrolledCount = stat._count.id
      if (stat._avg.completionPercentage !== null) {
        sumRate += (stat._avg.completionPercentage || 0) * stat._count.id
        countRate += stat._count.id
      }
    }

    const avgCompletionRate = countRate > 0 ? Math.round((sumRate / countRate) * 10) / 10 : 0

    // Get highest quiz score for each enrollment if any
    const userIds = enrollments.map((e) => e.userId)
    const lessonProgresses = await prisma.lessonProgress.findMany({
      where: {
        userId: { in: userIds },
        quizHighestScore: { not: null },
      },
      select: {
        userId: true,
        quizHighestScore: true,
        lesson: {
          select: {
            moduleId: true,
            module: { select: { courseId: true } },
          },
        },
      },
    })

    const items = enrollments.map((enr) => {
      // Find highest score in this course for this user
      const userScores = lessonProgresses
        .filter((lp) => lp.userId === enr.userId && lp.lesson.module.courseId === enr.courseId)
        .map((lp) => lp.quizHighestScore || 0)
      const highestQuizScore = userScores.length > 0 ? Math.max(...userScores) : null

      return {
        id: enr.id,
        userId: enr.userId,
        courseId: enr.courseId,
        status: enr.status,
        completionPercentage: Math.round(enr.completionPercentage || 0),
        isPassed: enr.isPassed,
        enrollmentSource: enr.enrollmentSource,
        enrolledAt: enr.enrolledAt,
        completedAt: enr.completedAt,
        dueDate: enr.dueDate,
        highestQuizScore,
        user: enr.user,
        course: enr.course,
      }
    })

    return {
      items,
      stats: {
        totalEnrollments,
        completedCount,
        inProgressCount,
        enrolledCount,
        avgCompletionRate,
      },
      filters: {
        courses: coursesList,
        departments: departmentsList,
      },
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    }
  }

  // ==========================================
  // LMS-046: Admin Learning Activities (Live Feed)
  // ==========================================

  public async getAdminActivities(params?: {
    page?: number
    pageSize?: number
    search?: string
    type?: string
    status?: string
  }) {
    const page = Math.max(1, Number(params?.page) || 1)
    const pageSize = Math.max(1, Math.min(100, Number(params?.pageSize) || 15))
    const search = params?.search?.trim() ? params.search.trim().toLowerCase() : ''
    const type = params?.type || 'ALL'
    const status = params?.status || 'ALL'

    // Fetch quiz attempts, lesson progresses, and course enrollments
    const [recentQuizAttempts, recentLessonProgress, recentEnrollments] = await Promise.all([
      prisma.quizAttempt.findMany({
        take: 100,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              department: { select: { deptName: true } },
            },
          },
          quiz: {
            select: {
              id: true,
              title: true,
              lesson: {
                select: {
                  title: true,
                  module: {
                    select: {
                      course: { select: { id: true, title: true, code: true } },
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
        take: 100,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              department: { select: { deptName: true } },
            },
          },
          lesson: {
            select: {
              id: true,
              title: true,
              lessonType: true,
              module: {
                select: {
                  course: { select: { id: true, title: true, code: true } },
                },
              },
            },
          },
        },
      }),
      prisma.courseEnrollment.findMany({
        take: 100,
        orderBy: { enrolledAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              department: { select: { deptName: true } },
            },
          },
          course: { select: { id: true, title: true, code: true } },
        },
      }),
    ])

    const getAvatarInitials = (name: string) => {
      if (!name) return 'U'
      const parts = name.trim().split(/\s+/)
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    type ActivityItem = {
      id: string
      type: 'QUIZ' | 'LESSON' | 'COURSE'
      userId: string
      user: string
      email: string
      avatar: string
      department?: string
      action: string
      target: string
      courseTitle: string
      status: 'SUCCESS' | 'ACTIVE' | 'FAILED'
      statusLabel: string
      score?: number | null
      timestamp: string
    }

    const allActivities: ActivityItem[] = []

    for (const qa of recentQuizAttempts) {
      if (!qa.user || !qa.quiz?.lesson?.module?.course) continue
      const courseTitle = qa.quiz.lesson.module.course.title
      allActivities.push({
        id: `quiz-${qa.id}`,
        type: 'QUIZ',
        userId: qa.user.id,
        user: qa.user.fullName,
        email: qa.user.email || '',
        avatar: getAvatarInitials(qa.user.fullName),
        department: qa.user.department?.deptName,
        action: qa.isPassed ? 'Hoàn thành bài kiểm tra' : 'Làm bài kiểm tra (Chưa đạt)',
        target: qa.quiz.title,
        courseTitle,
        status: qa.isPassed ? 'SUCCESS' : 'FAILED',
        statusLabel: qa.isPassed ? `Đạt (${qa.score || 100}%)` : `Chưa đạt (${qa.score || 0}%)`,
        score: qa.score,
        timestamp: (qa.submittedAt || qa.startedAt).toISOString(),
      })
    }

    for (const lp of recentLessonProgress) {
      if (!lp.user || !lp.lesson?.module?.course) continue
      const courseTitle = lp.lesson.module.course.title
      allActivities.push({
        id: `lesson-${lp.id}`,
        type: 'LESSON',
        userId: lp.user.id,
        user: lp.user.fullName,
        email: lp.user.email || '',
        avatar: getAvatarInitials(lp.user.fullName),
        department: lp.user.department?.deptName,
        action:
          lp.lesson.lessonType === 'VIDEO'
            ? 'Hoàn thành bài học Video'
            : 'Hoàn thành bài đọc / tài liệu',
        target: lp.lesson.title,
        courseTitle,
        status: 'SUCCESS',
        statusLabel: 'Hoàn thành',
        timestamp: (lp.completedAt || lp.updatedAt).toISOString(),
      })
    }

    for (const enr of recentEnrollments) {
      if (!enr.user || !enr.course) continue
      const isCompleted = enr.status === 'COMPLETED'
      allActivities.push({
        id: `enroll-${enr.id}`,
        type: 'COURSE',
        userId: enr.user.id,
        user: enr.user.fullName,
        email: enr.user.email || '',
        avatar: getAvatarInitials(enr.user.fullName),
        department: enr.user.department?.deptName,
        action: isCompleted ? 'Hoàn thành toàn bộ khóa học' : 'Ghi danh khóa học',
        target: enr.course.title,
        courseTitle: enr.course.title,
        status: isCompleted ? 'SUCCESS' : 'ACTIVE',
        statusLabel: isCompleted ? 'Đạt chứng chỉ' : 'Đang học',
        timestamp: (enr.completedAt || enr.enrolledAt).toISOString(),
      })
    }

    // Sort by timestamp desc
    allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply filters
    let filtered = allActivities

    if (type !== 'ALL') {
      filtered = filtered.filter((a) => a.type === type)
    }

    if (status !== 'ALL') {
      filtered = filtered.filter((a) => a.status === status)
    }

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.user.toLowerCase().includes(search) ||
          a.email.toLowerCase().includes(search) ||
          a.target.toLowerCase().includes(search) ||
          a.courseTitle.toLowerCase().includes(search) ||
          (a.department && a.department.toLowerCase().includes(search))
      )
    }

    const total = filtered.length
    const skip = (page - 1) * pageSize
    const items = filtered.slice(skip, skip + pageSize)

    // Calculate stats
    const stats = {
      totalActivities: allActivities.length,
      quizCount: allActivities.filter((a) => a.type === 'QUIZ').length,
      lessonCount: allActivities.filter((a) => a.type === 'LESSON').length,
      courseCount: allActivities.filter((a) => a.type === 'COURSE').length,
    }

    return {
      items,
      stats,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    }
  }
}

export const progressService = new ProgressService()


