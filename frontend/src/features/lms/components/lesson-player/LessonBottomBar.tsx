import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonBottomBarProps {
  readonly lessonIndex: number;   // 1-based current
  readonly totalLessons: number;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

export function LessonBottomBar({ lessonIndex, totalLessons, onPrev, onNext }: LessonBottomBarProps) {
  const progressPct = ((lessonIndex - 1) / (totalLessons - 1)) * 100;
  const isFirst = lessonIndex === 1;
  const isLast = lessonIndex === totalLessons;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-border bg-card px-6 shadow-sm">
      {/* Previous */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50',
          isFirst && 'cursor-not-allowed opacity-40',
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Previous Lesson
      </button>

      {/* Center: progress */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs text-muted-foreground">
          Lesson {lessonIndex} of {totalLessons}
        </span>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Next / Complete */}
      <button
        type="button"
        onClick={onNext}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/80"
      >
        {isLast ? (
          <>
            <CheckCircle className="h-3.5 w-3.5" />
            Complete Course
          </>
        ) : (
          <>
            Mark as Complete &amp; Next
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
