import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

import {
  CatalogCourseCardGrid,
  CatalogCourseCardList,
  CatalogPagination,
} from '../components/catalog/CatalogCards'
import { CatalogHeader } from '../components/catalog/CatalogHeader'
import { LMS_PALETTE } from '../components/shared/lms-palette'
import {
  LMS_CATALOG_CATEGORIES,
  LMS_CATALOG_COURSES,
  LMS_CATALOG_SORT_OPTIONS,
} from '../mocks/lms-catalog.mock'
import type { Category, SortOption, ViewMode } from '../types/lms-catalog.types'

export default function LMSCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [sortBy, setSortBy] = useState<SortOption>('Most Popular')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = LMS_CATALOG_COURSES.filter((course) => {
    const matchCategory = activeCategory === 'All' || course.category === activeCategory
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    return matchCategory && matchSearch
  }).sort((firstCourse, secondCourse) => {
    if (sortBy === 'Most Popular') return secondCourse.enrolled - firstCourse.enrolled
    if (sortBy === 'Newest') return secondCourse.id - firstCourse.id
    return firstCourse.title.localeCompare(secondCourse.title)
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: LMS_PALETTE.canvas }}>
      <CatalogHeader />

      <div className="mx-auto max-w-7xl px-8 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: LMS_PALETTE.ink }}>Course Catalog</h1>
            <p className="mt-0.5 text-[12px]" style={{ color: LMS_PALETTE.muted }}>
              {filtered.length} course{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center gap-2 rounded-lg border px-3 text-[12px]" style={{ backgroundColor: LMS_PALETTE.canvas, borderColor: LMS_PALETTE.border, color: LMS_PALETTE.muted, width: 220 }}>
              <Search style={{ width: 13, height: 13, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setCurrentPage(1)
                }}
                className="flex-1 bg-transparent outline-none text-[12px]"
                style={{ color: LMS_PALETTE.body }}
              />
            </div>

            <button
              type="button"
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-[12px] font-medium transition-colors duration-150"
              style={{ backgroundColor: LMS_PALETTE.canvas, borderColor: LMS_PALETTE.border, color: LMS_PALETTE.body }}
              onMouseEnter={(event) => {
                ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.surfaceSoft
              }}
              onMouseLeave={(event) => {
                ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.canvas
              }}
            >
              <SlidersHorizontal style={{ width: 13, height: 13 }} />
              Filters
            </button>

            <div className="flex items-center overflow-hidden rounded-lg border" style={{ backgroundColor: LMS_PALETTE.canvas, borderColor: LMS_PALETTE.border }}>
              {(['grid', 'list'] as ViewMode[]).map((mode) => {
                const Icon = mode === 'grid' ? LayoutGrid : List
                const isActive = viewMode === mode

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center transition-colors duration-150"
                    style={isActive ? { backgroundColor: LMS_PALETTE.surfaceCard, color: LMS_PALETTE.primary } : { color: LMS_PALETTE.mutedSoft }}
                    aria-label={`${mode} view`}
                  >
                    <Icon style={{ width: 14, height: 14 }} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {LMS_CATALOG_CATEGORIES.map((category) => {
              const isActive = activeCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category)
                    setCurrentPage(1)
                  }}
                  className="flex-shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors duration-150"
                  style={isActive ? { backgroundColor: LMS_PALETTE.surfaceCard, color: LMS_PALETTE.ink, borderColor: LMS_PALETTE.border } : { backgroundColor: LMS_PALETTE.canvas, color: LMS_PALETTE.muted, borderColor: LMS_PALETTE.border }}
                  onMouseEnter={(event) => {
                    if (!isActive) {
                      ;(event.currentTarget as HTMLButtonElement).style.borderColor = LMS_PALETTE.primary
                      ;(event.currentTarget as HTMLButtonElement).style.color = LMS_PALETTE.primary
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!isActive) {
                      ;(event.currentTarget as HTMLButtonElement).style.borderColor = LMS_PALETTE.border
                      ;(event.currentTarget as HTMLButtonElement).style.color = LMS_PALETTE.muted
                    }
                  }}
                >
                  {category}
                </button>
              )
            })}
          </div>

          <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-[12px]" style={{ backgroundColor: LMS_PALETTE.canvas, borderColor: LMS_PALETTE.border }}>
            <span style={{ color: LMS_PALETTE.muted }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="cursor-pointer bg-transparent text-[12px] font-medium outline-none"
              style={{ color: LMS_PALETTE.body }}
            >
              {LMS_CATALOG_SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: LMS_PALETTE.mutedSoft }}>
            <Search style={{ width: 40, height: 40, marginBottom: 12 }} />
            <p className="text-[14px] font-medium">No courses found</p>
            <p className="mt-1 text-[12px]">Try adjusting your filters or search query</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CatalogCourseCardGrid key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((course) => (
              <CatalogCourseCardList key={course.id} course={course} />
            ))}
          </div>
        )}

        {filtered.length > 0 && <CatalogPagination current={currentPage} total={5} onChange={setCurrentPage} />}
      </div>
    </div>
  )
}
