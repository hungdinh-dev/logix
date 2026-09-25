'use client'

import { useEffect, useState } from 'react'
import { Clock, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizTopBarProps {
  readonly courseName: string
  readonly quizTitle: string
  readonly currentQuestion: number
  readonly totalQuestions: number
  readonly initialSeconds: number
  readonly onSaveExit: () => void
  readonly onTimeExpired?: () => void
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export function QuizTopBar({
  courseName,
  quizTitle,
  currentQuestion,
  totalQuestions,
  initialSeconds,
  onSaveExit,
  onTimeExpired,
}: QuizTopBarProps) {
  const isTimed = initialSeconds > 0
  const [seconds, setSeconds] = useState(initialSeconds)
  const isUrgent = isTimed && seconds < 120

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (!isTimed) return
    if (seconds <= 0) {
      if (onTimeExpired) {
        onTimeExpired()
      }
      return
    }

    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id)
          if (onTimeExpired) onTimeExpired()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isTimed, seconds, onTimeExpired])

  const progressPct =
    totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0

  return (
    <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6 shadow-sm">
      {/* Left: course + quiz title */}
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-xs text-muted-foreground truncate">{courseName || 'Khóa học'}</p>
        <p className="truncate text-sm font-semibold text-foreground">{quizTitle}</p>
      </div>

      {/* Center: timer */}
      {isTimed ? (
        <div
          className={cn(
            'flex items-center gap-2 rounded-full px-3.5 py-1.5 transition-colors',
            isUrgent ? 'bg-destructive/12 animate-pulse' : 'bg-amber-500/15'
          )}
        >
          <Clock
            className={cn(
              'h-4 w-4 shrink-0',
              isUrgent ? 'text-destructive' : 'text-amber-700 dark:text-amber-400'
            )}
          />
          <span
            className={cn(
              'font-mono text-sm sm:text-base font-bold tabular-nums',
              isUrgent ? 'text-destructive' : 'text-amber-700 dark:text-amber-400'
            )}
          >
            {formatTime(seconds)}
          </span>
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 bg-muted/60 text-muted-foreground text-xs font-medium">
          <Clock className="h-3.5 w-3.5" />
          <span>Không giới hạn thời gian</span>
        </div>
      )}

      {/* Right: progress + save exit */}
      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4 pl-3">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Câu {currentQuestion} / {totalQuestions}
          </span>
          <div className="h-1.5 w-24 lg:w-32 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSaveExit}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground shrink-0"
          title="Tạm dừng & Thoát về bài học"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Lưu &amp; Thoát</span>
        </button>
      </div>
    </div>
  )
}
