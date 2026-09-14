'use client'

import React from 'react'
import { useCourseCreate } from '../hooks/use-course-create'
import {
  StepperHeader,
  StepperProgressBar,
  Step1BasicInfo,
  Step2PreviewPublish,
} from '../components'
import { routePath } from '@/config/route-path'

export function CourseCreatePage() {
  const {
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
  } = useCourseCreate()

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-muted/20">
      {/* Top Action Bar */}
      <StepperHeader
        title={formData.title}
        currentStep={currentStep}
        isSubmitting={isSubmitting}
        onCancel={() => router.push(routePath.lmsAdminCourses)}
        onPrev={handlePrevStep}
        onNext={handleNextStep}
        onSubmitDraft={() => handleFinalSubmit('DRAFT')}
        onSubmitPublish={() => handleFinalSubmit('PUBLISHED')}
      />

      {/* Stepper Progress Bar (2 Steps) */}
      <StepperProgressBar
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Main Form Content */}
      <main className="flex-1 p-6 md:p-8 mx-auto w-full">
        {/* STEP 1: THÔNG TIN CƠ BẢN & PHÂN LOẠI */}
        {currentStep === 1 && (
          <Step1BasicInfo
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            isLoadingCategories={isLoadingCategories}
            targeting={targeting}
            setTargeting={setTargeting}
            targetAudienceLabel={targetAudienceLabel}
            hasDurationLimit={hasDurationLimit}
            setHasDurationLimit={setHasDurationLimit}
            certificateTemplates={certificateTemplates}
            isLoadingCertificates={isLoadingCertificates}
            onTitleChange={handleTitleChange}
            onSlugChange={handleSlugChange}
            onRegenerateCode={handleRegenerateCode}
          />
        )}

        {/* STEP 2: XEM TRƯỚC & XUẤT BẢN */}
        {currentStep === 2 && (
          <Step2PreviewPublish
            formData={formData}
            previewTheme={previewTheme}
            setPreviewTheme={setPreviewTheme}
            selectedCategory={selectedCategory}
            targetAudienceLabel={targetAudienceLabel}
            hasDurationLimit={hasDurationLimit}
            isSubmitting={isSubmitting}
            onSubmitDraft={() => handleFinalSubmit('DRAFT')}
            onSubmitPublish={() => handleFinalSubmit('PUBLISHED')}
          />
        )}
      </main>
    </div>
  )
}

// Alias for backward compatibility
export const CourseCreateStepperPage = CourseCreatePage

export default CourseCreatePage
