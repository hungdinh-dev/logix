import prisma from '../../config/prisma'
import {
  CreateCertificateTemplateDto,
  UpdateCertificateTemplateDto,
  IssueCertificateDto,
  RevokeCertificateDto,
  RenewCertificateDto,
  CertificateQueryFilters,
} from './certificate.dto'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { lmsActivityLogService } from '../activity-logs/activity-log.service'
import { LmsActivityType } from '@prisma/client'

export class CertificateService {
  // ==========================================
  // 1. KPI STATS & METRICS
  // ==========================================

  public async getStats() {
    const now = new Date()
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const [total, active, expired, revoked, expiringSoon, templatesCount] = await Promise.all([
      prisma.userCertificate.count(),
      prisma.userCertificate.count({
        where: {
          status: 'ACTIVE',
          OR: [{ expiryDate: null }, { expiryDate: { gt: now } }],
        },
      }),
      prisma.userCertificate.count({
        where: {
          OR: [
            { status: 'EXPIRED' },
            {
              status: { not: 'REVOKED' },
              expiryDate: { lte: now },
            },
          ],
        },
      }),
      prisma.userCertificate.count({
        where: { status: 'REVOKED' },
      }),
      prisma.userCertificate.count({
        where: {
          status: { not: 'REVOKED' },
          expiryDate: {
            gt: now,
            lte: thirtyDaysLater,
          },
        },
      }),
      prisma.certificateTemplate.count({
        where: { isActive: true },
      }),
    ])

    return {
      total,
      active,
      expired,
      revoked,
      expiringSoon,
      templatesCount,
    }
  }

  // ==========================================
  // 2. ISSUED CERTIFICATES CRUD & QUERIES
  // ==========================================

  public async getIssuedCertificates(filters: CertificateQueryFilters) {
    const page = Number(filters.page) || 1
    const limit = Number(filters.limit) || 10
    const skip = (page - 1) * limit
    const now = new Date()
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const where: any = {}

    // Search query
    if (filters.search) {
      where.OR = [
        { certificateCode: { contains: filters.search, mode: 'insensitive' } },
        { recipientName: { contains: filters.search, mode: 'insensitive' } },
        { title: { contains: filters.search, mode: 'insensitive' } },
        { user: { fullName: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
        { user: { employeeCode: { contains: filters.search, mode: 'insensitive' } } },
      ]
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'EXPIRING_SOON') {
        where.status = { not: 'REVOKED' }
        where.expiryDate = { gt: now, lte: thirtyDaysLater }
      } else if (filters.status === 'EXPIRED') {
        where.OR = [
          { status: 'EXPIRED' },
          {
            status: { not: 'REVOKED' },
            expiryDate: { lte: now },
          },
        ]
      } else {
        where.status = filters.status
      }
    }

    if (filters.courseId) where.courseId = filters.courseId
    if (filters.templateId) where.templateId = filters.templateId
    if (filters.userId) where.userId = filters.userId
    if (filters.isExternal !== undefined) where.isExternal = filters.isExternal

    const [total, items] = await Promise.all([
      prisma.userCertificate.count({ where }),
      prisma.userCertificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              employeeCode: true,
              department: { select: { id: true, deptName: true } },
              position: { select: { id: true, positionName: true } },
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              code: true,
              thumbnailUrl: true,
            },
          },
          template: {
            select: {
              id: true,
              name: true,
              code: true,
              validityMonths: true,
              signatoryName: true,
              signatoryTitle: true,
              issuingOrganization: true,
            },
          },
        },
      }),
    ])

    // Format dynamic status
    const formattedItems = items.map((cert) => {
      let dynamicStatus = cert.status
      if (cert.status !== 'REVOKED' && cert.expiryDate) {
        if (cert.expiryDate <= now) {
          dynamicStatus = 'EXPIRED'
        } else if (cert.expiryDate <= thirtyDaysLater) {
          dynamicStatus = 'EXPIRING_SOON'
        }
      }

      return {
        ...cert,
        status: dynamicStatus,
      }
    })

    return {
      items: formattedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    }
  }

  public async getCertificateById(id: string) {
    const cert = await prisma.userCertificate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            employeeCode: true,
            department: { select: { id: true, deptName: true } },
            position: { select: { id: true, positionName: true } },
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            description: true,
          },
        },
        template: true,
      },
    })

    if (!cert) throw new NotFoundError('Chứng chỉ')
    return cert
  }

  public async getCertificateByCode(certificateCode: string) {
    const cert = await prisma.userCertificate.findUnique({
      where: { certificateCode },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            employeeCode: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        template: true,
      },
    })

    if (!cert) throw new NotFoundError('Mã chứng chỉ không tồn tại hoặc đã bị thu hồi')
    return cert
  }

  public async issueCertificate(dto: IssueCertificateDto) {
    // 1. Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: dto.userId },
    })
    if (!user) throw new NotFoundError('Học viên / Nhân sự')

    // 2. Fetch template if templateId provided
    let template: any = null
    if (dto.templateId) {
      template = await prisma.certificateTemplate.findUnique({
        where: { id: dto.templateId },
      })
    }

    // 3. Generate Unique Certificate Code: CERT-YYYY-BH-XXXXX
    const year = new Date().getFullYear()
    const count = await prisma.userCertificate.count()
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const certificateCode = `CERT-${year}-BH-${String(count + 1).padStart(4, '0')}${randomSuffix}`

    // 4. Calculate Expiry Date
    const issueDate = dto.issueDate ? new Date(dto.issueDate) : new Date()
    let expiryDate: Date | null = null

    if (dto.expiryDate) {
      expiryDate = new Date(dto.expiryDate)
    } else if (template?.validityMonths) {
      expiryDate = new Date(issueDate.getTime())
      expiryDate.setMonth(expiryDate.getMonth() + template.validityMonths)
    }

    // 5. Create Certificate Record
    const createdCert = await prisma.userCertificate.create({
      data: {
        certificateCode,
        userId: dto.userId,
        courseId: dto.courseId || null,
        templateId: dto.templateId || null,
        title: dto.title,
        recipientName: dto.recipientName || user.fullName,
        issueDate,
        expiryDate,
        status: 'ACTIVE',
        isExternal: dto.isExternal ?? false,
        issuingOrganization: dto.issuingOrganization || template?.issuingOrganization || 'Công ty Cổ phần Bánh Ba Hưng',
        certificateFileUrl: dto.certificateFileUrl || null,
        finalScore: dto.finalScore || null,
        metadata: dto.metadata ? (dto.metadata as any) : undefined,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        course: { select: { id: true, title: true } },
        template: true,
      },
    })

    // 6. Log to LMS Activity Log
    await lmsActivityLogService.logActivity({
      userId: dto.userId,
      courseId: dto.courseId || undefined,
      activityType: LmsActivityType.CERTIFICATE_ISSUED,
      actionTitle: 'Cấp chứng chỉ đào tạo',
      targetName: dto.title,
      status: 'SUCCESS',
      statusLabel: `Mã: ${certificateCode}`,
      metadata: {
        certificateCode,
        issueDate: issueDate.toISOString(),
        expiryDate: expiryDate ? expiryDate.toISOString() : null,
      },
    })

    return createdCert
  }

  public async revokeCertificate(id: string, dto: RevokeCertificateDto) {
    const cert = await prisma.userCertificate.findUnique({ where: { id } })
    if (!cert) throw new NotFoundError('Chứng chỉ')

    if (cert.status === 'REVOKED') {
      throw new BadRequestError('Chứng chỉ này đã bị thu hồi trước đó')
    }

    const updated = await prisma.userCertificate.update({
      where: { id },
      data: {
        status: 'REVOKED',
        revokedReason: dto.reason,
        revokedAt: new Date(),
      },
      include: {
        user: { select: { id: true, fullName: true } },
      },
    })

    // Log Activity
    await lmsActivityLogService.logActivity({
      userId: cert.userId,
      courseId: cert.courseId || undefined,
      activityType: LmsActivityType.CERTIFICATE_ISSUED,
      actionTitle: 'Thu hồi chứng chỉ',
      targetName: cert.title,
      status: 'FAILED',
      statusLabel: 'Đã thu hồi',
      metadata: {
        certificateCode: cert.certificateCode,
        reason: dto.reason,
      },
    })

    return updated
  }

  public async renewCertificate(id: string, dto: RenewCertificateDto) {
    const cert = await prisma.userCertificate.findUnique({ where: { id } })
    if (!cert) throw new NotFoundError('Chứng chỉ')

    const newExpiry = new Date(dto.newExpiryDate)

    const updated = await prisma.userCertificate.update({
      where: { id },
      data: {
        expiryDate: newExpiry,
        status: 'ACTIVE',
        revokedReason: null,
        revokedAt: null,
      },
    })

    return updated
  }

  public async deleteCertificate(id: string) {
    const cert = await prisma.userCertificate.findUnique({ where: { id } })
    if (!cert) throw new NotFoundError('Chứng chỉ')

    return prisma.userCertificate.delete({
      where: { id },
    })
  }

  // ==========================================
  // 3. CERTIFICATE TEMPLATES CRUD
  // ==========================================

  public async getTemplates() {
    return prisma.certificateTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            courses: true,
            certificates: true,
          },
        },
      },
    })
  }

  public async getTemplateById(id: string) {
    const template = await prisma.certificateTemplate.findUnique({
      where: { id },
      include: {
        courses: { select: { id: true, title: true, code: true } },
        _count: { select: { certificates: true } },
      },
    })
    if (!template) throw new NotFoundError('Mẫu phôi chứng chỉ')
    return template
  }

  public async createTemplate(dto: CreateCertificateTemplateDto) {
    const existing = await prisma.certificateTemplate.findUnique({
      where: { code: dto.code },
    })
    if (existing) {
      throw new BadRequestError(`Mã mẫu phôi "${dto.code}" đã tồn tại trên hệ thống`)
    }

    return prisma.certificateTemplate.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description || null,
        validityMonths: dto.validityMonths ?? null,
        issuingOrganization: dto.issuingOrganization || 'Trung tâm Đào tạo & Khảo thí Ba Hưng',
        signatoryName: dto.signatoryName,
        signatoryTitle: dto.signatoryTitle,
        signatureImageUrl: dto.signatureImageUrl || null,
        badgeIconUrl: dto.badgeIconUrl || null,
        isActive: dto.isActive ?? true,
      },
    })
  }

  public async updateTemplate(id: string, dto: UpdateCertificateTemplateDto) {
    const existing = await prisma.certificateTemplate.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Mẫu phôi chứng chỉ')

    if (dto.code && dto.code !== existing.code) {
      const codeTaken = await prisma.certificateTemplate.findUnique({ where: { code: dto.code } })
      if (codeTaken) throw new BadRequestError(`Mã mẫu phôi "${dto.code}" đã được sử dụng`)
    }

    return prisma.certificateTemplate.update({
      where: { id },
      data: {
        ...dto,
      },
    })
  }

  public async deleteTemplate(id: string) {
    const existing = await prisma.certificateTemplate.findUnique({
      where: { id },
      include: { _count: { select: { certificates: true, courses: true } } },
    })
    if (!existing) throw new NotFoundError('Mẫu phôi chứng chỉ')

    if (existing._count.certificates > 0) {
      throw new BadRequestError(
        `Không thể xóa mẫu phôi này vì đã có ${existing._count.certificates} chứng chỉ được cấp liên kết với nó. Vui lòng chuyển sang trạng thái Ngưng hoạt động.`
      )
    }

    return prisma.certificateTemplate.delete({
      where: { id },
    })
  }
}

export const certificateService = new CertificateService()
