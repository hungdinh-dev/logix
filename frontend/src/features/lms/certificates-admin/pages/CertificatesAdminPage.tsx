'use client'

import React, { useState } from 'react'
import { Award, Layers, Sparkles } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CertificatesStatCards } from '../components/CertificatesStatCards'
import { CertificatesToolbar } from '../components/CertificatesToolbar'
import { IssuedCertificatesTable } from '../components/IssuedCertificatesTable'
import { CertificateTemplatesTable } from '../components/CertificateTemplatesTable'
import { IssueCertificateModal } from '../components/IssueCertificateModal'
import { CertificateTemplateModal } from '../components/CertificateTemplateModal'
import { CertificatePreviewModal } from '../components/CertificatePreviewModal'
import { RevokeConfirmDialog } from '../components/RevokeConfirmDialog'
import { RenewExpiryModal } from '../components/RenewExpiryModal'
import {
  useCertificateStats,
  useIssuedCertificates,
  useCertificateTemplates,
  useIssueCertificate,
  useRevokeCertificate,
  useRenewCertificate,
  useDeleteCertificate,
  useCreateCertificateTemplate,
  useUpdateCertificateTemplate,
  useDeleteCertificateTemplate,
} from '../hooks/use-certificates-admin'
import type {
  CertificateStatus,
  UserCertificateItem,
  CertificateTemplateItem,
} from '../types/certificate-admin.types'

export function CertificatesAdminPage() {
  const [activeTab, setActiveTab] = useState<'issued' | 'templates'>('issued')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CertificateStatus | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  // Modals state
  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [templateToEdit, setTemplateToEdit] = useState<CertificateTemplateItem | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<UserCertificateItem | null>(null)
  const [revokeModalOpen, setRevokeModalOpen] = useState(false)
  const [selectedCertForRevoke, setSelectedCertForRevoke] = useState<UserCertificateItem | null>(null)
  const [renewModalOpen, setRenewModalOpen] = useState(false)
  const [selectedCertForRenew, setSelectedCertForRenew] = useState<UserCertificateItem | null>(null)

  // React Query Queries
  const { data: stats, isLoading: isStatsLoading } = useCertificateStats()
  const { data: issuedData, isLoading: isIssuedLoading } = useIssuedCertificates({
    search: searchQuery || undefined,
    status: statusFilter,
    page: currentPage,
    limit: 10,
  })
  const { data: templates, isLoading: isTemplatesLoading } = useCertificateTemplates()

  // Mutations
  const issueMutation = useIssueCertificate()
  const revokeMutation = useRevokeCertificate()
  const renewMutation = useRenewCertificate()
  const deleteCertMutation = useDeleteCertificate()

  const createTemplateMutation = useCreateCertificateTemplate()
  const updateTemplateMutation = useUpdateCertificateTemplate()
  const deleteTemplateMutation = useDeleteCertificateTemplate()

  // Actions Handlers
  const handlePreview = (cert: UserCertificateItem) => {
    setSelectedCertForPreview(cert)
    setPreviewModalOpen(true)
  }

  const handleRevoke = (cert: UserCertificateItem) => {
    setSelectedCertForRevoke(cert)
    setRevokeModalOpen(true)
  }

  const handleRenew = (cert: UserCertificateItem) => {
    setSelectedCertForRenew(cert)
    setRenewModalOpen(true)
  }

  const handleDeleteCert = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn bản ghi chứng chỉ này?')) {
      deleteCertMutation.mutate(id)
    }
  }

  const handleEditTemplate = (tmpl: CertificateTemplateItem) => {
    setTemplateToEdit(tmpl)
    setTemplateModalOpen(true)
  }

  const handleDeleteTemplate = (tmpl: CertificateTemplateItem) => {
    if (window.confirm(`Bạn có chắc muốn xóa mẫu phôi "${tmpl.name}"?`)) {
      deleteTemplateMutation.mutate(tmpl.id)
    }
  }

  const handleCreateOrUpdateTemplate = async (payload: any) => {
    if (templateToEdit) {
      await updateTemplateMutation.mutateAsync({
        id: templateToEdit.id,
        payload,
      })
    } else {
      await createTemplateMutation.mutateAsync(payload)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Quản Lý Chứng Chỉ &amp; Tuân Thủ ATTP
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              LMS Certification
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quản trị cấp phát văn bằng, chứng chỉ An Toàn Vệ Sinh Thực Phẩm và mẫu phôi chuẩn cho nhân sự chuỗi Ba Hưng.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <CertificatesStatCards stats={stats} isLoading={isStatsLoading} />

      {/* Main Tabs Container */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'issued' | 'templates')}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/80 p-1 rounded-xl">
            <TabsTrigger
              value="issued"
              className="gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-2xs cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Chứng Chỉ Đã Cấp</span>
              {stats?.total !== undefined && (
                <span className="ml-1 text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded-full">
                  {stats.total}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="gap-2 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-2xs cursor-pointer"
            >
              <Layers className="h-4 w-4" />
              <span>Mẫu Phôi Chuẩn</span>
              {stats?.templatesCount !== undefined && (
                <span className="ml-1 text-[10px] bg-muted-foreground/20 text-muted-foreground font-bold px-1.5 py-0.2 rounded-full">
                  {stats.templatesCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Toolbar */}
        <CertificatesToolbar
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q)
            setCurrentPage(1)
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => {
            setStatusFilter(s)
            setCurrentPage(1)
          }}
          onOpenIssueModal={() => setIssueModalOpen(true)}
          onOpenTemplateModal={() => {
            setTemplateToEdit(null)
            setTemplateModalOpen(true)
          }}
          onExportData={() => {
            alert('Tính năng xuất Excel danh sách chứng chỉ đang sẵn sàng!')
          }}
        />

        {/* Tab 1: Issued Certificates */}
        <TabsContent value="issued" className="m-0 space-y-4">
          <IssuedCertificatesTable
            certificates={issuedData?.data || []}
            isLoading={isIssuedLoading}
            onPreview={handlePreview}
            onRenew={handleRenew}
            onRevoke={handleRevoke}
            onDelete={handleDeleteCert}
            pagination={issuedData?.pagination}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        {/* Tab 2: Certificate Templates */}
        <TabsContent value="templates" className="m-0 space-y-4">
          <CertificateTemplatesTable
            templates={templates || []}
            isLoading={isTemplatesLoading}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onOpenCreate={() => {
              setTemplateToEdit(null)
              setTemplateModalOpen(true)
            }}
          />
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      {/* 1. Issue Certificate Modal */}
      <IssueCertificateModal
        open={issueModalOpen}
        onOpenChange={setIssueModalOpen}
        templates={templates || []}
        onSubmit={async (payload) => {
          await issueMutation.mutateAsync(payload)
        }}
        isPending={issueMutation.isPending}
      />

      {/* 2. Certificate Template Modal */}
      <CertificateTemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        templateToEdit={templateToEdit}
        onSubmit={handleCreateOrUpdateTemplate}
        isPending={createTemplateMutation.isPending || updateTemplateMutation.isPending}
      />

      {/* 3. Certificate Preview Modal (Print A4) */}
      <CertificatePreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        certificate={selectedCertForPreview}
      />

      {/* 4. Revoke Confirm Dialog */}
      <RevokeConfirmDialog
        open={revokeModalOpen}
        onOpenChange={setRevokeModalOpen}
        certificate={selectedCertForRevoke}
        onConfirm={async (id, reason) => {
          await revokeMutation.mutateAsync({ id, payload: { reason } })
        }}
        isPending={revokeMutation.isPending}
      />

      {/* 5. Renew Expiry Modal */}
      <RenewExpiryModal
        open={renewModalOpen}
        onOpenChange={setRenewModalOpen}
        certificate={selectedCertForRenew}
        onSubmit={async (id, newExpiryDate, notes) => {
          await renewMutation.mutateAsync({
            id,
            payload: { newExpiryDate, notes },
          })
        }}
        isPending={renewMutation.isPending}
      />
    </div>
  )
}
