export type CertificateStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'REVOKED'

export interface CertificateUser {
  id: string
  fullName: string
  email: string
  employeeCode?: string | null
  department?: { id: string; deptName: string } | null
  position?: { id: string; positionName: string } | null
}

export interface CertificateCourse {
  id: string
  title: string
  code: string
  thumbnailUrl?: string | null
  description?: string | null
}

export interface CertificateTemplateItem {
  id: string
  name: string
  code: string
  description?: string | null
  validityMonths?: number | null
  issuingOrganization: string
  signatoryName: string
  signatoryTitle: string
  signatureImageUrl?: string | null
  badgeIconUrl?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    courses?: number
    certificates?: number
  }
}

export interface UserCertificateItem {
  id: string
  certificateCode: string
  userId: string
  user: CertificateUser
  courseId?: string | null
  course?: CertificateCourse | null
  templateId?: string | null
  template?: CertificateTemplateItem | null
  title: string
  recipientName: string
  issueDate: string
  expiryDate?: string | null
  status: CertificateStatus
  isExternal: boolean
  issuingOrganization?: string | null
  certificateFileUrl?: string | null
  finalScore?: number | null
  revokedReason?: string | null
  revokedAt?: string | null
  metadata?: any
  createdAt: string
  updatedAt: string
}

export interface CertificateStats {
  total: number
  active: number
  expired: number
  revoked: number
  expiringSoon: number
  templatesCount: number
}

export interface CertificateFilters {
  search?: string
  status?: CertificateStatus | 'ALL'
  courseId?: string
  templateId?: string
  page?: number
  limit?: number
}

export interface IssueCertificatePayload {
  userId: string
  courseId?: string | null
  templateId?: string | null
  title: string
  recipientName: string
  issueDate?: string
  expiryDate?: string | null
  isExternal?: boolean
  issuingOrganization?: string | null
  certificateFileUrl?: string | null
  finalScore?: number | null
  metadata?: Record<string, any> | null
}

export interface CertificateTemplatePayload {
  name: string
  code: string
  description?: string
  validityMonths?: number | null
  issuingOrganization?: string
  signatoryName: string
  signatoryTitle: string
  signatureImageUrl?: string | null
  badgeIconUrl?: string | null
  isActive?: boolean
}

export interface RevokeCertificatePayload {
  reason: string
}

export interface RenewCertificatePayload {
  newExpiryDate: string
  notes?: string
}
