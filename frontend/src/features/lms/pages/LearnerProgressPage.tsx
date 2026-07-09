'use client'

import { StatsRow } from '../components/progress/StatsRow';
import { CourseProgressList } from '../components/progress/CourseProgressList';
import { WeeklyActivityChart } from '../components/progress/WeeklyActivityChart';
import { SkillsPanel } from '../components/progress/SkillsPanel';
import { CertificatesGrid } from '../components/progress/CertificatesGrid';
import { QuizTable } from '../components/progress/QuizTable';
import {
  MOCK_STATS,
  MOCK_STREAK_DAYS,
  MOCK_HOURS_SPARKLINE,
  MOCK_COURSES,
  MOCK_WEEKLY_ACTIVITY,
  MOCK_SKILLS,
  MOCK_CERTIFICATES,
  MOCK_QUIZ_RESULTS,
} from '../mocks/progress.mock';

const TOTAL_WEEKLY_MINUTES = MOCK_WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.minutes, 0);

export default function LearnerProgressPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl p-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">My Learning Progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your journey and achievements</p>
        </div>

        {/* Section 1 — Stats */}
        <section className="mb-8">
          <StatsRow
            overallCompletion={MOCK_STATS.overallCompletion}
            totalHours={MOCK_STATS.totalHours}
            hoursSparkline={MOCK_HOURS_SPARKLINE}
            currentStreak={MOCK_STATS.currentStreak}
            streakDays={MOCK_STREAK_DAYS}
            certificatesEarned={MOCK_STATS.certificatesEarned}
          />
        </section>

        {/* Section 2 — Course Progress */}
        <section className="mb-8">
          <CourseProgressList courses={MOCK_COURSES} />
        </section>

        {/* Section 3 — Activity + Skills (2-col) */}
        <section className="mb-8 flex gap-6">
          <div className="flex-[3]">
            <WeeklyActivityChart
              data={MOCK_WEEKLY_ACTIVITY}
              totalMinutes={TOTAL_WEEKLY_MINUTES}
            />
          </div>
          <div className="flex-[2]">
            <SkillsPanel skills={MOCK_SKILLS} />
          </div>
        </section>

        {/* Section 4 — Certificates */}
        <section className="mb-8">
          <CertificatesGrid certificates={MOCK_CERTIFICATES} />
        </section>

        {/* Section 5 — Quiz Table */}
        <section>
          <QuizTable results={MOCK_QUIZ_RESULTS} />
        </section>
      </div>
    </div>
  );
}
