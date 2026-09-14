import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import {
  UpdateQuizConfigDto,
  CreateQuestionDto,
  UpdateQuestionDto,
  ReorderQuestionsDto,
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
