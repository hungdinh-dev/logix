import { z } from 'zod'

// ==========================================
// Category DTOs (LMS-001)
// ==========================================

export const createCategorySchema = z.object({
  body: z.object({
    code: z.string().min(1, 'code là bắt buộc'),
    name: z.string().min(1, 'name là bắt buộc'),
    description: z.string().optional(),
    sortOrder: z.number().optional().default(0),
  }),
})

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    sortOrder: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
})

export type CreateCategoryDto = z.infer<typeof createCategorySchema>['body']
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>['body']

// ==========================================
// Course DTOs (LMS-002 -> LMS-012)
// ==========================================

export const createCourseSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'code là bắt buộc'),
    title: z.string().min(1, 'title là bắt buộc'),
    slug: z.string().min(1, 'slug là bắt buộc'),
    categoryId: z.string().min(1, 'categoryId là bắt buộc'),
    description: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    courseType: z.enum(['STANDARD', 'ATTP', 'ONBOARDING']).optional().default('STANDARD'),
    isMandatory: z.boolean().optional().default(false), // LMS-009, LMS-010
    durationDays: z.number().min(1).nullable().optional(), // LMS-011 (null = Vô thời hạn)
    progressionMode: z.enum(['FREE', 'LINEAR_LESSON', 'LINEAR_MODULE']).optional().default('FREE'),
    targetPositionId: z.string().nullable().optional(), // LMS-005
    targetDepartmentId: z.string().nullable().optional(), // LMS-008
    targetStoreId: z.string().nullable().optional(), // LMS-007
    targetEmploymentStatus: z.enum(['PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL']).nullable().optional(), // LMS-006
    hasCertificate: z.boolean().optional().default(false),
    certificateTemplateId: z.string().uuid().nullable().optional(),
  }),
})

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    categoryId: z.string().optional(),
    courseType: z.enum(['STANDARD', 'ATTP', 'ONBOARDING']).optional(),
    isMandatory: z.boolean().optional(),
    durationDays: z.number().min(1).nullable().optional(),
    progressionMode: z.enum(['FREE', 'LINEAR_LESSON', 'LINEAR_MODULE']).optional(),
    targetPositionId: z.string().nullable().optional(),
    targetDepartmentId: z.string().nullable().optional(),
    targetStoreId: z.string().nullable().optional(),
    targetEmploymentStatus: z.enum(['PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL']).nullable().optional(),
    hasCertificate: z.boolean().optional(),
    certificateTemplateId: z.string().uuid().nullable().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
})

export const updateCourseStatusSchema = z.object({
  body: z.object({
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  }),
})

export const assignPositionSchema = z.object({
  body: z.object({
    positionId: z.string().min(1, 'positionId là bắt buộc'),
  }),
})

export const assignEmploymentStatusSchema = z.object({
  body: z.object({
    employmentStatus: z.enum(['PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL']),
  }),
})

export const assignStoreSchema = z.object({
  body: z.object({
    storeId: z.string().min(1, 'storeId là bắt buộc'),
  }),
})

export const assignDepartmentSchema = z.object({
  body: z.object({
    departmentId: z.string().min(1, 'departmentId là bắt buộc'),
  }),
})

export type CreateCourseDto = z.infer<typeof createCourseSchema>['body']
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>['body']
export type UpdateCourseStatusDto = z.infer<typeof updateCourseStatusSchema>['body']

// ==========================================
// Module DTOs (LMS-017)
// ==========================================

export const createModuleSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề chương học là bắt buộc'),
    sortOrder: z.number().optional(),
  }),
})

export const updateModuleSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    sortOrder: z.number().optional(),
  }),
})

export const reorderModulesSchema = z.object({
  body: z.object({
    moduleOrders: z.array(
      z.object({
        id: z.string().min(1, 'id chương học là bắt buộc'),
        sortOrder: z.number(),
      })
    ).min(1, 'Danh sách sắp xếp không được rỗng'),
  }),
})

export type CreateModuleDto = z.infer<typeof createModuleSchema>['body']
export type UpdateModuleDto = z.infer<typeof updateModuleSchema>['body']
export type ReorderModulesDto = z.infer<typeof reorderModulesSchema>['body']

// ==========================================
// Curriculum Sync DTO (LMS-017 + Lessons + Quizzes)
// ==========================================

export const syncCurriculumSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    modules: z.array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, 'Tiêu đề chương học là bắt buộc'),
        sortOrder: z.number().optional(),
        lessons: z.array(
          z.object({
            id: z.string().optional(),
            title: z.string().min(1, 'Tiêu đề bài học là bắt buộc'),
            lessonType: z.enum(['VIDEO', 'ARTICLE', 'QUIZ', 'PDF', 'CHECKLIST']).optional().default('VIDEO'),
            sortOrder: z.number().optional(),
            durationMinutes: z.number().optional(),
            videoUrl: z.string().nullable().optional(),
            videoProvider: z.enum(['YOUTUBE', 'DIRECT_UPLOAD', 'EXTERNAL_URL']).nullable().optional(),
            videoStoragePath: z.string().nullable().optional(),
            bodyHtml: z.string().nullable().optional(),
            documentUrl: z.string().nullable().optional(),
            checklistItems: z.string().nullable().optional(),
            sopCode: z.string().nullable().optional(),
            sopType: z.string().nullable().optional(),
            allowSeeking: z.boolean().optional().default(true),
            quizPassScore: z.number().optional(),
            quizTimeLimit: z.number().optional(),
            quizQuestions: z.array(
              z.object({
                id: z.string().optional(),
                questionText: z.string().min(1, 'Nội dung câu hỏi là bắt buộc'),
                questionType: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']).optional().default('SINGLE_CHOICE'),
                options: z.array(
                  z.object({
                    id: z.string().optional(),
                    text: z.string().min(1, 'Nội dung đáp án là bắt buộc'),
                    isCorrect: z.boolean().default(false),
                  })
                ).optional().default([]),
              })
            ).optional().default([]),
          })
        ).optional().default([]),
      })
    ).optional().default([]),
  }),
})

export type SyncCurriculumDto = z.infer<typeof syncCurriculumSchema>['body']

