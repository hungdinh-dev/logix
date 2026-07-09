import { BookOpen, Briefcase, Code2, MessageCircle, Shield, UserCheck } from 'lucide-react'

import { LMS_PALETTE } from '../components/shared/lms-palette'
import type { CatalogCourse, Category, SortOption } from '../types/lms-catalog.types'

export const LMS_CATALOG_CATEGORIES: Category[] = ['All', 'Leadership', 'Compliance', 'Technical', 'Soft Skills', 'Onboarding']
export const LMS_CATALOG_SORT_OPTIONS: SortOption[] = ['Most Popular', 'Newest', 'A–Z']

export const LMS_CATALOG_COURSES: CatalogCourse[] = [
  { id: 1, title: 'Advanced Project Management for Teams', instructor: 'Dr. Sarah Chen', category: 'Leadership', duration: '6h 30m', enrolled: 1240, rating: 4.8, reviews: 312, enrolledByMe: true, accentColor: LMS_PALETTE.primary, categoryIcon: Briefcase },
  { id: 2, title: 'Data Privacy & GDPR Fundamentals', instructor: 'James Miller', category: 'Compliance', duration: '3h 15m', enrolled: 890, rating: 4.6, reviews: 204, enrolledByMe: false, accentColor: LMS_PALETTE.teal, categoryIcon: Shield },
  { id: 3, title: 'Python for Business Analytics', instructor: 'Prof. Linda Wu', category: 'Technical', duration: '12h 00m', enrolled: 2100, rating: 4.9, reviews: 578, enrolledByMe: false, accentColor: LMS_PALETTE.success, categoryIcon: Code2 },
  { id: 4, title: 'Leadership Essentials: Building High-Performance Teams', instructor: 'Robert Hayes', category: 'Leadership', duration: '5h 45m', enrolled: 1680, rating: 4.7, reviews: 421, enrolledByMe: true, accentColor: LMS_PALETTE.primary, categoryIcon: UserCheck },
  { id: 5, title: 'Effective Business Communication', instructor: 'Maria Santos', category: 'Soft Skills', duration: '4h 00m', enrolled: 760, rating: 4.5, reviews: 189, enrolledByMe: false, accentColor: LMS_PALETTE.amber, categoryIcon: MessageCircle },
  { id: 6, title: 'New Employee Orientation Program', instructor: 'HR Department', category: 'Onboarding', duration: '2h 30m', enrolled: 430, rating: 4.3, reviews: 97, enrolledByMe: false, accentColor: LMS_PALETTE.teal, categoryIcon: BookOpen },
  { id: 7, title: 'Cybersecurity Awareness 2024', instructor: 'Alex Thompson', category: 'Compliance', duration: '1h 45m', enrolled: 3200, rating: 4.7, reviews: 845, enrolledByMe: false, accentColor: LMS_PALETTE.teal, categoryIcon: Shield },
  { id: 8, title: 'Conflict Resolution & Negotiation', instructor: 'Dr. Priya Patel', category: 'Soft Skills', duration: '2h 15m', enrolled: 920, rating: 4.9, reviews: 263, enrolledByMe: false, accentColor: LMS_PALETTE.amber, categoryIcon: MessageCircle },
  { id: 9, title: 'Cloud Infrastructure with AWS', instructor: 'Kevin Park', category: 'Technical', duration: '15h 20m', enrolled: 1540, rating: 4.8, reviews: 392, enrolledByMe: true, accentColor: LMS_PALETTE.success, categoryIcon: Code2 },
]
