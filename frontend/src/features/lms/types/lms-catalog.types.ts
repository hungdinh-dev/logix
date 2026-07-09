import type { LucideIcon } from 'lucide-react'

export type Category = 'All' | 'Leadership' | 'Compliance' | 'Technical' | 'Soft Skills' | 'Onboarding'
export type SortOption = 'Most Popular' | 'Newest' | 'A–Z'
export type ViewMode = 'grid' | 'list'

export interface CatalogCourse {
  readonly id: number
  readonly title: string
  readonly instructor: string
  readonly category: Exclude<Category, 'All'>
  readonly duration: string
  readonly enrolled: number
  readonly rating: number
  readonly reviews: number
  readonly enrolledByMe: boolean
  readonly accentColor: string
  readonly categoryIcon: LucideIcon
}
