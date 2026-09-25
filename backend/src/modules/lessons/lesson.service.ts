import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import {
  CreateLessonDto,
  UpdateLessonDto,
  ReorderLessonsDto,
  ParseYoutubeDto,
  CreateLessonResourceDto,
  UpdateLessonResourceDto,
} from './lesson.dto'

export class LessonService {
  // ==========================================
  // 1. LESSON CRUD (LMS-013 -> LMS-018)
  // ==========================================

  public async getLessonById(id: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            courseId: true,
            course: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
        quiz: {
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
        },
        resources: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    return lesson
  }

  public async createLesson(moduleId: string, dto: CreateLessonDto) {
    const module = await prisma.courseModule.findUnique({
      where: { id: moduleId },
    })

    if (!module) {
      throw new NotFoundError('Chương học')
    }

    let sortOrder = dto.sortOrder
    if (sortOrder === undefined) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { sortOrder: 'desc' },
      })
      sortOrder = (lastLesson?.sortOrder || 0) + 1
    }

    return prisma.$transaction(async (tx) => {
      const newLesson = await tx.lesson.create({
        data: {
          moduleId,
          title: dto.title,
          description: dto.description,
          lessonType: dto.lessonType,
          videoProvider: dto.videoProvider,
          videoUrl: dto.videoUrl,
          videoStoragePath: dto.videoStoragePath,
          videoDuration: dto.videoDuration || 0,
          bodyHtml: dto.bodyHtml,
          documentUrl: dto.documentUrl,
          estimatedReadTime: dto.estimatedReadTime || 5,
          checklistItems: dto.checklistItems,
          sopCode: dto.sopCode,
          sopType: dto.sopType,
          requiresSignature: dto.requiresSignature || false,
          allowDownload: dto.allowDownload || false,
          allowSeeking: dto.allowSeeking ?? true,
          isVisible: dto.isVisible ?? true,
          sortOrder,
        },
      })

      // Nếu tạo bài học dạng QUIZ, tự động khởi tạo bản ghi Quiz rỗng
      if (dto.lessonType === 'QUIZ') {
        await tx.quiz.create({
          data: {
            lessonId: newLesson.id,
            title: `Bài kiểm tra: ${newLesson.title}`,
            description: dto.description || 'Vui lòng hoàn thành tất cả các câu hỏi dưới đây.',
            passScore: 80,
            maxAttempts: 3,
            timeLimitMinutes: 30,
            shuffleQuestions: true,
            showAnswerFeedback: true,
          },
        })
      }

      return tx.lesson.findUnique({
        where: { id: newLesson.id },
        include: {
          quiz: {
            include: {
              questions: {
                include: { options: true },
              },
            },
          },
        },
      })
    })
  }

  public async updateLesson(id: string, dto: UpdateLessonDto) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { quiz: true },
    })

    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    return prisma.$transaction(async (tx) => {
      const updatedLesson = await tx.lesson.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          lessonType: dto.lessonType,
          videoProvider: dto.videoProvider,
          videoUrl: dto.videoUrl,
          videoStoragePath: dto.videoStoragePath,
          videoDuration: dto.videoDuration,
          bodyHtml: dto.bodyHtml,
          documentUrl: dto.documentUrl,
          estimatedReadTime: dto.estimatedReadTime,
          checklistItems: dto.checklistItems,
          sopCode: dto.sopCode,
          sopType: dto.sopType,
          requiresSignature: dto.requiresSignature,
          allowDownload: dto.allowDownload,
          allowSeeking: dto.allowSeeking,
          isVisible: dto.isVisible,
          sortOrder: dto.sortOrder,
        },
        include: {
          quiz: true,
        },
      })

      // Nếu chuyển đổi thành QUIZ mà chưa có Quiz record, tự khởi tạo
      if (dto.lessonType === 'QUIZ' && !lesson.quiz) {
        await tx.quiz.create({
          data: {
            lessonId: id,
            title: `Bài kiểm tra: ${updatedLesson.title}`,
            passScore: 80,
            maxAttempts: 3,
            timeLimitMinutes: 30,
            shuffleQuestions: true,
            showAnswerFeedback: true,
          },
        })
      }

      return tx.lesson.findUnique({
        where: { id },
        include: {
          quiz: {
            include: {
              questions: {
                include: { options: true },
              },
            },
          },
        },
      })
    })
  }

  public async deleteLesson(id: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id } })
    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    await prisma.lesson.delete({ where: { id } })
    return { message: 'Đã xóa bài học thành công' }
  }

  public async reorderLessons(moduleId: string, dto: ReorderLessonsDto) {
    const module = await prisma.courseModule.findUnique({ where: { id: moduleId } })
    if (!module) {
      throw new NotFoundError('Chương học')
    }

    await prisma.$transaction(
      dto.lessonOrders.map((item) =>
        prisma.lesson.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )

    return prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { sortOrder: 'asc' },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            passScore: true,
            _count: { select: { questions: true } },
          },
        },
      },
    })
  }

  // ==========================================
  // 2. YOUTUBE PARSER UTILITY
  // ==========================================

  public parseYoutubeUrl(dto: ParseYoutubeDto) {
    const url = dto.url.trim()
    let videoId: string | null = null

    // Match patterns: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)

    if (match && match[2].length === 11) {
      videoId = match[2]
    }

    if (!videoId) {
      throw new BadRequestError('URL YouTube không hợp lệ. Vui lòng nhập link chuẩn (VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ)')
    }

    return {
      videoId,
      originalUrl: url,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    }
  }

  // ==========================================
  // 3. LESSON RESOURCES (Tài nguyên bài học)
  // ==========================================

  public async getLessonResources(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    return prisma.lessonResource.findMany({
      where: { lessonId },
      orderBy: { sortOrder: 'asc' },
    })
  }

  public async addLessonResource(lessonId: string, dto: CreateLessonResourceDto) {
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) {
      throw new NotFoundError('Bài học')
    }

    let sortOrder = dto.sortOrder
    if (sortOrder === undefined) {
      const lastResource = await prisma.lessonResource.findFirst({
        where: { lessonId },
        orderBy: { sortOrder: 'desc' },
      })
      sortOrder = (lastResource?.sortOrder || 0) + 1
    }

    return prisma.lessonResource.create({
      data: {
        lessonId,
        title: dto.title,
        description: dto.description,
        resourceType: dto.resourceType,
        url: dto.url,
        storagePath: dto.storagePath,
        fileSizeBytes: dto.fileSizeBytes,
        fileExtension: dto.fileExtension,
        sortOrder,
        isDownloadable: dto.isDownloadable ?? true,
      },
    })
  }

  public async updateLessonResource(resourceId: string, dto: UpdateLessonResourceDto) {
    const resource = await prisma.lessonResource.findUnique({ where: { id: resourceId } })
    if (!resource) {
      throw new NotFoundError('Tài nguyên bài học')
    }

    return prisma.lessonResource.update({
      where: { id: resourceId },
      data: {
        title: dto.title,
        description: dto.description,
        resourceType: dto.resourceType,
        url: dto.url,
        storagePath: dto.storagePath,
        fileSizeBytes: dto.fileSizeBytes,
        fileExtension: dto.fileExtension,
        sortOrder: dto.sortOrder,
        isDownloadable: dto.isDownloadable,
      },
    })
  }

  public async deleteLessonResource(resourceId: string) {
    const resource = await prisma.lessonResource.findUnique({ where: { id: resourceId } })
    if (!resource) {
      throw new NotFoundError('Tài nguyên bài học')
    }

    return prisma.lessonResource.delete({ where: { id: resourceId } })
  }
}

export const lessonService = new LessonService()
