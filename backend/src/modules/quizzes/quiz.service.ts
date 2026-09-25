import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { LmsActivityType } from '@prisma/client'
import { lmsActivityLogService } from '../activity-logs/activity-log.service'
import { certificateService } from '../certificates/certificate.service'
import {
  UpdateQuizConfigDto,
  CreateQuestionDto,
  UpdateQuestionDto,
  ReorderQuestionsDto,
  SubmitQuizDto,
} from './quiz.dto'

export class QuizService {
  // ==========================================
  // 1. QUIZ CONFIGURATION (LMS-061 -> LMS-064)
  // ==========================================

  public async getQuizByLessonId(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    let quiz = await prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    })

    // Nếu bài học chưa có Quiz, tự động khởi tạo
    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          lessonId,
          title: `Bài kiểm tra: ${lesson.title}`,
          description: 'Vui lòng chọn đáp án đúng cho các câu hỏi dưới đây.',
          passScore: 80,
          maxAttempts: 3,
          timeLimitMinutes: 30,
          shuffleQuestions: true,
          showAnswerFeedback: true,
        },
        include: {
          questions: {
            include: { options: true },
          },
        },
      })
    }

    return quiz
  }

  public async getQuizById(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            moduleId: true,
            module: {
              select: {
                id: true,
                title: true,
                courseId: true,
              },
            },
          },
        },
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    })

    if (!quiz) {
      throw new NotFoundError('Bài kiểm tra')
    }

    return quiz
  }

  public async updateQuizConfig(quizId: string, dto: UpdateQuizConfigDto) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) {
      throw new NotFoundError('Bài kiểm tra')
    }

    return prisma.quiz.update({
      where: { id: quizId },
      data: {
        title: dto.title,
        description: dto.description,
        passScore: dto.passScore,
        maxAttempts: dto.maxAttempts,
        timeLimitMinutes: dto.timeLimitMinutes,
        shuffleQuestions: dto.shuffleQuestions,
        showAnswerFeedback: dto.showAnswerFeedback,
      },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    })
  }

  // ==========================================
  // 2. QUESTION & OPTIONS BUILDER (LMS-056 -> LMS-060)
  // ==========================================

  public async createQuestion(quizId: string, dto: CreateQuestionDto) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) {
      throw new NotFoundError('Bài kiểm tra')
    }

    // Validation theo Business Rules
    this.validateQuestionOptions(dto.questionType, dto.options)

    let sortOrder = dto.sortOrder
    if (sortOrder === undefined) {
      const lastQuestion = await prisma.quizQuestion.findFirst({
        where: { quizId },
        orderBy: { sortOrder: 'desc' },
      })
      sortOrder = (lastQuestion?.sortOrder || 0) + 1
    }

    return prisma.$transaction(async (tx) => {
      const question = await tx.quizQuestion.create({
        data: {
          quizId,
          questionText: dto.questionText,
          questionType: dto.questionType,
          points: dto.points || 1.0,
          explanation: dto.explanation,
          sortOrder,
          options: {
            create: dto.options.map((opt, index) => ({
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              sortOrder: opt.sortOrder !== undefined ? opt.sortOrder : index + 1,
            })),
          },
        },
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      })

      return question
    })
  }

  public async updateQuestion(questionId: string, dto: UpdateQuestionDto) {
    const question = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: { options: true },
    })

    if (!question) {
      throw new NotFoundError('Câu hỏi kiểm tra')
    }

    const questionType = dto.questionType || question.questionType

    if (dto.options) {
      this.validateQuestionOptions(questionType, dto.options)
    }

    return prisma.$transaction(async (tx) => {
      // Nếu có cập nhật options -> Xóa cũ và tạo mới danh sách options
      if (dto.options) {
        await tx.quizQuestionOption.deleteMany({
          where: { questionId },
        })

        await tx.quizQuestionOption.createMany({
          data: dto.options.map((opt, index) => ({
            questionId,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            sortOrder: opt.sortOrder !== undefined ? opt.sortOrder : index + 1,
          })),
        })
      }

      const updated = await tx.quizQuestion.update({
        where: { id: questionId },
        data: {
          questionText: dto.questionText,
          questionType: dto.questionType,
          points: dto.points,
          explanation: dto.explanation,
          sortOrder: dto.sortOrder,
        },
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      })

      return updated
    })
  }

  public async deleteQuestion(questionId: string) {
    const question = await prisma.quizQuestion.findUnique({ where: { id: questionId } })
    if (!question) {
      throw new NotFoundError('Câu hỏi kiểm tra')
    }

    await prisma.quizQuestion.delete({ where: { id: questionId } })
    return { message: 'Đã xóa câu hỏi thành công' }
  }

  public async reorderQuestions(quizId: string, dto: ReorderQuestionsDto) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } })
    if (!quiz) {
      throw new NotFoundError('Bài kiểm tra')
    }

    await prisma.$transaction(
      dto.questionOrders.map((item) =>
        prisma.quizQuestion.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )

    return prisma.quizQuestion.findMany({
      where: { quizId },
      orderBy: { sortOrder: 'asc' },
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
      },
    })
  }

  // ==========================================
  // 3. PREVIEW QUIZ (LMS-068 / Trainer View)
  // ==========================================

  public async getQuizPreview(quizId: string) {
    const quiz = await this.getQuizById(quizId)
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        passScore: quiz.passScore,
        maxAttempts: quiz.maxAttempts,
        timeLimitMinutes: quiz.timeLimitMinutes,
        shuffleQuestions: quiz.shuffleQuestions,
        showAnswerFeedback: quiz.showAnswerFeedback,
        totalQuestions: quiz.questions.length,
        totalPoints,
      },
      questions: quiz.questions,
    }
  }

  // ==========================================
  // 4. LEARNER QUIZ TAKING & SUBMISSION (LMS-065 -> LMS-069)
  // ==========================================

  public async getQuizForTake(userId: string, quizOrLessonId: string) {
    // 1. Tìm quiz theo id hoặc lessonId
    let quiz = await prisma.quiz.findUnique({
      where: { id: quizOrLessonId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: {
                  select: { id: true, title: true, code: true },
                },
              },
            },
          },
        },
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                optionText: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    })

    if (!quiz) {
      quiz = await prisma.quiz.findUnique({
        where: { lessonId: quizOrLessonId },
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: {
                    select: { id: true, title: true, code: true },
                  },
                },
              },
            },
          },
          questions: {
            orderBy: { sortOrder: 'asc' },
            include: {
              options: {
                orderBy: { sortOrder: 'asc' },
                select: {
                  id: true,
                  optionText: true,
                  sortOrder: true,
                },
              },
            },
          },
        },
      })
    }

    if (!quiz) {
      throw new NotFoundError('Bài kiểm tra')
    }

    const courseId = quiz.lesson.module.course.id

    // 2. Kiểm tra ghi danh khóa học
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    // 3. Lấy lịch sử làm bài của học viên đối với Quiz này
    const previousAttempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: quiz.id,
        userId,
      },
      orderBy: { attemptNumber: 'desc' },
      select: {
        id: true,
        attemptNumber: true,
        score: true,
        isPassed: true,
        startedAt: true,
        submittedAt: true,
      },
    })

    const attemptCount = previousAttempts.length
    const isPassed = previousAttempts.some((a) => a.isPassed)
    const highestScore =
      previousAttempts.length > 0 ? Math.max(...previousAttempts.map((a) => a.score)) : null

    const maxAttempts = quiz.maxAttempts || 3
    const remainingAttempts = maxAttempts > 0 ? Math.max(0, maxAttempts - attemptCount) : 999
    const canAttempt = isPassed || maxAttempts === 0 || remainingAttempts > 0

    // 4. Xử lý danh sách câu hỏi: Shuffle câu hỏi & Shuffle đáp án (Options Randomization)
    let processedQuestions = quiz.questions.map((q, idx) => {
      let optionsList = [...q.options]

      // Xáo trộn ngẫu nhiên thứ tự các lựa chọn đáp án (Randomize Options)
      if (quiz.shuffleQuestions && q.questionType !== 'TRUE_FALSE') {
        for (let i = optionsList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          const temp = optionsList[i]
          optionsList[i] = optionsList[j]
          optionsList[j] = temp
        }
      }

      return {
        id: q.id,
        number: idx + 1,
        questionText: q.questionText,
        questionType: q.questionType,
        points: q.points,
        sortOrder: q.sortOrder,
        options: optionsList.map((opt, oIdx) => ({
          id: opt.id,
          letter: String.fromCharCode(65 + oIdx), // A, B, C, D...
          optionText: opt.optionText,
          sortOrder: opt.sortOrder,
        })),
      }
    })

    if (quiz.shuffleQuestions) {
      for (let i = processedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = processedQuestions[i]
        processedQuestions[i] = processedQuestions[j]
        processedQuestions[j] = temp
      }
      processedQuestions = processedQuestions.map((q, idx) => ({ ...q, number: idx + 1 }))
    }

    const totalPoints = processedQuestions.reduce((sum, q) => sum + q.points, 0)

    return {
      quiz: {
        id: quiz.id,
        lessonId: quiz.lessonId,
        title: quiz.title,
        description: quiz.description,
        passScore: quiz.passScore,
        maxAttempts: quiz.maxAttempts,
        timeLimitMinutes: quiz.timeLimitMinutes,
        shuffleQuestions: quiz.shuffleQuestions,
        showAnswerFeedback: quiz.showAnswerFeedback,
        totalQuestions: processedQuestions.length,
        totalPoints,
        course: {
          id: quiz.lesson.module.course.id,
          title: quiz.lesson.module.course.title,
          code: quiz.lesson.module.course.code,
        },
        module: {
          id: quiz.lesson.module.id,
          title: quiz.lesson.module.title,
        },
        lesson: {
          id: quiz.lesson.id,
          title: quiz.lesson.title,
        },
      },
      studentStatus: {
        isEnrolled: Boolean(enrollment),
        attemptCount,
        remainingAttempts: maxAttempts > 0 ? remainingAttempts : null,
        highestScore,
        isPassed,
        canAttempt,
        previousAttempts,
      },
      questions: processedQuestions,
    }
  }

  public async submitQuiz(userId: string, quizOrLessonId: string, dto: SubmitQuizDto) {
    // 1. Tìm quiz với đầy đủ options (kèm isCorrect) và câu hỏi
    let quiz = await prisma.quiz.findUnique({
      where: { id: quizOrLessonId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    })

    if (!quiz) {
      quiz = await prisma.quiz.findUnique({
        where: { lessonId: quizOrLessonId },
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: true,
                },
              },
            },
          },
          questions: {
            orderBy: { sortOrder: 'asc' },
            include: {
              options: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      })
    }

    if (!quiz) {
      throw new NotFoundError('Bài kiểm tra')
    }

    const courseId = quiz.lesson.module.courseId

    // 2. Kiểm tra Enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (!enrollment) {
      throw new BadRequestError('Học viên chưa ghi danh vào khóa học này')
    }

    // 3. Kiểm tra số lần thi
    const previousAttempts = await prisma.quizAttempt.findMany({
      where: { quizId: quiz.id, userId },
    })

    const attemptNumber = previousAttempts.length + 1
    const maxAttempts = quiz.maxAttempts || 3

    if (maxAttempts > 0 && previousAttempts.length >= maxAttempts) {
      const alreadyPassed = previousAttempts.some((a) => a.isPassed)
      if (!alreadyPassed) {
        throw new BadRequestError(
          `Bạn đã hết số lần làm bài kiểm tra cho phép (tối đa ${maxAttempts} lần). Vui lòng liên hệ giảng viên hoặc quản trị viên.`
        )
      }
    }

    // 4. Chấm điểm từng câu hỏi
    const answerMap = new Map(dto.answers.map((a) => [a.questionId, a]))
    let totalEarnedPoints = 0
    let totalPossiblePoints = 0
    let correctCount = 0
    let incorrectCount = 0

    const attemptAnswersData: Array<{
      questionId: string
      selectedOptionId?: string | null
      textAnswer?: string | null
      isCorrect: boolean
      earnedPoints: number
    }> = []

    const reviewQuestions = quiz.questions.map((q, idx) => {
      const userAns = answerMap.get(q.id)
      totalPossiblePoints += q.points

      let isCorrect = false
      let earnedPoints = 0
      let selectedOptionId: string | null = null
      let textAnswer: string | null = null

      if (q.questionType === 'SINGLE_CHOICE' || q.questionType === 'TRUE_FALSE') {
        selectedOptionId = userAns?.selectedOptionId || null
        const correctOption = q.options.find((o) => o.isCorrect)
        if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
          isCorrect = true
          earnedPoints = q.points
        }
      } else if (q.questionType === 'MULTIPLE_CHOICE') {
        const selectedIds = new Set(
          userAns?.selectedOptionIds || (userAns?.selectedOptionId ? [userAns.selectedOptionId] : [])
        )
        selectedOptionId = Array.from(selectedIds).join(',')
        const correctOptionIds = q.options.filter((o) => o.isCorrect).map((o) => o.id)

        const allSelectedAreCorrect =
          correctOptionIds.length === selectedIds.size &&
          correctOptionIds.every((id) => selectedIds.has(id))

        if (allSelectedAreCorrect) {
          isCorrect = true
          earnedPoints = q.points
        }
      } else if (q.questionType === 'SHORT_ANSWER') {
        textAnswer = userAns?.textAnswer?.trim() || ''
        const correctOptions = q.options.filter((o) => o.isCorrect)
        const isMatch = correctOptions.some(
          (o) => o.optionText.trim().toLowerCase() === textAnswer?.toLowerCase()
        )
        if (isMatch) {
          isCorrect = true
          earnedPoints = q.points
        }
      }

      if (isCorrect) {
        correctCount++
        totalEarnedPoints += earnedPoints
      } else {
        incorrectCount++
      }

      attemptAnswersData.push({
        questionId: q.id,
        selectedOptionId,
        textAnswer,
        isCorrect,
        earnedPoints,
      })

      return {
        id: q.id,
        number: idx + 1,
        questionText: q.questionText,
        questionType: q.questionType,
        points: q.points,
        earnedPoints,
        isCorrect,
        explanation: quiz.showAnswerFeedback ? q.explanation : null,
        userAnswer: {
          selectedOptionId,
          selectedOptionIds:
            userAns?.selectedOptionIds ||
            (selectedOptionId ? selectedOptionId.split(',').map((s) => s.trim()).filter(Boolean) : []),
          textAnswer,
        },
        options: q.options.map((opt, oIdx) => ({
          id: opt.id,
          letter: String.fromCharCode(65 + oIdx),
          optionText: opt.optionText,
          isCorrect: quiz.showAnswerFeedback ? opt.isCorrect : undefined,
        })),
      }
    })

    const scorePercentage =
      totalPossiblePoints > 0
        ? Math.round((totalEarnedPoints / totalPossiblePoints) * 100 * 10) / 10
        : 100
    const isPassed = scorePercentage >= quiz.passScore

    // 5. Lưu vào Database trong Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      // A. Tạo QuizAttempt
      const attempt = await tx.quizAttempt.create({
        data: {
          quizId: quiz.id,
          userId,
          attemptNumber,
          score: scorePercentage,
          isPassed,
          submittedAt: new Date(),
          answers: {
            create: attemptAnswersData.map((ans) => ({
              questionId: ans.questionId,
              selectedOptionId: ans.selectedOptionId,
              textAnswer: ans.textAnswer,
              isCorrect: ans.isCorrect,
              earnedPoints: ans.earnedPoints,
            })),
          },
        },
      })

      // B. Cập nhật LessonProgress
      const existingProgress = await tx.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: quiz.lessonId,
          },
        },
      })

      const prevHighScore = existingProgress?.quizHighestScore || 0
      const newHighestScore = Math.max(prevHighScore, scorePercentage)
      const newIsCompleted = existingProgress?.isCompleted || isPassed

      await tx.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: quiz.lessonId,
          },
        },
        update: {
          quizHighestScore: newHighestScore,
          isCompleted: newIsCompleted,
          completedAt: newIsCompleted ? existingProgress?.completedAt || new Date() : null,
        },
        create: {
          enrollmentId: enrollment.id,
          userId,
          lessonId: quiz.lessonId,
          quizHighestScore: newHighestScore,
          isCompleted: isPassed,
          completedAt: isPassed ? new Date() : null,
        },
      })

      // C. Cập nhật CourseEnrollment nếu bài học này được hoàn thành
      let courseCompleted = false
      if (newIsCompleted) {
        const allCourseLessons = await tx.lesson.findMany({
          where: {
            module: { courseId },
            isVisible: true,
          },
          select: { id: true },
        })

        const totalLessonsCount = allCourseLessons.length
        if (totalLessonsCount > 0) {
          const completedLessonsCount = await tx.lessonProgress.count({
            where: {
              userId,
              lessonId: { in: allCourseLessons.map((l) => l.id) },
              isCompleted: true,
            },
          })

          const completionPct = (completedLessonsCount / totalLessonsCount) * 100
          courseCompleted = completionPct >= 100

          await tx.courseEnrollment.update({
            where: { id: enrollment.id },
            data: {
              completionPercentage: Math.round(completionPct * 100) / 100,
              status: courseCompleted ? 'COMPLETED' : 'IN_PROGRESS',
              isPassed: courseCompleted,
              completedAt: courseCompleted ? new Date() : enrollment.completedAt,
            },
          })
        }
      }

      return { attempt, courseCompleted }
    })

    // 6. Ghi LMS Activity Log & Tự động cấp bằng nếu 100%
    try {
      await lmsActivityLogService.logActivity({
        userId,
        courseId,
        lessonId: quiz.lessonId,
        activityType: LmsActivityType.QUIZ_ATTEMPTED,
        actionTitle: `Làm bài kiểm tra: ${quiz.title}`,
        targetName: `${quiz.title} (${scorePercentage}% - ${isPassed ? 'ĐẠT' : 'CHƯA ĐẠT'})`,
        status: isPassed ? 'SUCCESS' : 'FAILED',
        statusLabel: isPassed ? 'Đạt' : 'Chưa đạt',
      })

      if (isPassed) {
        await lmsActivityLogService.logActivity({
          userId,
          courseId,
          lessonId: quiz.lessonId,
          activityType: LmsActivityType.LESSON_COMPLETED,
          actionTitle: 'Hoàn thành bài kiểm tra trắc nghiệm',
          targetName: `${quiz.lesson.title} (${quiz.lesson.module.course.title})`,
          status: 'SUCCESS',
          statusLabel: 'Hoàn thành',
        })
      }

      if (result.courseCompleted) {
        const courseWithCert = await prisma.course.findUnique({
          where: { id: courseId },
          include: { certificateTemplate: true },
        })

        if (courseWithCert && (courseWithCert.hasCertificate || courseWithCert.certificateTemplateId)) {
          const existingCert = await prisma.userCertificate.findFirst({
            where: {
              userId,
              courseId,
              status: { not: 'REVOKED' },
            },
          })

          if (!existingCert) {
            const student = await prisma.user.findUnique({ where: { id: userId } })
            await certificateService.issueCertificate({
              userId,
              courseId,
              templateId: courseWithCert.certificateTemplateId || null,
              title: `Chứng chỉ: ${courseWithCert.title}`,
              recipientName: student?.fullName || 'Học viên',
            })
          }
        }
      }
    } catch (logErr) {
      console.warn('[submitQuiz] Lỗi ghi activity log / certificate:', logErr)
    }

    // 7. Tìm bài học tiếp theo (Next lesson in sequence)
    const allOrderedLessons = await prisma.lesson.findMany({
      where: {
        module: { courseId },
        isVisible: true,
      },
      orderBy: [
        { module: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
      ],
      select: {
        id: true,
        title: true,
        lessonType: true,
      },
    })

    const currentLessonIndex = allOrderedLessons.findIndex((l) => l.id === quiz.lessonId)
    const nextLesson =
      currentLessonIndex >= 0 && currentLessonIndex < allOrderedLessons.length - 1
        ? allOrderedLessons[currentLessonIndex + 1]
        : null

    const remainingAttempts = maxAttempts > 0 ? Math.max(0, maxAttempts - attemptNumber) : null

    return {
      attemptId: result.attempt.id,
      attemptNumber,
      score: scorePercentage,
      passScore: quiz.passScore,
      isPassed,
      totalPointsEarned: totalEarnedPoints,
      totalPointsPossible: totalPossiblePoints,
      totalQuestions: quiz.questions.length,
      correctCount,
      incorrectCount,
      maxAttempts: quiz.maxAttempts,
      remainingAttempts,
      showAnswerFeedback: quiz.showAnswerFeedback,
      courseId,
      courseTitle: quiz.lesson.module.course.title,
      lessonId: quiz.lessonId,
      lessonTitle: quiz.lesson.title,
      reviewQuestions,
      nextLesson,
      isCourseCompleted: result.courseCompleted,
    }
  }

  public async getUserQuizAttempts(userId: string, quizOrLessonId: string) {
    let quiz = await prisma.quiz.findUnique({
      where: { id: quizOrLessonId },
      select: { id: true, title: true, passScore: true, maxAttempts: true },
    })

    if (!quiz) {
      quiz = await prisma.quiz.findUnique({
        where: { lessonId: quizOrLessonId },
        select: { id: true, title: true, passScore: true, maxAttempts: true },
      })
    }

    if (!quiz) {
      throw new NotFoundError('Bài kiểm tra')
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId: quiz.id, userId },
      orderBy: { attemptNumber: 'desc' },
      include: {
        answers: {
          include: {
            question: {
              select: { id: true, questionText: true, points: true, questionType: true },
            },
          },
        },
      },
    })

    return {
      quiz,
      attempts,
    }
  }


  // ==========================================
  // HELPER VALIDATION
  // ==========================================

  private validateQuestionOptions(
    type: string,
    options: Array<{ optionText: string; isCorrect: boolean }>
  ) {
    if (!options || options.length < 2) {
      throw new BadRequestError('Câu hỏi bắt buộc phải có tối thiểu 2 lựa chọn đáp án')
    }

    const correctCount = options.filter((o) => o.isCorrect).length

    if (type === 'SINGLE_CHOICE' || type === 'TRUE_FALSE') {
      if (correctCount !== 1) {
        throw new BadRequestError('Câu hỏi trắc nghiệm 1 đáp án (hoặc Đúng/Sai) bắt buộc phải có đúng 1 đáp án đúng')
      }
    } else if (type === 'MULTIPLE_CHOICE') {
      if (correctCount < 1) {
        throw new BadRequestError('Câu hỏi trắc nghiệm nhiều đáp án bắt buộc phải có ít nhất 1 đáp án đúng')
      }
    }
  }
}

export const quizService = new QuizService()
