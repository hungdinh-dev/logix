'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  LogOut,
  AlertTriangle,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { QuizTopBar } from '../components/quiz/QuizTopBar'
import { QuizNavigatorPanel } from '../components/quiz/QuizNavigatorPanel'
import { QuizQuestionCard } from '../components/quiz/QuizQuestionCard'
import { QuizResultModal } from '@/features/lms/components/quiz/QuizResultModal'
import { QuizSkeleton } from '@/features/lms/components/quiz/QuizSkeleton'
import { useQuizTake, useSubmitQuiz } from '@/features/lms/hooks/use-quiz'
import type {
  QuizQuestionData,
  QuizSubmitAnswerItem,
  QuizSubmitResult,
} from '../../types/quiz.types'

interface QuizPageProps {
  quizIdOrLessonId?: string
}

export default function QuizPage({ quizIdOrLessonId }: QuizPageProps) {
  const params = useParams()
  const router = useRouter()
  const resolvedId = quizIdOrLessonId || (params?.id as string) || ''

  // 1. Data Fetching via React Query
  const { data, isLoading, error, refetch } = useQuizTake(resolvedId)
  const submitMutation = useSubmitQuiz(resolvedId)

  // 2. Local State
  const [currentIndex, setCurrentIndex] = useState(0)
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({})
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({})
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  const [isReviewMode, setIsReviewMode] = useState(false)
  const [submitResult, setSubmitResult] = useState<QuizSubmitResult | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [showExitConfirmDialog, setShowExitConfirmDialog] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())

  // Reset timer on load
  useEffect(() => {
    setStartTime(Date.now())
  }, [resolvedId])

  // Prevent accidental tab close / page refresh during exam
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isReviewMode) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isReviewMode])

  // Computed properties
  const quiz = data?.quiz
  const studentStatus = data?.studentStatus
  const rawQuestions = data?.questions || []

  // In review mode, we display the graded review questions if available
  const questions: QuizQuestionData[] = useMemo(() => {
    if (isReviewMode && submitResult?.reviewQuestions) {
      return submitResult.reviewQuestions
    }
    return rawQuestions
  }, [isReviewMode, submitResult, rawQuestions])

  const totalQuestions = questions.length
  const currentQuestion = questions[currentIndex] || null

  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalQuestions - 1

  // Combined answers map for navigator status
  const combinedAnswersMap = useMemo(() => {
    const map: Record<string, string | string[]> = {}
    Object.entries(singleAnswers).forEach(([k, v]) => {
      if (v) map[k] = v
    })
    Object.entries(multiAnswers).forEach(([k, v]) => {
      if (v && v.length > 0) map[k] = v
    })
    Object.entries(textAnswers).forEach(([k, v]) => {
      if (v && v.trim()) map[k] = v
    })
    return map
  }, [singleAnswers, multiAnswers, textAnswers])

  // Answer Handlers
  const handleSelectSingle = (optionId: string) => {
    if (!currentQuestion || isReviewMode) return
    setSingleAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  const handleToggleMulti = (optionId: string) => {
    if (!currentQuestion || isReviewMode) return
    setMultiAnswers((prev) => {
      const currentList = prev[currentQuestion.id] || []
      const exists = currentList.includes(optionId)
      const nextList = exists
        ? currentList.filter((id) => id !== optionId)
        : [...currentList, optionId]
      return { ...prev, [currentQuestion.id]: nextList }
    })
  }

  const handleTextChange = (text: string) => {
    if (!currentQuestion || isReviewMode) return
    setTextAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }))
  }

  const handleToggleFlag = () => {
    if (!currentQuestion || isReviewMode) return
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id)
      } else {
        next.add(currentQuestion.id)
      }
      return next
    })
  }

  // Submission Handler
  const handleSubmit = async () => {
    if (isReviewMode || submitMutation.isPending) return

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000)

    const answersPayload: QuizSubmitAnswerItem[] = rawQuestions.map((q) => {
      const single = singleAnswers[q.id] || null
      const multi = multiAnswers[q.id] || []
      const text = textAnswers[q.id] || null

      return {
        questionId: q.id,
        selectedOptionId: single,
        selectedOptionIds: multi.length > 0 ? multi : undefined,
        textAnswer: text,
      }
    })

    try {
      const result = await submitMutation.mutateAsync({
        answers: answersPayload,
        timeSpentSeconds,
      })

      setSubmitResult(result)
      setIsReviewMode(true)
      setShowResultModal(true)
    } catch (e) {
      // Error handled by React Query toast
    }
  }

  // Retake Handler
  const handleRetake = () => {
    setSingleAnswers({})
    setMultiAnswers({})
    setTextAnswers({})
    setFlagged(new Set())
    setIsReviewMode(false)
    setSubmitResult(null)
    setShowResultModal(false)
    setCurrentIndex(0)
    setStartTime(Date.now())
    refetch()
    toast.info('Bắt đầu lượt thi mới!')
  }

  // Exit Request Handler
  const handleSaveExitRequest = () => {
    if (isReviewMode) {
      // Already submitted, can exit safely
      if (quiz?.lessonId) {
        router.push(`/lms/lessons/${quiz.lessonId}`)
      } else if (quiz?.course?.id) {
        router.push(`/lms/courses/${quiz.course.id}`)
      } else {
        router.back()
      }
    } else {
      // Examination in progress: Show Exit Confirmation Alert Dialog
      setShowExitConfirmDialog(true)
    }
  }

  // Confirm Exit & Auto Submit Handler
  const handleConfirmExitAndSubmit = async () => {
    setShowExitConfirmDialog(false)
    await handleSubmit()
  }

  // Loading state
  if (isLoading) {
    return <QuizSkeleton />
  }

  // Error / Not Found state
  if (error || !quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card p-6">
        <div className="flex max-w-md flex-col items-center text-center gap-4 p-8 rounded-2xl border border-border bg-background shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">
              Không thể tải đề thi
            </h2>
            <p className="text-xs text-muted-foreground">
              {(error as any)?.response?.data?.message ||
                'Bài kiểm tra không tồn tại hoặc bạn chưa có quyền truy cập.'}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={() => router.push('/lms/courses')}
          >
            Quay lại danh mục khóa học
          </Button>
        </div>
      </div>
    )
  }

  // Not enrolled guard
  if (!studentStatus?.isEnrolled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card p-6">
        <div className="flex max-w-md flex-col items-center text-center gap-4 p-8 rounded-2xl border border-border bg-background shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">
              Chưa ghi danh khóa học
            </h2>
            <p className="text-xs text-muted-foreground">
              Bạn cần ghi danh vào khóa học <strong>{quiz.course?.title}</strong> trước
              khi làm bài kiểm tra này.
            </p>
          </div>
          <Button
            className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() =>
              router.push(
                quiz.course?.id ? `/lms/courses/${quiz.course.id}` : '/lms/courses'
              )
            }
          >
            Đến trang khóa học để ghi danh
          </Button>
        </div>
      </div>
    )
  }

  // Max attempts exceeded guard (if not passed and no attempts left)
  if (!studentStatus.canAttempt && !studentStatus.isPassed && !isReviewMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card p-6">
        <div className="flex max-w-md flex-col items-center text-center gap-4 p-8 rounded-2xl border border-border bg-background shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">
              Đã hết lượt thi cho phép
            </h2>
            <p className="text-xs text-muted-foreground">
              Bạn đã sử dụng hết {quiz.maxAttempts} lượt thi cho bài kiểm tra này.
              {studentStatus.highestScore !== null && (
                <span className="block mt-1 font-semibold text-foreground">
                  Điểm cao nhất đạt được: {studentStatus.highestScore}% (Điểm yêu cầu:{' '}
                  {quiz.passScore}%)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full pt-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => router.push(quiz.course?.id ? `/lms/courses/${quiz.course.id}` : '/lms/courses')}
            >
              Về khóa học
            </Button>
            {quiz.lessonId && (
              <Button
                variant="default"
                className="flex-1 text-xs"
                onClick={() => router.push(`/lms/lessons/${quiz.lessonId}`)}
              >
                Ôn tập bài học
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* 1. Top Bar */}
      <QuizTopBar
        courseName={quiz.course?.title || 'Khóa học Đào tạo'}
        quizTitle={quiz.title}
        currentQuestion={currentIndex + 1}
        totalQuestions={totalQuestions}
        initialSeconds={
          isReviewMode ? 0 : (quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : 0)
        }
        onSaveExit={handleSaveExitRequest}
        onTimeExpired={() => {
          if (!isReviewMode) {
            toast.warning('⏰ Đã hết thời gian làm bài! Hệ thống đang tự động nộp bài...')
            handleSubmit()
          }
        }}
      />

      {/* 2. Review Mode Notification Banner */}
      {isReviewMode && (
        <div className="pt-20 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-bold text-foreground">
                  Chế độ xem lại kết quả bài thi: Điểm số {submitResult?.score ?? studentStatus.highestScore}%
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Bạn có thể xem đáp án chuẩn và giải thích chi tiết từng câu hỏi dưới đây.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(!submitResult || !submitResult.isPassed) &&
                (studentStatus.remainingAttempts === null ||
                  studentStatus.remainingAttempts > 0) && (
                  <Button
                    size="sm"
                    onClick={handleRetake}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5 font-semibold"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Làm lại bài thi
                  </Button>
                )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResultModal(true)}
                className="text-xs border-border gap-1"
              >
                Xem bảng điểm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Body */}
      <div className={cn('px-4 sm:px-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8', isReviewMode ? 'pt-6' : 'pt-24')}>
        {/* Left Navigator Panel */}
        <div className="w-full lg:w-[280px] shrink-0">
          <QuizNavigatorPanel
            questions={questions}
            currentQuestionId={currentQuestion?.id || ''}
            answers={combinedAnswersMap}
            flagged={flagged}
            isReviewMode={isReviewMode}
            isSubmitting={submitMutation.isPending}
            onNavigate={(index) => setCurrentIndex(index)}
            onToggleFlag={handleToggleFlag}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Center Question View */}
        <main className="flex-1 max-w-2xl mx-auto w-full space-y-6">
          {currentQuestion ? (
            <>
              <QuizQuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                selectedOptionId={
                  singleAnswers[currentQuestion.id] ||
                  currentQuestion.userAnswer?.selectedOptionId ||
                  null
                }
                selectedOptionIds={
                  multiAnswers[currentQuestion.id] ||
                  currentQuestion.userAnswer?.selectedOptionIds ||
                  []
                }
                textAnswer={
                  textAnswers[currentQuestion.id] ||
                  currentQuestion.userAnswer?.textAnswer ||
                  ''
                }
                isReviewMode={isReviewMode}
                onSelectSingle={handleSelectSingle}
                onToggleMulti={handleToggleMulti}
                onTextChange={handleTextChange}
              />

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={isFirst}
                  className={cn(
                    'gap-2 text-xs font-semibold rounded-xl border-border px-4 py-2.5',
                    isFirst && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Câu trước
                </Button>

                {!isLast ? (
                  <Button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))
                    }
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-xs font-semibold rounded-xl px-5 py-2.5 shadow-sm"
                  >
                    Câu tiếp theo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : !isReviewMode ? (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-xs font-bold rounded-xl px-6 py-2.5 shadow-sm"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang nộp bài...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Nộp Bài Thi
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowResultModal(true)}
                    className="gap-2 text-xs font-semibold rounded-xl border-border px-5 py-2.5"
                  >
                    Xem lại bảng điểm
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-border bg-card">
              <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Bài kiểm tra này chưa có câu hỏi nào được thiết lập.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 4. Score Result Modal */}
      <QuizResultModal
        isOpen={showResultModal}
        result={submitResult}
        onClose={() => setShowResultModal(false)}
        onRetake={handleRetake}
        onReview={() => setShowResultModal(false)}
      />

      {/* 5. Exam In-Progress Exit Guard Dialog */}
      <AlertDialog open={showExitConfirmDialog} onOpenChange={setShowExitConfirmDialog}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive font-bold text-base">
              <AlertTriangle className="h-5 w-5" />
              <span>Bài kiểm tra chưa hoàn thành!</span>
            </div>
            <AlertDialogDescription className="text-muted-foreground text-xs space-y-2 pt-2">
              <p>
                Bạn đang trong phiên làm bài kiểm tra. Nếu bạn rời khỏi trang bây giờ,
                hệ thống sẽ <strong>tự động nộp bài</strong> với những câu hỏi đã làm
                và tính điểm cho lượt thi này.
              </p>
              <p className="font-semibold text-foreground">
                Bạn có chắc chắn muốn nộp bài và thoát không?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-card text-foreground hover:bg-muted/50 text-xs">
              Tiếp tục làm bài
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExitAndSubmit}
              className="bg-destructive text-white hover:bg-destructive/90 text-xs font-semibold"
            >
              Nộp bài &amp; Thoát
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
