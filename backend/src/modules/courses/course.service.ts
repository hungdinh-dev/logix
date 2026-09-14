import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { LmsActivityType } from '@prisma/client'
import { lmsActivityLogService } from '../activity-logs/activity-log.service'
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateCourseDto,
  UpdateCourseDto,
  UpdateCourseStatusDto,
  CreateModuleDto,
  UpdateModuleDto,
  ReorderModulesDto,
  SyncCurriculumDto,
} from './course.dto'

export class CourseService {
  // ==========================================
  // 1. CATEGORY MANAGEMENT (LMS-001)
  // ==========================================

  public async getAllCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })
  }

  public async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        courses: {
          where: { isActive: true },
          select: {
            id: true,
            code: true,
            title: true,
            status: true,
            isMandatory: true,
          },
        },
      },
    })
    if (!category || !category.isActive) {
      throw new NotFoundError('Danh mục khóa học')
    }
    return category
  }

  public async createCategory(dto: CreateCategoryDto) {
    const existing = await prisma.category.findUnique({
      where: { code: dto.code },
    })

    if (existing) {
      if (!existing.isActive) {
        return prisma.category.update({
          where: { id: existing.id },
          data: {
            name: dto.name,
            description: dto.description,
            sortOrder: dto.sortOrder || 0,
            isActive: true,
          },
        })
      }
      throw new BadRequestError(`Mã danh mục '${dto.code}' đã tồn tại`)
    }

    return prisma.category.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder || 0,
      },
    })
  }

  public async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category || !category.isActive) {
      throw new NotFoundError('Danh mục khóa học')
    }

    return prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
    })
  }

  public async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category || !category.isActive) {
      throw new NotFoundError('Danh mục khóa học')
    }

    // Soft delete
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    })
  }

  // ==========================================
  // 2. COURSE MANAGEMENT (LMS-002 -> LMS-012)
  // ==========================================

  public async getAllCourses(params?: {
    search?: string
    categoryId?: string
    status?: string
    isMandatory?: boolean
    targetPositionId?: string
    targetDepartmentId?: string
    targetStoreId?: string
    targetEmploymentStatus?: string
  }) {
    const whereCondition: any = {
      isActive: true,
    }

    if (params?.status) {
      whereCondition.status = params.status
    }

    if (params?.categoryId) {
      whereCondition.categoryId = params.categoryId
    }

    if (params?.isMandatory !== undefined) {
      whereCondition.isMandatory = params.isMandatory
    }

    if (params?.targetPositionId) {
      whereCondition.targetPositionId = params.targetPositionId
    }

    if (params?.targetDepartmentId) {
      whereCondition.targetDepartmentId = params.targetDepartmentId
    }

    if (params?.targetStoreId) {
      whereCondition.targetStoreId = params.targetStoreId
    }

    if (params?.targetEmploymentStatus) {
      whereCondition.targetEmploymentStatus = params.targetEmploymentStatus
    }

    if (params?.search) {
      whereCondition.OR = [
        { title: { contains: String(params.search), mode: 'insensitive' } },
        { description: { contains: String(params.search), mode: 'insensitive' } },
        { code: { contains: String(params.search), mode: 'insensitive' } },
      ]
    }

    return prisma.course.findMany({
      where: whereCondition,
      include: {
        category: true,
        targetPosition: true,
        targetDepartment: true,
        targetStore: true,
        certificateTemplate: true,
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              where: { isVisible: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  public async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        targetPosition: true,
        targetDepartment: true,
        targetStore: true,
        certificateTemplate: true,
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              include: {
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
              },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    })

    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    return course
  }

  // LMS-002, LMS-009, LMS-010, LMS-011, LMS-012
  public async createCourse(dto: CreateCourseDto) {
    const existing = await prisma.course.findFirst({
      where: {
        OR: [{ code: dto.code }, { slug: dto.slug }],
      },
    })

    if (existing) {
      if (!existing.isActive) {
        return prisma.course.update({
          where: { id: existing.id },
          data: {
            title: dto.title,
            slug: dto.slug,
            description: dto.description,
            thumbnailUrl: dto.thumbnailUrl,
            categoryId: dto.categoryId,
            courseType: dto.courseType || 'STANDARD',
            isMandatory: dto.isMandatory || false,
            durationDays: dto.durationDays || 30,
            progressionMode: (dto.progressionMode as any) || 'LINEAR_LESSON',
            targetPositionId: dto.targetPositionId,
            targetDepartmentId: dto.targetDepartmentId,
            targetStoreId: dto.targetStoreId,
            targetEmploymentStatus: dto.targetEmploymentStatus,
            status: 'DRAFT',
            isActive: true,
          },
        })
      }
      throw new BadRequestError(`Mã khóa học '${dto.code}' hoặc slug '${dto.slug}' đã tồn tại`)
    }

    return prisma.course.create({
      data: {
        code: dto.code,
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        categoryId: dto.categoryId,
        courseType: dto.courseType || 'STANDARD',
        isMandatory: dto.isMandatory || false,
        durationDays: dto.durationDays !== undefined ? dto.durationDays : null,
        progressionMode: (dto.progressionMode as any) || 'FREE',
        targetPositionId: dto.targetPositionId,
        targetDepartmentId: dto.targetDepartmentId,
        targetStoreId: dto.targetStoreId,
        targetEmploymentStatus: dto.targetEmploymentStatus,
        hasCertificate: dto.hasCertificate ?? false,
        certificateTemplateId: dto.certificateTemplateId || null,
        status: 'DRAFT',
        isActive: true,
      },
      include: {
        category: true,
        targetPosition: true,
        targetDepartment: true,
        targetStore: true,
        certificateTemplate: true,
      },
    })
  }

  public async updateCourse(id: string, dto: UpdateCourseDto) {
    const course = await prisma.course.findUnique({ where: { id } })
    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    return prisma.course.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
        categoryId: dto.categoryId,
        courseType: dto.courseType,
        isMandatory: dto.isMandatory,
        durationDays: dto.durationDays,
        progressionMode: dto.progressionMode as any,
        targetPositionId: dto.targetPositionId,
        targetDepartmentId: dto.targetDepartmentId,
        targetStoreId: dto.targetStoreId,
        targetEmploymentStatus: dto.targetEmploymentStatus,
        hasCertificate: dto.hasCertificate,
        certificateTemplateId:
          dto.certificateTemplateId !== undefined
            ? dto.certificateTemplateId
            : undefined,
        status: dto.status,
      },
      include: {
        category: true,
        targetPosition: true,
        targetDepartment: true,
        targetStore: true,
        certificateTemplate: true,
      },
    })
  }

  // LMS-003: Sao chép khóa học (Clone course)
  public async cloneCourse(id: string) {
    const sourceCourse = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    })

    if (!sourceCourse || !sourceCourse.isActive) {
      throw new NotFoundError('Khóa học gốc')
    }

    const timestamp = Date.now().toString().slice(-4)
    const newCode = `${sourceCourse.code}_COPY_${timestamp}`
    const newSlug = `${sourceCourse.slug}-copy-${timestamp}`
    const newTitle = `(Bản sao) ${sourceCourse.title}`

    return prisma.$transaction(async (tx) => {
      const clonedCourse = await tx.course.create({
        data: {
          code: newCode,
          title: newTitle,
          slug: newSlug,
          description: sourceCourse.description,
          thumbnailUrl: sourceCourse.thumbnailUrl,
          categoryId: sourceCourse.categoryId,
          courseType: sourceCourse.courseType,
          isMandatory: sourceCourse.isMandatory,
          durationDays: sourceCourse.durationDays,
          progressionMode: sourceCourse.progressionMode,
          targetPositionId: sourceCourse.targetPositionId,
          targetDepartmentId: sourceCourse.targetDepartmentId,
          targetStoreId: sourceCourse.targetStoreId,
          targetEmploymentStatus: sourceCourse.targetEmploymentStatus,
          status: 'DRAFT', // Luôn tạo ở trạng thái nháp
          isActive: true,
        },
      })

      for (const mod of sourceCourse.modules) {
        const clonedModule = await tx.courseModule.create({
          data: {
            courseId: clonedCourse.id,
            title: mod.title,
            sortOrder: mod.sortOrder,
          },
        })

        for (const les of mod.lessons) {
          await tx.lesson.create({
            data: {
              moduleId: clonedModule.id,
              title: les.title,
              description: les.description,
              lessonType: les.lessonType,
              videoProvider: les.videoProvider,
              videoUrl: les.videoUrl,
              videoStoragePath: les.videoStoragePath,
              videoDuration: les.videoDuration,
              documentUrl: les.documentUrl,
              bodyHtml: les.bodyHtml,
              estimatedReadTime: les.estimatedReadTime,
              checklistItems: les.checklistItems,
              sopCode: les.sopCode,
              sopType: les.sopType,
              requiresSignature: les.requiresSignature,
              allowDownload: les.allowDownload,
              allowSeeking: les.allowSeeking,
              isVisible: les.isVisible,
              sortOrder: les.sortOrder,
            },
          })
        }
      }

      return tx.course.findUnique({
        where: { id: clonedCourse.id },
        include: {
          category: true,
          modules: {
            include: { lessons: true },
          },
        },
      })
    })
  }

  // LMS-004: Ngưng / Kích hoạt khóa học
  public async updateCourseStatus(id: string, dto: UpdateCourseStatusDto) {
    const course = await prisma.course.findUnique({ where: { id } })
    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    return prisma.course.update({
      where: { id },
      data: { status: dto.status },
      include: { category: true },
    })
  }

  public async deleteCourse(id: string) {
    const course = await prisma.course.findUnique({ where: { id } })
    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    // Soft delete
    return prisma.course.update({
      where: { id },
      data: { isActive: false, status: 'ARCHIVED' },
    })
  }

  // ==========================================
  // 3. AUTO-ASSIGN RULES & ENROLLMENT (LMS-005 -> LMS-008, LMS-044)
  // ==========================================

  // LMS-005: Gán theo Chức danh
  public async assignToPosition(courseId: string, positionId: string) {
    const course = await this.getCourseById(courseId)
    const position = await prisma.position.findUnique({ where: { id: positionId } })
    if (!position || !position.isActive) {
      throw new NotFoundError('Chức danh công việc')
    }

    // Update target on course
    await prisma.course.update({
      where: { id: courseId },
      data: { targetPositionId: positionId },
    })

    // Auto-enroll all active users with this position
    const users = await prisma.user.findMany({
      where: { positionId, isActive: true },
      select: { id: true },
    })

    return this.bulkEnrollUsers(course, users.map((u) => u.id), 'AUTO_RULE_POSITION')
  }

  // LMS-006: Gán theo Loại nhân sự (Học việc / Chính thức)
  public async assignToEmploymentStatus(courseId: string, employmentStatus: string) {
    const course = await this.getCourseById(courseId)

    await prisma.course.update({
      where: { id: courseId },
      data: { targetEmploymentStatus: employmentStatus },
    })

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        ...(employmentStatus !== 'ALL' ? { employmentStatus } : {}),
      },
      select: { id: true },
    })

    return this.bulkEnrollUsers(course, users.map((u) => u.id), 'AUTO_RULE_EMPLOYMENT_STATUS')
  }

  // LMS-007: Gán theo Cửa hàng
  public async assignToStore(courseId: string, storeId: string) {
    const course = await this.getCourseById(courseId)
    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store || !store.isActive) {
      throw new NotFoundError('Cửa hàng / Chi nhánh')
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { targetStoreId: storeId },
    })

    const users = await prisma.user.findMany({
      where: { storeId, isActive: true },
      select: { id: true },
    })

    return this.bulkEnrollUsers(course, users.map((u) => u.id), 'AUTO_RULE_STORE')
  }

  // LMS-008: Gán theo Bộ phận sản xuất / Khâu xưởng
  public async assignToDepartment(courseId: string, departmentId: string) {
    const course = await this.getCourseById(courseId)
    const department = await prisma.department.findUnique({ where: { id: departmentId } })
    if (!department || !department.isActive) {
      throw new NotFoundError('Bộ phận / Khâu sản xuất')
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { targetDepartmentId: departmentId },
    })

    const users = await prisma.user.findMany({
      where: { departmentId, isActive: true },
      select: { id: true },
    })

    return this.bulkEnrollUsers(course, users.map((u) => u.id), 'AUTO_RULE_DEPARTMENT')
  }

  // Ghi danh cá nhân thủ công (LMS-044) & tính deadline (LMS-011)
  public async enrollCourse(userId: string, courseId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (existingEnrollment) {
      return existingEnrollment
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + (course.durationDays || 30))

    const newEnrollment = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        enrollmentSource: 'MANUAL',
        status: 'ENROLLED',
        dueDate,
      },
    })

    // Log Activity
    await lmsActivityLogService.logActivity({
      userId,
      courseId,
      activityType: LmsActivityType.ENROLLED,
      actionTitle: 'Ghi danh khóa học',
      targetName: course.title,
      status: 'ACTIVE',
      statusLabel: 'Đang học',
    })

    return newEnrollment
  }

  private async bulkEnrollUsers(course: any, userIds: string[], source: string) {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + (course.durationDays || 30))

    let enrolledCount = 0
    for (const userId of userIds) {
      const exists = await prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
      })
      if (!exists) {
        await prisma.courseEnrollment.create({
          data: {
            userId,
            courseId: course.id,
            enrollmentSource: source,
            status: 'ENROLLED',
            dueDate,
          },
        })
        enrolledCount++

        // Log Activity for auto enrollment
        await lmsActivityLogService.logActivity({
          userId,
          courseId: course.id,
          activityType: LmsActivityType.ENROLLED,
          actionTitle: 'Tự động gán khóa học',
          targetName: course.title,
          status: 'ACTIVE',
          statusLabel: 'Đang học',
          metadata: { ruleSource: source },
        })
      }
    }

    return {
      message: `Đã tự động gán khóa học '${course.title}' cho ${enrolledCount}/${userIds.length} học viên`,
      totalTargetUsers: userIds.length,
      newlyEnrolledCount: enrolledCount,
    }
  }


  // ==========================================
  // 4. CURRICULUM & MODULE MANAGEMENT (LMS-017)
  // ==========================================

  // Lấy toàn bộ cây Chương & Bài học (kèm Quiz metadata)
  public async getCourseCurriculum(courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              include: {
                quiz: {
                  select: {
                    id: true,
                    title: true,
                    passScore: true,
                    maxAttempts: true,
                    timeLimitMinutes: true,
                    shuffleQuestions: true,
                    _count: {
                      select: { questions: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    return course
  }

  // Tạo Chương học mới
  public async createModule(courseId: string, dto: CreateModuleDto) {
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    let sortOrder = dto.sortOrder
    if (sortOrder === undefined) {
      const lastModule = await prisma.courseModule.findFirst({
        where: { courseId },
        orderBy: { sortOrder: 'desc' },
      })
      sortOrder = (lastModule?.sortOrder || 0) + 1
    }

    return prisma.courseModule.create({
      data: {
        courseId,
        title: dto.title,
        sortOrder,
      },
      include: {
        lessons: true,
      },
    })
  }

  // Cập nhật Chương học
  public async updateModule(moduleId: string, dto: UpdateModuleDto) {
    const module = await prisma.courseModule.findUnique({ where: { id: moduleId } })
    if (!module) {
      throw new NotFoundError('Chương học')
    }

    return prisma.courseModule.update({
      where: { id: moduleId },
      data: {
        title: dto.title,
        sortOrder: dto.sortOrder,
      },
      include: {
        lessons: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }

  // Xóa Chương học (Cascade xóa toàn bộ bài học & quiz bên trong)
  public async deleteModule(moduleId: string) {
    const module = await prisma.courseModule.findUnique({ where: { id: moduleId } })
    if (!module) {
      throw new NotFoundError('Chương học')
    }

    await prisma.courseModule.delete({ where: { id: moduleId } })
    return { message: 'Đã xóa chương học thành công' }
  }

  // Sắp xếp lại danh sách Chương học trong Khóa học
  public async reorderModules(courseId: string, dto: ReorderModulesDto) {
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    await prisma.$transaction(
      dto.moduleOrders.map((item) =>
        prisma.courseModule.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )

    return prisma.courseModule.findMany({
      where: { courseId },
      orderBy: { sortOrder: 'asc' },
      include: {
        lessons: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }

  // ==========================================
  // SYNC FULL CURRICULUM (Modules -> Lessons -> Quiz -> Questions -> Options)
  // ==========================================
  public async syncCourseCurriculum(courseId: string, dto: SyncCurriculumDto) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                quiz: {
                  include: {
                    questions: {
                      include: {
                        options: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!course || !course.isActive) {
      throw new NotFoundError('Khóa học')
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update Course title if given
      if (dto.title && dto.title !== course.title) {
        await tx.course.update({
          where: { id: courseId },
          data: { title: dto.title },
        })
      }

      // 2. Track existing modules and lessons for safe deletion
      const existingModules = course.modules
      const submittedModuleIds = (dto.modules || [])
        .map((m) => m.id)
        .filter((id): id is string => !!id && !id.startsWith('mod-'))

      // Delete modules that are no longer in payload
      const modulesToDelete = existingModules.filter(
        (m) => !submittedModuleIds.includes(m.id)
      )
      for (const m of modulesToDelete) {
        await tx.courseModule.delete({ where: { id: m.id } })
      }

      // 3. Process each module in payload
      for (let mIdx = 0; mIdx < (dto.modules || []).length; mIdx++) {
        const modData = dto.modules[mIdx]
        const isExistingModule = !!modData.id && !modData.id.startsWith('mod-') && existingModules.some((m) => m.id === modData.id)

        let targetModuleId = modData.id
        if (isExistingModule && targetModuleId) {
          await tx.courseModule.update({
            where: { id: targetModuleId },
            data: {
              title: modData.title,
              sortOrder: modData.sortOrder ?? mIdx + 1,
            },
          })
        } else {
          const createdModule = await tx.courseModule.create({
            data: {
              courseId,
              title: modData.title,
              sortOrder: modData.sortOrder ?? mIdx + 1,
            },
          })
          targetModuleId = createdModule.id
        }

        // Handle lessons in this module
        const existingLessonsInModule = isExistingModule
          ? existingModules.find((m) => m.id === targetModuleId)?.lessons || []
          : []
        const submittedLessonIds = (modData.lessons || [])
          .map((l) => l.id)
          .filter((id): id is string => !!id && !id.startsWith('les-'))

        // Delete lessons removed from this module
        const lessonsToDelete = existingLessonsInModule.filter(
          (l) => !submittedLessonIds.includes(l.id)
        )
        for (const les of lessonsToDelete) {
          await tx.lesson.delete({ where: { id: les.id } })
        }

        for (let lIdx = 0; lIdx < (modData.lessons || []).length; lIdx++) {
          const lesData = modData.lessons[lIdx]
          const isExistingLesson = !!lesData.id && !lesData.id.startsWith('les-') && existingLessonsInModule.some((l) => l.id === lesData.id)

          const durationSeconds = lesData.durationMinutes ? lesData.durationMinutes * 60 : (lesData.lessonType === 'VIDEO' ? 600 : 300)

          let targetLessonId = lesData.id
          if (isExistingLesson && targetLessonId) {
            await tx.lesson.update({
              where: { id: targetLessonId },
              data: {
                title: lesData.title,
                lessonType: (lesData.lessonType as any) || 'VIDEO',
                sortOrder: lesData.sortOrder ?? lIdx + 1,
                videoUrl: lesData.videoUrl,
                videoProvider: (lesData.videoProvider as any) || (lesData.videoUrl ? 'YOUTUBE' : undefined),
                videoDuration: durationSeconds,
                bodyHtml: lesData.bodyHtml,
                description: lesData.bodyHtml,
                documentUrl: lesData.documentUrl,
                sopCode: lesData.sopCode,
                sopType: lesData.sopType,
                checklistItems: lesData.checklistItems,
                allowSeeking: lesData.allowSeeking ?? true,
              },
            })
          } else {
            const createdLesson = await tx.lesson.create({
              data: {
                moduleId: targetModuleId!,
                title: lesData.title,
                lessonType: (lesData.lessonType as any) || 'VIDEO',
                sortOrder: lesData.sortOrder ?? lIdx + 1,
                videoUrl: lesData.videoUrl,
                videoProvider: (lesData.videoProvider as any) || (lesData.videoUrl ? 'YOUTUBE' : undefined),
                videoDuration: durationSeconds,
                bodyHtml: lesData.bodyHtml,
                description: lesData.bodyHtml,
                documentUrl: lesData.documentUrl,
                sopCode: lesData.sopCode,
                sopType: lesData.sopType,
                checklistItems: lesData.checklistItems,
                allowSeeking: lesData.allowSeeking ?? true,
              },
            })
            targetLessonId = createdLesson.id
          }

          // Handle Quiz & Questions if type is QUIZ
          if (lesData.lessonType === 'QUIZ') {
            let quiz = await tx.quiz.findUnique({
              where: { lessonId: targetLessonId! },
            })

            if (!quiz) {
              quiz = await tx.quiz.create({
                data: {
                  lessonId: targetLessonId!,
                  title: `Bài kiểm tra: ${lesData.title}`,
                  passScore: lesData.quizPassScore ?? 80,
                  timeLimitMinutes: lesData.quizTimeLimit ?? 15,
                },
              })
            } else {
              quiz = await tx.quiz.update({
                where: { id: quiz.id },
                data: {
                  title: `Bài kiểm tra: ${lesData.title}`,
                  passScore: lesData.quizPassScore ?? 80,
                  timeLimitMinutes: lesData.quizTimeLimit ?? 15,
                },
              })
            }

            // Delete old questions to rebuild question list cleanly
            await tx.quizQuestion.deleteMany({
              where: { quizId: quiz.id },
            })

            // Create new questions & options
            if (lesData.quizQuestions && lesData.quizQuestions.length > 0) {
              for (let qIdx = 0; qIdx < lesData.quizQuestions.length; qIdx++) {
                const q = lesData.quizQuestions[qIdx]
                const createdQ = await tx.quizQuestion.create({
                  data: {
                    quizId: quiz.id,
                    questionText: q.questionText,
                    questionType: (q.questionType as any) || 'SINGLE_CHOICE',
                    sortOrder: qIdx + 1,
                  },
                })

                if (q.options && q.options.length > 0) {
                  for (let oIdx = 0; oIdx < q.options.length; oIdx++) {
                    const opt = q.options[oIdx]
                    await tx.quizQuestionOption.create({
                      data: {
                        questionId: createdQ.id,
                        optionText: opt.text,
                        isCorrect: opt.isCorrect ?? false,
                        sortOrder: oIdx + 1,
                      },
                    })
                  }
                }
              }
            }
          }
        }
      }

      // Return full updated course with complete hierarchy
      return tx.course.findUnique({
        where: { id: courseId },
        include: {
          category: true,
          targetPosition: true,
          targetDepartment: true,
          targetStore: true,
          modules: {
            orderBy: { sortOrder: 'asc' },
            include: {
              lessons: {
                orderBy: { sortOrder: 'asc' },
                include: {
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
                },
              },
            },
          },
        },
      })
    })
  }
}

export const courseService = new CourseService()

