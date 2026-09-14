import { Clock, Flame, Award, ExternalLink } from 'lucide-react';
import type { StreakDay } from '../../types/progress.types';

/* ── Donut chart (SVG) ── */
function DonutChart({ percent }: { percent: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="9" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="var(--primary)" strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="text-2xl font-bold text-foreground">{percent}%</span>
    </div>
  );
}

/* ── Sparkline (SVG) ── */
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const w = 80, h = 28;
  const step = w / (values.length - 1);
  const points = values.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-7">
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Streak dots ── */
function StreakDots({ days }: { days: readonly StreakDay[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {days.map((d) => (
        <div key={d.date} className="flex flex-col items-center gap-0.5">
          <div
            className={d.active ? 'h-2.5 w-2.5 rounded-full bg-green-700 dark:bg-green-400' : 'h-2.5 w-2.5 rounded-full bg-border'}
          />
          <span className="text-[9px] text-muted-foreground">{d.date[0]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Stat card wrapper ── */
function StatCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
      {children}
    </div>
  );
}

interface StatsRowProps {
  readonly overallCompletion: number;
  readonly totalHours: number;
  readonly hoursSparkline: number[];
  readonly currentStreak: number;
  readonly streakDays: readonly StreakDay[];
  readonly certificatesEarned: number;
}

export function StatsRow({
  overallCompletion,
  totalHours,
  hoursSparkline,
  currentStreak,
  streakDays,
  certificatesEarned,
}: StatsRowProps) {
  return (
    <div className="flex gap-4">
      {/* Overall Completion */}
      <StatCard>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall Completion</p>
        <div className="flex items-center justify-between">
          <DonutChart percent={overallCompletion} />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Across all</p>
            <p className="text-xs text-muted-foreground">enrolled courses</p>
          </div>
        </div>
      </StatCard>

      {/* Total Hours */}
      <StatCard>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Hours</p>
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">
            {totalHours}<span className="ml-1 text-base font-medium text-muted-foreground">hrs</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Last 7 days</p>
          <div className="mt-2">
            <Sparkline values={hoursSparkline} />
          </div>
        </div>
      </StatCard>

      {/* Current Streak */}
      <StatCard>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Streak</p>
          <Flame className="h-4 w-4 text-amber-700 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">
            {currentStreak}<span className="ml-1 text-base font-medium text-muted-foreground">day streak</span>
          </p>
          <div className="mt-3">
            <StreakDots days={streakDays} />
          </div>
        </div>
      </StatCard>

      {/* Certificates Earned */}
      <StatCard>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Certificates Earned</p>
          <Award className="h-4 w-4 text-green-700 dark:text-green-400" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-3xl font-bold text-foreground">{certificatesEarned}</p>
          <a
            href="#certificates"
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all certificates
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </StatCard>
    </div>
  );
}
