import type { CreateCoursePayload } from '@/features/lms/services/course.service'
import type { TargetingValues } from '@/features/lms/course-targeting/components/CourseTargetingCard'

export type StepNumber = 1 | 2
export type PreviewTheme = 'light' | 'dark'

export interface StepDefinition {
  step: StepNumber
  title: string
  desc: string
}

export const STEP_LABELS: StepDefinition[] = [
  { step: 1, title: 'Thông tin cơ bản & Phân loại', desc: 'Thiết lập định danh, đối tượng & cơ chế đào tạo' },
  { step: 2, title: 'Xem trước & Xuất bản', desc: 'Kiểm tra giao diện Dark/Light & khởi tạo giáo trình' },
]

export const SAMPLE_THUMBNAILS = [
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
]

/**
 * Slug helper function converting strings to URL-safe kebab-case.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')  
    .replace(/-+$/, '')
}

export type { CreateCoursePayload, TargetingValues }
