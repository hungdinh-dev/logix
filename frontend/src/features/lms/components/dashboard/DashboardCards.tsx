import { BookOpen, Calendar, ChevronRight, Clock, Play, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CourseInProgress, Deadline, RecommendedCourse } from '../../types/lms-dashboard.types'

interface DashboardProgressRingProps {
  readonly value: number
  readonly size?: number
}

export function DashboardProgressRing({ value, size = 68 }: DashboardProgressRingProps) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (value / 100) * circumference

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--primary)" strokeOpacity={0.18} strokeWidth={5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={5}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize="13"
        fontWeight="700"
        fill="var(--primary)"
        fontFamily="inherit"
      >
        {value}%
      </text>
    </svg>
  )
}

interface DashboardCourseProgressCardProps {
  readonly course: CourseInProgress
}

export function DashboardCourseProgressCard({ course }: DashboardCourseProgressCardProps) {
  const router = useRouter()

  return (
    <Card className="flex flex-col overflow-hidden shadow-none">
      <div className="relative flex h-32 items-center justify-center" style={{ backgroundColor: `${course.accentColor}14` }}>
        <BookOpen className="h-9 w-9 opacity-50" style={{ color: course.accentColor }} aria-hidden="true" />
        <span
          className="bg-background absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ color: course.accentColor }}
        >
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-foreground text-xs font-semibold leading-snug">{course.title}</p>
        <p className="text-muted-foreground text-[11px]">{course.instructor}</p>

        <div className="mt-auto pt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-muted-foreground/80 text-[10px]">{course.timeLeft}</span>
            <span className="text-[10px] font-semibold" style={{ color: course.accentColor }}>{course.progress}%</span>
          </div>
          <div className="bg-muted h-1.5 overflow-hidden rounded-full">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${course.progress}%`, backgroundColor: course.accentColor }} />
          </div>
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              className="hover:bg-[var(--hover-bg)] flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                borderColor: course.accentColor,
                color: course.accentColor,
                '--hover-bg': `${course.accentColor}14`,
              } as React.CSSProperties}
              onClick={() => router.push(`/lms/lessons/${course.id}`)}
            >
              <Play className="h-2.5 w-2.5" style={{ fill: course.accentColor }} aria-hidden="true" />
              Resume
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface DashboardDeadlineRowProps {
  readonly item: Deadline
  readonly last: boolean
}

export function DashboardDeadlineRow({ item, last }: DashboardDeadlineRowProps) {
  return (
    <div
      className={cn(
        "hover:bg-secondary/50 flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-150",
        !last && "border-b border-border"
      )}
    >
      <Calendar className="text-amber-500 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-xs font-medium">{item.course}</p>
        <p className="text-muted-foreground truncate text-[11px]">{item.lesson}</p>
      </div>
      <span
        className={cn(
          "shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold",
          item.urgent ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        )}
      >
        {item.dueLabel}
      </span>
      <ChevronRight className="text-muted-foreground/70 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </div>
  )
}

interface DashboardRecommendedCardProps {
  readonly course: RecommendedCourse
}

export function DashboardRecommendedCard({ course }: DashboardRecommendedCardProps) {
  const router = useRouter()

  return (
    <Card className="flex flex-col overflow-hidden shadow-none">
      <div className="relative flex h-28 items-center justify-center" style={{ backgroundColor: `${course.accentColor}14` }}>
        <BookOpen className="h-8 w-8 opacity-50" style={{ color: course.accentColor }} aria-hidden="true" />
        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between">
          <span className="bg-background rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ color: course.accentColor }}>
            {course.category}
          </span>
          <span className="text-amber-500 flex items-center gap-0.5 text-[11px] font-semibold">
            <Star className="text-amber-500 fill-current h-2.5 w-2.5" strokeWidth={0} aria-hidden="true" />
            {course.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-foreground text-xs font-semibold">{course.title}</p>
        <p className="text-muted-foreground flex-1 text-[11px] leading-relaxed">{course.description}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-muted-foreground/80 flex items-center gap-1 text-[11px]">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {course.duration}
          </span>
          <Button
            size="sm"
            className="h-7 rounded-md px-3 text-[11px] font-semibold"
            onClick={() => router.push('/lms/courses')}
          >
            Enroll
          </Button>
        </div>
      </div>
    </Card>
  )
}
