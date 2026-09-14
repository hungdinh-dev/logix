import { z } from 'zod'

// 1. Template DTOs
export const createCertificateTemplateSchema = z.object({
  name: z.string().min(3, 'Tên mẫu chứng chỉ bắt buộc tối thiểu 3 ký tự'),
  code: z.string().min(2, 'Mã mẫu chứng chỉ bắt buộc tối thiểu 2 ký tự').toUpperCase(),
  description: z.string().optional(),
  validityMonths: z.number().int().positive().nullable().optional(), // null = Vô thời hạn, 12 = 1 năm (ATTP)
  issuingOrganization: z.string().default('Trung tâm Đào tạo & Khảo thí Ba Hưng'),
  signatoryName: z.string().min(2, 'Tên người ký không được để trống'),
  signatoryTitle: z.string().min(2, 'Chức danh người ký không được để trống'),
  signatureImageUrl: z.string().optional().nullable(),
  badgeIconUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true).optional(),
})

export const updateCertificateTemplateSchema = createCertificateTemplateSchema.partial()

export type CreateCertificateTemplateDto = z.infer<typeof createCertificateTemplateSchema>
export type UpdateCertificateTemplateDto = z.infer<typeof updateCertificateTemplateSchema>

// 2. Issue Certificate DTOs
export const issueCertificateSchema = z.object({
  userId: z.string().uuid('ID nhân sự không hợp lệ'),
  courseId: z.string().uuid().optional().nullable(),
  templateId: z.string().uuid().optional().nullable(),
  title: z.string().min(3, 'Tiêu đề chứng chỉ không được để trống'),
  recipientName: z.string().min(2, 'Tên người nhận không được để trống'),
  issueDate: z.string().optional(), // ISO date string
  expiryDate: z.string().optional().nullable(), // ISO date string
  isExternal: z.boolean().default(false).optional(),
  issuingOrganization: z.string().optional().nullable(),
  certificateFileUrl: z.string().optional().nullable(),
  finalScore: z.number().min(0).max(100).optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
})

export const revokeCertificateSchema = z.object({
  reason: z.string().min(3, 'Lý do thu hồi chứng chỉ bắt buộc tối thiểu 3 ký tự'),
})

export const renewCertificateSchema = z.object({
  newExpiryDate: z.string().min(1, 'Ngày hết hạn mới không được để trống'), // ISO string
  notes: z.string().optional(),
})

export type IssueCertificateDto = z.infer<typeof issueCertificateSchema>
export type RevokeCertificateDto = z.infer<typeof revokeCertificateSchema>
export type RenewCertificateDto = z.infer<typeof renewCertificateSchema>

// 3. Query Filters DTO
export interface CertificateQueryFilters {
  page?: number
  limit?: number
  search?: string
  status?: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'REVOKED' | 'ALL'
  courseId?: string
  templateId?: string
  userId?: string
  isExternal?: boolean
}
