'use client'

import { useState, useEffect, useCallback } from 'react'
import { courseApiService, type CreateCoursePayload, type UpdateCoursePayload } from '../services/course.service'
import type { BackendCourse, BackendCategory } from '../types/course.types'

export function useCourses(params?: {
  search?: string
  categoryId?: string
  status?: string
  isMandatory?: boolean
}) {
  const [courses, setCourses] = useState<BackendCourse[]>([])
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await courseApiService.getCourses(params)
      setCourses(data)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Lỗi tải danh sách khóa học')
    } finally {
      setIsLoading(false)
    }
  }, [params?.search, params?.categoryId, params?.status, params?.isMandatory])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await courseApiService.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Lỗi tải danh mục:', err)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const cloneCourse = async (id: string) => {
    const cloned = await courseApiService.cloneCourse(id)
    await fetchCourses()
    return cloned
  }

  const updateStatus = async (id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
    const updated = await courseApiService.updateCourseStatus(id, status)
    await fetchCourses()
    return updated
  }

  const deleteCourse = async (id: string) => {
    await courseApiService.deleteCourse(id)
    await fetchCourses()
  }

  return {
    courses,
    categories,
    isLoading,
    error,
    refetchCourses: fetchCourses,
    refetchCategories: fetchCategories,
    cloneCourse,
    updateStatus,
    deleteCourse,
  }
}
