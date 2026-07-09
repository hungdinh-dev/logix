'use client'

import {
  DashboardCourseProgressCard,
  DashboardDeadlineRow,
  DashboardProgressRing,
  DashboardRecommendedCard,
} from '../components/dashboard/DashboardCards'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import {
  LMS_DASHBOARD_COURSES_IN_PROGRESS,
  LMS_DASHBOARD_DEADLINES,
  LMS_DASHBOARD_RECOMMENDED,
  LMS_DASHBOARD_STATS,
} from '../mocks/lms-dashboard.mock'
import { useRouter } from 'next/navigation'

export default function LMSDashboardPage() {
  const router = useRouter()

  return (
    <div className="bg-background min-h-screen">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl space-y-5 px-8 py-6">
        <button
          type="button"
          onClick={() => router.push('/lms/progress')}
          className="bg-card border-border hover:bg-muted/30 flex w-full items-center justify-between rounded-xl border px-6 py-5 text-left transition-colors duration-150"
        >
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight">Good morning, Alex</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              You have <span className="text-primary font-semibold">3 lessons</span> left this week to meet your goal.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <DashboardProgressRing value={65} />
            <div>
              <p className="text-foreground text-xs font-semibold">Weekly Goal</p>
              <p className="text-muted-foreground/80 mt-0.5 text-xs">4/7 hrs completed</p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-4 gap-3">
          {LMS_DASHBOARD_STATS.map(({ label, value, icon: Icon, iconColor, bgColor }) => (
            <div key={label} className="bg-card border-border flex items-center gap-3 rounded-lg border px-4 py-4">
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bgColor }}>
                <Icon className="h-[18px] w-[18px]" style={{ color: iconColor }} aria-hidden="true" />
              </span>
              <div>
                <p className="text-foreground text-[22px] font-bold leading-none">{value}</p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-foreground text-sm font-semibold">Continue Learning</h2>
              <button type="button" onClick={() => router.push('/lms/progress')} className="text-primary cursor-pointer text-xs font-medium transition-opacity duration-150 hover:opacity-75">
                View all →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {LMS_DASHBOARD_COURSES_IN_PROGRESS.map((course) => (
                <DashboardCourseProgressCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold">Upcoming Deadlines</h2>
            <div className="bg-card border-border overflow-hidden rounded-xl border">
              {LMS_DASHBOARD_DEADLINES.map((item, index) => (
                <DashboardDeadlineRow key={item.id} item={item} last={index === LMS_DASHBOARD_DEADLINES.length - 1} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-foreground text-sm font-semibold">Recommended For You</h2>
            <button type="button" className="text-primary cursor-pointer text-xs font-medium transition-opacity duration-150 hover:opacity-75">
              Explore Catalog →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {LMS_DASHBOARD_RECOMMENDED.map((course) => (
              <DashboardRecommendedCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
