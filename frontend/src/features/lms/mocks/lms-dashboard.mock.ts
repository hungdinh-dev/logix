import { Award, BookOpen, CheckCircle, Clock } from 'lucide-react'

import { LMS_PALETTE } from '../components/shared/lms-palette'
import type { CourseInProgress, Deadline, RecommendedCourse, StatItem } from '../types/lms-dashboard.types'

export const LMS_DASHBOARD_STATS: StatItem[] = [
  { label: 'Courses In Progress', value: 5, icon: BookOpen, iconColor: LMS_PALETTE.primary, bgColor: 'color-mix(in oklch, var(--primary) 10%, transparent)' },
  { label: 'Completed', value: 12, icon: CheckCircle, iconColor: LMS_PALETTE.success, bgColor: `${LMS_PALETTE.success}1A` },
  { label: 'Hours Learned', value: 48, icon: Clock, iconColor: LMS_PALETTE.amber, bgColor: `${LMS_PALETTE.amber}1A` },
  { label: 'Certificates', value: 3, icon: Award, iconColor: LMS_PALETTE.teal, bgColor: `${LMS_PALETTE.teal}1A` },
]

export const LMS_DASHBOARD_COURSES_IN_PROGRESS: CourseInProgress[] = [
  { id: 1, category: 'Management', title: 'Advanced Project Management', instructor: 'Dr. Sarah Chen', progress: 75, timeLeft: '2h left', accentColor: LMS_PALETTE.primary },
  { id: 2, category: 'Data Science', title: 'Data Visualization with Python', instructor: 'Prof. James Miller', progress: 40, timeLeft: '5h left', accentColor: LMS_PALETTE.teal },
  { id: 3, category: 'Finance', title: 'Corporate Finance Fundamentals', instructor: 'Lisa Thompson, CFA', progress: 20, timeLeft: '8h left', accentColor: LMS_PALETTE.amber },
]

export const LMS_DASHBOARD_DEADLINES: Deadline[] = [
  { id: 1, course: 'Annual Safety Training', lesson: 'Mandatory Compliance', dueLabel: 'Due Tomorrow', urgent: true },
  { id: 2, course: 'Leadership 101 Module', lesson: 'Management Track', dueLabel: 'Due in 3 days', urgent: false },
  { id: 3, course: 'Q3 Policy Quiz', lesson: 'HR Requirements', dueLabel: 'Due Oct 15', urgent: false },
]

export const LMS_DASHBOARD_RECOMMENDED: RecommendedCourse[] = [
  { id: 1, category: 'Finance', title: 'Financial Modeling Basics', description: 'Build robust financial models in Excel for business decisions.', rating: 4.8, duration: '4h 30m', accentColor: LMS_PALETTE.primary },
  { id: 2, category: 'Soft Skills', title: 'Conflict Resolution', description: 'Navigate workplace disagreements professionally and effectively.', rating: 4.9, duration: '2h 15m', accentColor: LMS_PALETTE.teal },
  { id: 3, category: 'Technology', title: 'Cybersecurity Awareness 2024', description: 'Stay updated on latest security threats and best practices.', rating: 4.7, duration: '1h 45m', accentColor: LMS_PALETTE.success },
]
