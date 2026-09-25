'use client'

import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Eye,
  Award,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { QuizSubmitResult } from '../../types/quiz.types'

interface QuizResultModalProps {
  isOpen: boolean
  result: QuizSubmitResult | null
  onClose: () => void
  onRetake: () => void
  onReview: () => void
}

export function QuizResultModal({
  isOpen,
  result,
  onClose,
  onRetake,
  onReview,
}: QuizResultModalProps) {
  const router = useRouter()

  if (!result) return null

  const isPassed = result.isPassed
  const canRetake =
    !isPassed && (result.remainingAttempts === null || result.remainingAttempts > 0)

  const handleContinueNext = () => {
    onClose()
    if (result.nextLesson?.id) {
      router.push(`/lms/lessons/${result.nextLesson.id}`)
    } else if (result.courseId) {
      router.push(`/lms/courses/${result.courseId}`)
    } else {
      router.push('/lms/courses')
    }
  }

  const handleBackToCourse = () => {
    onClose()
    if (result.courseId) {
      router.push(`/lms/courses/${result.courseId}`)
    } else {
      router.push('/lms/courses')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader className="text-center sm:text-center">
          {/* Status Icon */}
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
            {isPassed ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="h-9 w-9" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive animate-in zoom-in-75 duration-300">
                <XCircle className="h-9 w-9" />
              </div>
            )}
          </div>

          <DialogTitle className="text-xl font-bold text-foreground">
            {isPassed ? 'Chúc mừng bạn đã ĐẠT!' : 'Chưa đạt điểm yêu cầu'}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            {isPassed
              ? `Bạn đã hoàn thành xuất sắc bài kiểm tra "${result.lessonTitle}". Tiến độ đã được ghi nhận tự động!`
              : `Rất tiếc, điểm số của bạn chưa đạt ngưỡng ${result.passScore}% để hoàn thành bài học.`}
          </DialogDescription>
        </DialogHeader>

        {/* Score & Metrics Cards */}
        <div className="space-y-3 py-2">
          {/* Main Score Display */}
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-xl p-4 text-center border',
              isPassed
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                : 'bg-destructive/5 dark:bg-destructive/10 border-destructive/20'
            )}
          >
            <span className="text-xs font-medium text-muted-foreground">
              Điểm số bài thi
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span
                className={cn(
                  'text-4xl font-black font-mono tracking-tight',
                  isPassed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-destructive'
                )}
              >
                {result.score}%
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                / {result.passScore}% điểm đạt
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-[11px] font-semibold mt-1',
                isPassed
                  ? 'border-emerald-300 text-emerald-700 bg-emerald-100/60 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'border-destructive/30 text-destructive bg-destructive/10'
              )}
            >
              {isPassed ? '✓ ĐÃ HOÀN THÀNH BÀI HỌC' : '✕ CHƯA ĐẠT CHỈ TIÊU'}
            </Badge>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <p className="text-[11px] text-muted-foreground">Số câu đúng</p>
              <p className="mt-1 font-bold text-foreground font-mono">
                {result.correctCount} / {result.totalQuestions}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <p className="text-[11px] text-muted-foreground">Lượt thi</p>
              <p className="mt-1 font-bold text-foreground font-mono">
                Lần #{result.attemptNumber}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <p className="text-[11px] text-muted-foreground">Lượt còn lại</p>
              <p className="mt-1 font-bold text-foreground font-mono">
                {result.remainingAttempts !== null
                  ? `${result.remainingAttempts} lần`
                  : 'Không giới hạn'}
              </p>
            </div>
          </div>

          {/* Course Completion Banner */}
          {result.isCourseCompleted && (
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50/80 p-3 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <Award className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-xs">
                <strong className="font-bold">Đã hoàn thành 100% khóa học!</strong>
                <p className="text-[11px] opacity-90">
                  Chứng chỉ điện tử đã được tự động cấp vào hồ sơ của bạn.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex-col sm:flex-col gap-2 pt-2">
          {isPassed ? (
            <>
              <Button
                onClick={handleContinueNext}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
              >
                {result.nextLesson ? (
                  <>
                    Tiếp tục bài tiếp theo: {result.nextLesson.title}
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Quay lại trang khóa học
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={onReview}
                className="w-full text-xs gap-1.5 border-border"
              >
                <Eye className="h-3.5 w-3.5" />
                Xem lại bài làm &amp; Lời giải chi tiết
              </Button>
            </>
          ) : (
            <>
              {canRetake && (
                <Button
                  onClick={onRetake}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Làm lại bài kiểm tra ({result.remainingAttempts} lượt còn lại)
                </Button>
              )}

              <Button
                variant="outline"
                onClick={onReview}
                className="w-full text-xs gap-1.5 border-border"
              >
                <Eye className="h-3.5 w-3.5" />
                Xem lại đáp án &amp; Lời giải
              </Button>

              <Button
                variant="ghost"
                onClick={handleBackToCourse}
                className="w-full text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Về danh mục bài học để ôn tập
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
