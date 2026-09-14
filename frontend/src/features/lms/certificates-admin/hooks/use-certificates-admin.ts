import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { certificateAdminService } from '../services/certificate-admin.service'
import type {
  CertificateFilters,
  IssueCertificatePayload,
  CertificateTemplatePayload,
  RevokeCertificatePayload,
  RenewCertificatePayload,
} from '../types/certificate-admin.types'

export const CERTIFICATE_QUERY_KEYS = {
  all: ['certificates'] as const,
  stats: () => [...CERTIFICATE_QUERY_KEYS.all, 'stats'] as const,
  list: (filters?: CertificateFilters) =>
    [...CERTIFICATE_QUERY_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...CERTIFICATE_QUERY_KEYS.all, 'detail', id] as const,
  templates: () => [...CERTIFICATE_QUERY_KEYS.all, 'templates'] as const,
  templateDetail: (id: string) =>
    [...CERTIFICATE_QUERY_KEYS.all, 'template', id] as const,
}

// 1. Stats Query
export function useCertificateStats() {
  return useQuery({
    queryKey: CERTIFICATE_QUERY_KEYS.stats(),
    queryFn: () => certificateAdminService.getStats(),
    staleTime: 30 * 1000,
  })
}

// 2. Issued Certificates Query
export function useIssuedCertificates(filters?: CertificateFilters) {
  return useQuery({
    queryKey: CERTIFICATE_QUERY_KEYS.list(filters),
    queryFn: () => certificateAdminService.getIssuedCertificates(filters),
    staleTime: 10 * 1000,
  })
}

// 3. Templates Query
export function useCertificateTemplates() {
  return useQuery({
    queryKey: CERTIFICATE_QUERY_KEYS.templates(),
    queryFn: () => certificateAdminService.getTemplates(),
    staleTime: 60 * 1000,
  })
}

// 4. Mutations for Issued Certificates
export function useIssueCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IssueCertificatePayload) =>
      certificateAdminService.issueCertificate(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.all })
      toast.success('Cấp chứng chỉ thành công!', {
        description: `Mã chứng chỉ: ${data.certificateCode} - ${data.recipientName}`,
      })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || 'Không thể cấp chứng chỉ'
      toast.error('Lỗi khi cấp chứng chỉ', { description: msg })
    },
  })
}

export function useRevokeCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RevokeCertificatePayload }) =>
      certificateAdminService.revokeCertificate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.all })
      toast.success('Thu hồi chứng chỉ thành công', {
        description: `Đã thu hồi mã: ${data.certificateCode}`,
      })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || 'Không thể thu hồi chứng chỉ'
      toast.error('Lỗi khi thu hồi chứng chỉ', { description: msg })
    },
  })
}

export function useRenewCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RenewCertificatePayload }) =>
      certificateAdminService.renewCertificate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.all })
      toast.success('Gia hạn chứng chỉ thành công', {
        description: `Chứng chỉ ${data.certificateCode} đã được gia hạn`,
      })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || 'Không thể gia hạn chứng chỉ'
      toast.error('Lỗi khi gia hạn chứng chỉ', { description: msg })
    },
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => certificateAdminService.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.all })
      toast.success('Xóa chứng chỉ thành công')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || 'Không thể xóa chứng chỉ'
      toast.error('Lỗi khi xóa chứng chỉ', { description: msg })
    },
  })
}

// 5. Mutations for Templates
export function useCreateCertificateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CertificateTemplatePayload) =>
      certificateAdminService.createTemplate(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.templates() })
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.stats() })
      toast.success('Tạo mẫu phôi chứng chỉ thành công', {
        description: `Đã tạo mẫu: ${data.name} (${data.code})`,
      })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || 'Không thể tạo mẫu phôi'
      toast.error('Lỗi khi tạo mẫu phôi', { description: msg })
    },
  })
}

export function useUpdateCertificateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: Partial<CertificateTemplatePayload>
    }) => certificateAdminService.updateTemplate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.templates() })
      toast.success('Cập nhật mẫu phôi thành công', {
        description: `Đã lưu thay đổi cho mẫu: ${data.name}`,
      })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || 'Không thể cập nhật mẫu phôi'
      toast.error('Lỗi khi cập nhật mẫu phôi', { description: msg })
    },
  })
}

export function useDeleteCertificateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => certificateAdminService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.templates() })
      queryClient.invalidateQueries({ queryKey: CERTIFICATE_QUERY_KEYS.stats() })
      toast.success('Xóa mẫu phôi chứng chỉ thành công')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || 'Không thể xóa mẫu phôi'
      toast.error('Lỗi khi xóa mẫu phôi', { description: msg })
    },
  })
}
