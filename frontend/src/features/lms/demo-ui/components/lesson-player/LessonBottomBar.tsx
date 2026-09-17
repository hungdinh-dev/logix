'use client'

import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LessonBottomBarProps {
  readonly lessonIndex: number;   // 1-based current
  readonly totalLessons: number;
  readonly isNextChapter?: boolean;
  readonly isCompleting?: boolean;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

export function LessonBottomBar({
  lessonIndex,
  totalLessons,
  isNextChapter,
  isCompleting,
  onPrev,
  onNext,
}: LessonBottomBarProps) {
  const progressPct = totalLessons > 1 ? ((lessonIndex - 1) / (totalLessons - 1)) * 100 : 100;
  const isFirst = lessonIndex <= 1;
  const isLast = lessonIndex >= totalLessons;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-t border-border bg-card/95 backdrop-blur-md px-4 sm:px-6 shadow-md transition-all">
      {/* Left: Previous button */}
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={isFirst || isCompleting}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium border-border',
            isFirst && 'cursor-not-allowed opacity-40'
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Bài trước</span>
        </Button>
      </div>

      {/* Center: Progress indicator */}
      <div className="flex flex-col items-center justify-center gap-1 mx-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Bài <strong className="text-foreground font-semibold">{lessonIndex}</strong> / {totalLessons}
          </span>
          <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.2 rounded">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="h-1.5 w-32 sm:w-56 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Right: Next / Complete button */}
      <div className="flex items-center">
        <Button
          type="button"
          size="sm"
          onClick={onNext}
          disabled={isCompleting}
          className={cn(
            'flex items-center gap-1.5 text-xs font-semibold text-primary-foreground transition-all shadow-sm',
            isLast
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-primary hover:bg-primary/90'
          )}
        >
          {isCompleting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : isLast ? (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Hoàn thành khóa học</span>
            </>
          ) : isNextChapter ? (
            <>
              <span>Qua chương tiếp theo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>Hoàn thành & Tiếp tục</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
