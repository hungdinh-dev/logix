import { api } from '@/lib/axios'
import { apiRoutes } from '@/config/api-routes'
import type {
  CertificateStats,
  UserCertificateItem,
  CertificateTemplateItem,
  CertificateFilters,
  IssueCertificatePayload,
  CertificateTemplatePayload,
  RevokeCertificatePayload,
  RenewCertificatePayload,
} from '../types/certificate-admin.types'

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const certificateAdminService = {
  // 1. Stats
  async getStats(): Promise<CertificateStats> {
    const res = await api.get(apiRoutes.certificates.stats)
    return res.data.data
  },

  // 2. Issued Certificates
  async getIssuedCertificates(
    filters?: CertificateFilters
  ): Promise<PaginatedResponse<UserCertificateItem>> {
    const res = await api.get(apiRoutes.certificates.base, { params: filters })
    return {
      data: res.data.data,
      pagination: res.data.pagination,
    }
  },

  async getCertificateById(id: string): Promise<UserCertificateItem> {
    const res = await api.get(apiRoutes.certificates.byId(id))
    return res.data.data
  },

  async issueCertificate(payload: IssueCertificatePayload): Promise<UserCertificateItem> {
    const res = await api.post(apiRoutes.certificates.issue, payload)
    return res.data.data
  },

  async revokeCertificate(
    id: string,
    payload: RevokeCertificatePayload
  ): Promise<UserCertificateItem> {
    const res = await api.patch(apiRoutes.certificates.revoke(id), payload)
    return res.data.data
  },

  async renewCertificate(
    id: string,
    payload: RenewCertificatePayload
  ): Promise<UserCertificateItem> {
    const res = await api.patch(apiRoutes.certificates.renew(id), payload)
    return res.data.data
  },

  async deleteCertificate(id: string): Promise<void> {
    await api.delete(apiRoutes.certificates.byId(id))
  },

  // 3. Templates
  async getTemplates(): Promise<CertificateTemplateItem[]> {
    const res = await api.get(apiRoutes.certificates.templates)
    return res.data.data
  },

  async getTemplateById(id: string): Promise<CertificateTemplateItem> {
    const res = await api.get(apiRoutes.certificates.templateById(id))
    return res.data.data
  },

  async createTemplate(
    payload: CertificateTemplatePayload
  ): Promise<CertificateTemplateItem> {
    const res = await api.post(apiRoutes.certificates.templates, payload)
    return res.data.data
  },

  async updateTemplate(
    id: string,
    payload: Partial<CertificateTemplatePayload>
  ): Promise<CertificateTemplateItem> {
    const res = await api.put(apiRoutes.certificates.templateById(id), payload)
    return res.data.data
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(apiRoutes.certificates.templateById(id))
  },
}
