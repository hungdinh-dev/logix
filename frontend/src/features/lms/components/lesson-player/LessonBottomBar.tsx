import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LessonBottomBarProps {
  readonly lessonIndex: number;   // 1-based current
  readonly totalLessons: number;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

export function LessonBottomBar({ lessonIndex, totalLessons, onPrev, onNext }: LessonBottomBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const progressPct = totalLessons > 1 ? ((lessonIndex - 1) / (totalLessons - 1)) * 100 : 100;
  const isFirst = lessonIndex === 1;
  const isLast = lessonIndex === totalLessons;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border bg-card px-6 shadow-sm transition-all duration-300",
        isExpanded ? "h-16" : "h-11"
      )}
    >
      {/* Left: Previous button */}
      <div className={cn("transition-all duration-300 flex items-center", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden pointer-events-none")}>
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
      </div>

      {/* Center: Progress indicator & Toggle Area */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-1 flex-col items-center justify-center gap-1 cursor-pointer select-none hover:opacity-80 transition-opacity mx-4"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
            Lesson {lessonIndex} of {totalLessons}
          </span>
          <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider flex items-center gap-1">
            {isExpanded ? (
              <>
                Collapse
                <ChevronDown className="h-2.5 w-2.5" />
              </>
            ) : (
              <>
                Expand Navigation
                <ChevronUp className="h-2.5 w-2.5" />
              </>
            )}
          </span>
        </div>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </button>

      {/* Right: Next / Complete button */}
      <div className={cn("transition-all duration-300 flex items-center", isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden pointer-events-none")}>
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
    </div>
  );
}
