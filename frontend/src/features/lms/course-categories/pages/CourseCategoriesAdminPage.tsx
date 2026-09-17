'use client'

import React from 'react'
import { useCourseCategories } from '../hooks/use-course-categories'
import {
  CategoryHeader,
  CategoryStatsCards,
  CategoryToolbar,
  CategoryTable,
  CategoryFormModal,
  CategoryDeleteDialog,
} from '../components'

export function CourseCategoriesAdminPage() {
  const {
    // Data & Loading
    isCategoriesLoading,
    filteredCategories,
    categoryCourseCountMap,
    stats,

    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,

    // Modal & Form State
    isCreateModalOpen,
    editingCategory,
    deletingCategory,
    setDeletingCategory,
    formData,
    setFormData,
    isSubmitting,
    isDeleting,

    // Actions
    handleOpenCreate,
    handleOpenEdit,
    handleCloseFormModal,
    handleSubmitForm,
    handleConfirmDelete,
  } = useCourseCategories()

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* 1. Page Header & Actions */}
      <CategoryHeader onOpenCreate={handleOpenCreate} />

      {/* 2. Bento KPI Stats Cards */}
      <CategoryStatsCards stats={stats} isLoading={isCategoriesLoading} />

      {/* 3. Search & Status Filter Toolbar */}
      <CategoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
      />

      {/* 4. Main Category Data Table */}
      <CategoryTable
        categories={filteredCategories}
        categoryCourseCountMap={categoryCourseCountMap}
        isLoading={isCategoriesLoading}
        searchQuery={searchQuery}
        onOpenCreate={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={setDeletingCategory}
      />

      {/* 5. Create / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isCreateModalOpen || !!editingCategory}
        editingCategory={editingCategory}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={handleCloseFormModal}
        onFormDataChange={setFormData}
        onSubmit={handleSubmitForm}
      />

      {/* 6. Delete Category Confirmation Dialog (With FK constraint protection) */}
      <CategoryDeleteDialog
        deletingCategory={deletingCategory}
        isDeleting={isDeleting}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
