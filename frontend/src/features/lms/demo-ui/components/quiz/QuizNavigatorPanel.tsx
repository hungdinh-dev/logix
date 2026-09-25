'use client'

import { Flag, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import type { QuizQuestionData } from '../../types/quiz.types'

type NavStatus = 'answered' | 'current' | 'flagged' | 'unanswered' | 'correct' | 'wrong'

function getNavStatus(
  question: QuizQuestionData,
  currentId: string,
  answers: Record<string, string | string[]>,
  flagged: Set<string>,
  isReviewMode: boolean
): NavStatus {
  if (isReviewMode) {
    if (question.id === currentId) return 'current'
    return question.isCorrect ? 'correct' : 'wrong'
  }
  if (question.id === currentId) return 'current'
  if (flagged.has(question.id)) return 'flagged'

  const ans = answers[question.id]
  if (ans && (Array.isArray(ans) ? ans.length > 0 : Boolean(ans))) {
    return 'answered'
  }
  return 'unanswered'
}

interface QuizNavigatorPanelProps {
  readonly questions: readonly QuizQuestionData[]
  readonly currentQuestionId: string
  readonly answers: Record<string, string | string[]>
  readonly flagged: Set<string>
  readonly isReviewMode?: boolean
  readonly isSubmitting?: boolean
  readonly onNavigate: (index: number) => void
  readonly onToggleFlag: () => void
  readonly onSubmit: () => void
}

export function QuizNavigatorPanel({
  questions,
  currentQuestionId,
  answers,
  flagged,
  isReviewMode = false,
  isSubmitting = false,
  onNavigate,
  onToggleFlag,
  onSubmit,
}: QuizNavigatorPanelProps) {
  const currentFlagged = flagged.has(currentQuestionId)

  const answeredCount = Object.keys(answers).filter((qId) => {
    const a = answers[qId]
    return a && (Array.isArray(a) ? a.length > 0 : Boolean(a))
  }).length

  const unansweredCount = questions.length - answeredCount

  const correctCount = questions.filter((q) => q.isCorrect).length
  const wrongCount = questions.length - correctCount

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isReviewMode ? 'Tổng quan kết quả' : 'Danh sách câu hỏi'}
        </p>
        <span className="text-[11px] font-medium text-muted-foreground">
          {questions.length} câu
        </span>
      </div>

      {/* Grid */}
      <div className="mb-4 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-1.5">
        {questions.map((q, i) => {
          const status = getNavStatus(
            q,
            currentQuestionId,
            answers,
            flagged,
            isReviewMode
          )

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onNavigate(i)}
              className={cn(
                'relative flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-bold transition-all',
                status === 'current' &&
                  'ring-2 ring-primary ring-offset-1 ring-offset-background font-black',
                status === 'answered' &&
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                status === 'flagged' &&
                  'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40',
                status === 'unanswered' &&
                  'bg-muted text-muted-foreground hover:bg-muted/80',
                status === 'correct' &&
                  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 font-bold',
                status === 'wrong' &&
                  'bg-destructive/15 text-destructive border border-destructive/40 font-bold'
              )}
              aria-label={`Đi tới câu ${q.number || i + 1}`}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {q.number || i + 1}
              {status === 'flagged' && !isReviewMode && (
                <Flag className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400" />
              )}
              {isReviewMode && q.isCorrect && (
                <CheckCircle2 className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
              )}
              {isReviewMode && !q.isCorrect && (
                <XCircle className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 text-destructive" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mb-4 space-y-1.5 border-t border-border pt-3">
        {isReviewMode ? (
          <>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                <span className="text-muted-foreground">Trả lời đúng</span>
              </div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {correctCount} câu
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-destructive" />
                <span className="text-muted-foreground">Trả lời sai</span>
              </div>
              <span className="font-semibold text-destructive">{wrongCount} câu</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span className="text-muted-foreground">Đã trả lời</span>
              </div>
              <span className="font-semibold text-foreground">{answeredCount}</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                <span className="text-muted-foreground">Đánh dấu xem lại</span>
              </div>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {flagged.size}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-muted" />
                <span className="text-muted-foreground">Chưa trả lời</span>
              </div>
              <span className="font-semibold text-muted-foreground">
                {unansweredCount}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Flag toggle (Only when taking test) */}
      {!isReviewMode && (
        <button
          type="button"
          onClick={onToggleFlag}
          className={cn(
            'mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
            currentFlagged
              ? 'border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
              : 'border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
        >
          <Flag
            className={cn(
              'h-3.5 w-3.5',
              currentFlagged && 'fill-amber-600 dark:fill-amber-400'
            )}
          />
          {currentFlagged ? 'Bỏ đánh dấu câu này' : 'Đánh dấu xem lại'}
        </button>
      )}

      {/* Submit button with Confirmation Dialog */}
      {!isReviewMode && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={isSubmitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Đang nộp bài...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Nộp Bài Kiểm Tra
                </>
              )}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Xác nhận nộp bài kiểm tra?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-xs space-y-2">
                <p>
                  Bạn đã trả lời{' '}
                  <strong className="text-foreground">
                    {answeredCount} / {questions.length}
                  </strong>{' '}
                  câu hỏi.
                </p>
                {unansweredCount > 0 && (
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    ⚠️ Còn {unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp
                    bài ngay bây giờ?
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Hệ thống sẽ tiến hành chấm điểm và lưu kết quả lượt thi của bạn.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border bg-card text-foreground hover:bg-muted/50 text-xs">
                Tiếp tục làm bài
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
              >
                Xác nhận nộp bài
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
