import type { LucideIcon } from 'lucide-react'

export interface CourseInProgress {
  readonly id: number
  readonly category: string
  readonly title: string
  readonly instructor: string
  readonly progress: number
  readonly timeLeft: string
  readonly accentColor: string
}

export interface Deadline {
  readonly id: number
  readonly course: string
  readonly lesson: string
  readonly dueLabel: string
  readonly urgent: boolean
}

export interface RecommendedCourse {
  readonly id: number
  readonly category: string
  readonly title: string
  readonly description: string
  readonly rating: number
  readonly duration: string
  readonly accentColor: string
}

export interface StatItem {
  readonly label: string
  readonly value: number
  readonly icon: LucideIcon
  readonly iconColor: string
  readonly bgColor: string
}
