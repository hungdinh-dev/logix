'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { courseApiService, CreateCoursePayload } from '@/features/lms/services/course.service'
import { useDepartments } from '@/features/admin/hooks/use-departments'
import { useCertificateTemplates } from '@/features/lms/certificates-admin'
import {
  TargetingValues,
  MOCK_POSITIONS,
} from '@/features/lms/course-targeting/components/CourseTargetingCard'
import {
  StepNumber,
  PreviewTheme,
  SAMPLE_THUMBNAILS,
  slugify,
} from '../types/course-create.types'

export function useCourseCreate() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<StepNumber>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light')
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  // Switch: Khóa học có thời hạn hoàn thành không
  const [hasDurationLimit, setHasDurationLimit] = useState(true)

  // Queries
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['courses', 'categories'],
    queryFn: () => courseApiService.getCategories(),
  })

  const { data: deptData, isLoading: isLoadingDepartments } = useDepartments()
  const departments = deptData?.items || []

  const { data: certificateTemplates = [], isLoading: isLoadingCertificates } = useCertificateTemplates()

  // Form State (Default progressionMode: 'FREE')
  const [formData, setFormData] = useState<CreateCoursePayload>({
    title: '',
    code: `CRS-${new Date().getFullYear()}-ONB01`,
    slug: '',
    categoryId: '',
    description: '',
    thumbnailUrl: SAMPLE_THUMBNAILS[0],
    courseType: 'ONBOARDING',
    isMandatory: false,
    durationDays: 14,
    progressionMode: 'FREE', // Mặc định tự do lựa chọn
    isInternal: true,
    isCommercial: false,
    hasCertificate: false,
    certificateTemplateId: null,
    targetEmploymentStatus: 'ALL',
    targetDepartmentId: undefined,
    targetStoreId: undefined,
    targetPositionId: undefined,
  })

  // Targeting state
  const [targeting, setTargeting] = useState<TargetingValues>({
    targetPositionId: null,
    targetDepartmentId: null,
    targetStoreId: null,
    targetEmploymentStatus: 'ALL',
  })

  // Auto-generate code and slug when title changes (unless slug is manually edited)
  const handleTitleChange = (val: string) => {
    const nextSlug = slugify(val)
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isSlugManuallyEdited ? prev.slug : nextSlug,
      code: prev.code ? prev.code : `CRS-${new Date().getFullYear()}-${nextSlug.substring(0, 6).toUpperCase() || 'NEW'}`,
    }))
  }

  // Manually edit slug
  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true)
    setFormData((prev) => ({
      ...prev,
      slug: slugify(val),
    }))
  }

  // Regenerate Code
  const handleRegenerateCode = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const prefix = formData.courseType === 'ATTP' ? 'ATTP' : formData.courseType === 'ONBOARDING' ? 'ONB' : 'STD'
    const newCode = `CRS-${new Date().getFullYear()}-${prefix}-${randomSuffix}`
    setFormData((prev) => ({
      ...prev,
      code: newCode,
    }))
  }

  // Target summary text on header
  const targetAudienceLabel = useMemo(() => {
    if (targeting.targetPositionId) {
      const pos = MOCK_POSITIONS.find((p) => p.id === targeting.targetPositionId)
      return pos ? pos.name : 'Vị trí cụ thể'
    }
    if (targeting.targetEmploymentStatus === 'PROBATION') return 'Chỉ nhân viên Thử việc'
    if (targeting.targetEmploymentStatus === 'OFFICIAL') return 'Chỉ nhân viên Chính thức'
    if (targeting.targetDepartmentId) return 'Theo Khối phòng ban'
    if (targeting.targetStoreId && targeting.targetStoreId !== 'all') return 'Theo Chi nhánh'
    return 'Toàn bộ Nhân sự'
  }, [targeting])

  // Selected Category Info
  const selectedCategory = useMemo(() => {
    return categories.find((c: any) => c.id === formData.categoryId)
  }, [categories, formData.categoryId])

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: async (status: 'DRAFT' | 'PUBLISHED') => {
      if (!formData.title.trim()) {
        throw new Error('Vui lòng nhập Tên khóa học.')
      }
      if (!formData.code.trim()) {
        throw new Error('Vui lòng nhập Mã khóa học.')
      }
      if (!formData.categoryId) {
        throw new Error('Vui lòng chọn Danh mục đào tạo.')
      }

      const finalSlug = formData.slug.trim() || slugify(formData.title) || `course-${Date.now()}`

      const created = await courseApiService.createCourse({
        ...formData,
        slug: finalSlug,
        durationDays: hasDurationLimit ? (formData.durationDays || 14) : null,
        targetPositionId: targeting.targetPositionId || undefined,
        targetDepartmentId: targeting.targetDepartmentId || undefined,
        targetStoreId: targeting.targetStoreId || undefined,
        targetEmploymentStatus: targeting.targetEmploymentStatus || undefined,
      })

      if (status === 'PUBLISHED') {
        await courseApiService.updateCourseStatus(created.id, 'PUBLISHED')
      }

      return created
    },
    onSuccess: (created) => {
      setIsSubmitting(false)
      toast.success('Khởi tạo khóa học thành công! Đang chuyển đến Trình soạn giáo trình...')
      // Navigate to Curriculum Editor to start adding modules, lessons & quizzes!
      router.push(`/admin/courses/${created.id}`)
    },
    onError: (err: any) => {
      setIsSubmitting(false)
      const msg = err?.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo khóa học.'
      toast.error(`Tạo khóa học thất bại: ${msg}`)
    },
  })

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        toast.error('Vui lòng nhập Tên khóa học.')
        return
      }
      if (!formData.code.trim()) {
        toast.error('Vui lòng nhập Mã khóa học.')
        return
      }
      if (!formData.categoryId) {
        toast.error('Vui lòng chọn Danh mục chương trình đào tạo.')
        return
      }
    }
    setCurrentStep((prev) => (Math.min(prev + 1, 2) as StepNumber))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => (Math.max(prev - 1, 1) as StepNumber))
  }

  const handleFinalSubmit = (status: 'DRAFT' | 'PUBLISHED') => {
    setIsSubmitting(true)
    createMutation.mutate(status)
  }

  return {
    router,
    currentStep,
    setCurrentStep,
    isSubmitting,
    previewTheme,
    setPreviewTheme,
    hasDurationLimit,
    setHasDurationLimit,
    categories,
    isLoadingCategories,
    departments,
    isLoadingDepartments,
    certificateTemplates,
    isLoadingCertificates,
    formData,
    setFormData,
    targeting,
    setTargeting,
    selectedCategory,
    targetAudienceLabel,
    handleTitleChange,
    handleSlugChange,
    handleRegenerateCode,
    handleNextStep,
    handlePrevStep,
    handleFinalSubmit,
    isPendingCreate: createMutation.isPending,
  }
}

// Alias export for backward compatibility
export const useCourseStepper = useCourseCreate
export type UseCourseCreateReturn = ReturnType<typeof useCourseCreate>
