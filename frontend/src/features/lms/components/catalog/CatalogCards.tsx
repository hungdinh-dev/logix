import { ChevronLeft, ChevronRight, Clock, Play, Star, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { LMS_PALETTE } from '../shared/lms-palette'
import type { CatalogCourse } from '../../types/lms-catalog.types'

interface CatalogStarRowProps {
  readonly rating: number
  readonly reviews: number
}

export function CatalogStarRow({ rating, reviews }: CatalogStarRowProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            style={{
              width: 11,
              height: 11,
              fill: index < Math.round(rating) ? LMS_PALETTE.amber : LMS_PALETTE.border,
              color: index < Math.round(rating) ? LMS_PALETTE.amber : LMS_PALETTE.border,
              strokeWidth: 0,
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold" style={{ color: LMS_PALETTE.ink }}>{rating}</span>
      <span className="text-[11px]" style={{ color: LMS_PALETTE.mutedSoft }}>({reviews})</span>
    </div>
  )
}

interface CatalogCourseCardGridProps {
  readonly course: CatalogCourse
}

export function CatalogCourseCardGrid({ course }: CatalogCourseCardGridProps) {
  const router = useRouter()
  const CategoryIcon = course.categoryIcon
  const courseDetailPath = `/lms/courses/${course.id}`
  const courseLearnPath = `/lms/lessons/${course.id}`

  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border"
      style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border, boxShadow: '0 1px 3px rgba(20,20,19,0.08)', transition: 'box-shadow 180ms' }}
      role="button"
      tabIndex={0}
      onClick={() => router.push(courseDetailPath)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          router.push(courseDetailPath)
        }
      }}
      onMouseEnter={(event) => {
        ;(event.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(20,20,19,0.10)'
      }}
      onMouseLeave={(event) => {
        ;(event.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(20,20,19,0.08)'
      }}
    >
      <div className="relative flex items-center justify-center" style={{ height: 160, backgroundColor: `${course.accentColor}12` }}>
        <CategoryIcon style={{ color: course.accentColor, width: 44, height: 44, opacity: 0.45 }} />
        <span className="absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: course.accentColor }}>
          {course.category}
        </span>
        {course.enrolledByMe && (
          <span className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${LMS_PALETTE.success}18`, color: LMS_PALETTE.success }}>
            Enrolled
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p
          className="text-[13px] font-semibold leading-snug"
          style={{ color: LMS_PALETTE.ink, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {course.title}
        </p>

        <div className="flex items-center gap-2">
          <span className="flex shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ width: 24, height: 24, backgroundColor: `${course.accentColor}CC` }}>
            {course.instructor.split(' ').map((word) => word[0]).join('').slice(0, 2)}
          </span>
          <span className="truncate text-[11px]" style={{ color: LMS_PALETTE.muted }}>{course.instructor}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px]" style={{ color: LMS_PALETTE.mutedSoft }}>
            <Clock style={{ width: 11, height: 11 }} />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: LMS_PALETTE.mutedSoft }}>
            <Users style={{ width: 11, height: 11 }} />
            {course.enrolled.toLocaleString()}
          </span>
        </div>

        <CatalogStarRow rating={course.rating} reviews={course.reviews} />

        <div style={{ borderTop: `1px solid ${LMS_PALETTE.border}`, margin: '2px 0' }} />

        {course.enrolledByMe ? (
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border py-2 text-[12px] font-semibold transition-colors duration-150"
            style={{ borderColor: LMS_PALETTE.primary, color: LMS_PALETTE.primary }}
            onClick={(event) => {
              event.stopPropagation()
              router.push(courseLearnPath)
            }}
            onMouseEnter={(event) => {
              ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in oklch, var(--primary) 8%, transparent)'
            }}
            onMouseLeave={(event) => {
              ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
          >
            <Play style={{ width: 11, height: 11, fill: LMS_PALETTE.primary }} />
            Resume
          </button>
        ) : (
          <button
            type="button"
            className="w-full cursor-pointer rounded-md py-2 text-[12px] font-semibold text-white transition-colors duration-150"
            style={{ backgroundColor: LMS_PALETTE.primary, color: LMS_PALETTE.onDark }}
            onClick={(event) => {
              event.stopPropagation()
              router.push(courseLearnPath)
            }}
            onMouseEnter={(event) => {
              ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.primaryActive
            }}
            onMouseLeave={(event) => {
              ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.primary
            }}
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  )
}

interface CatalogCourseCardListProps {
  readonly course: CatalogCourse
}

export function CatalogCourseCardList({ course }: CatalogCourseCardListProps) {
  const router = useRouter()
  const CategoryIcon = course.categoryIcon
  const courseDetailPath = `/lms/courses/${course.id}`
  const courseLearnPath = `/lms/lessons/${course.id}`

  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-shadow duration-150"
      style={{ backgroundColor: LMS_PALETTE.surfaceCard, borderColor: LMS_PALETTE.border, boxShadow: '0 1px 3px rgba(20,20,19,0.08)' }}
      role="button"
      tabIndex={0}
      onClick={() => router.push(courseDetailPath)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          router.push(courseDetailPath)
        }
      }}
      onMouseEnter={(event) => {
        ;(event.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(20,20,19,0.10)'
      }}
      onMouseLeave={(event) => {
        ;(event.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(20,20,19,0.08)'
      }}
    >
      <div className="flex shrink-0 items-center justify-center rounded-lg" style={{ width: 64, height: 64, backgroundColor: `${course.accentColor}12` }}>
        <CategoryIcon style={{ color: course.accentColor, width: 28, height: 28, opacity: 0.55 }} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold" style={{ color: LMS_PALETTE.ink }}>{course.title}</p>
        <p className="mt-0.5 text-[11px]" style={{ color: LMS_PALETTE.muted }}>{course.instructor}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <CatalogStarRow rating={course.rating} reviews={course.reviews} />
          <span className="text-[11px]" style={{ color: LMS_PALETTE.border }}>·</span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: LMS_PALETTE.mutedSoft }}>
            <Clock style={{ width: 11, height: 11 }} />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: LMS_PALETTE.mutedSoft }}>
            <Users style={{ width: 11, height: 11 }} />
            {course.enrolled.toLocaleString()}
          </span>
        </div>
      </div>

      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${course.accentColor}14`, color: course.accentColor }}>
        {course.category}
      </span>

      {course.enrolledByMe ? (
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-4 py-2 text-[12px] font-semibold transition-colors duration-150"
          style={{ borderColor: LMS_PALETTE.primary, color: LMS_PALETTE.primary }}
          onClick={(event) => {
            event.stopPropagation()
            router.push(courseLearnPath)
          }}
          onMouseEnter={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'color-mix(in oklch, var(--primary) 8%, transparent)'
          }}
          onMouseLeave={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
          }}
        >
          <Play style={{ width: 11, height: 11, fill: LMS_PALETTE.primary }} />
          Resume
        </button>
      ) : (
        <button
          type="button"
          className="shrink-0 cursor-pointer rounded-md px-4 py-2 text-[12px] font-semibold text-white transition-colors duration-150"
          style={{ backgroundColor: LMS_PALETTE.primary, color: LMS_PALETTE.onDark }}
          onClick={(event) => {
            event.stopPropagation()
            router.push(courseLearnPath)
          }}
          onMouseEnter={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.primaryActive
          }}
          onMouseLeave={(event) => {
            ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.primary
          }}
        >
          Enroll Now
        </button>
      )}
    </div>
  )
}

interface CatalogPaginationProps {
  readonly current: number
  readonly total: number
  readonly onChange: (page: number) => void
}

export function CatalogPagination({ current, total, onChange }: CatalogPaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-30"
        style={{ color: LMS_PALETTE.muted }}
        onMouseEnter={(event) => {
          if (current > 1) (event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.surfaceCard
        }}
        onMouseLeave={(event) => {
          ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
        }}
        aria-label="Previous page"
      >
        <ChevronLeft style={{ width: 15, height: 15 }} />
      </button>

      {Array.from({ length: total }).map((_, index) => {
        const page = index + 1
        const isActive = page === current

        return (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[12px] font-medium transition-colors duration-150"
            style={isActive ? { backgroundColor: LMS_PALETTE.primary, color: LMS_PALETTE.onDark } : { color: LMS_PALETTE.muted }}
            onMouseEnter={(event) => {
              if (!isActive) (event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.surfaceCard
            }}
            onMouseLeave={(event) => {
              if (!isActive) (event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-30"
        style={{ color: LMS_PALETTE.muted }}
        onMouseEnter={(event) => {
          if (current < total) (event.currentTarget as HTMLButtonElement).style.backgroundColor = LMS_PALETTE.surfaceCard
        }}
        onMouseLeave={(event) => {
          ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
        }}
        aria-label="Next page"
      >
        <ChevronRight style={{ width: 15, height: 15 }} />
      </button>
    </div>
  )
}
