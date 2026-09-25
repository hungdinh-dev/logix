'use client'

import {
  CheckCircle2,
  XCircle,
  CheckSquare,
  Sparkles,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { QuizQuestionData, QuizOptionData } from '@/features/lms/types/quiz.types'

/* ── Option states ── */
type OptionState = 'unselected' | 'selected' | 'correct' | 'wrong'

function getOptionState(
  option: QuizOptionData,
  isSelected: boolean,
  isReviewMode: boolean
): OptionState {
  if (!isReviewMode) {
    return isSelected ? 'selected' : 'unselected'
  }
  if (option.isCorrect) return 'correct'
  if (isSelected && !option.isCorrect) return 'wrong'
  return 'unselected'
}

function OptionCard({
  option,
  state,
  isMultiChoice,
  disabled,
  onClick,
}: {
  option: QuizOptionData
  state: OptionState
  isMultiChoice?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group flex w-full cursor-pointer items-center gap-3.5 rounded-xl border-2 p-3.5 sm:p-4 text-left transition-all duration-150',
        state === 'unselected' &&
          'border-border bg-card hover:bg-muted/50 hover:border-primary/40',
        state === 'selected' &&
          'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm',
        state === 'correct' &&
          'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/30 cursor-default',
        state === 'wrong' &&
          'border-destructive bg-destructive/10 dark:bg-destructive/20 cursor-default',
        disabled && 'cursor-default'
      )}
    >
      {/* Letter / Check indicator */}
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
          state === 'unselected' &&
            'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary',
          state === 'selected' && 'bg-primary text-primary-foreground font-black',
          state === 'correct' && 'bg-emerald-600 text-white font-black',
          state === 'wrong' && 'bg-destructive text-white font-black'
        )}
      >
        {isMultiChoice ? (
          state === 'selected' || state === 'correct' ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            option.letter
          )
        ) : (
          option.letter
        )}
      </span>

      {/* Option Text */}
      <span
        className={cn(
          'flex-1 text-sm leading-relaxed',
          state === 'unselected' && 'text-foreground',
          state === 'selected' && 'font-semibold text-primary dark:text-primary-foreground',
          state === 'correct' &&
            'font-semibold text-emerald-700 dark:text-emerald-300',
          state === 'wrong' && 'font-semibold text-destructive'
        )}
      >
        {option.optionText}
      </span>

      {/* Review Icon Feedback */}
      {state === 'correct' && (
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline">Đáp án đúng</span>
        </div>
      )}
      {state === 'wrong' && (
        <div className="flex items-center gap-1 text-xs font-semibold text-destructive">
          <XCircle className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline">Bạn đã chọn sai</span>
        </div>
      )}
    </button>
  )
}

/* ── Main Card Props ── */
interface QuizQuestionCardProps {
  readonly question: QuizQuestionData
  readonly questionNumber: number
  readonly selectedOptionId?: string | null
  readonly selectedOptionIds?: string[]
  readonly textAnswer?: string
  readonly isReviewMode?: boolean
  readonly onSelectSingle: (optionId: string) => void
  readonly onToggleMulti: (optionId: string) => void
  readonly onTextChange: (text: string) => void
}

const TYPE_LABEL_MAP: Record<string, string> = {
  SINGLE_CHOICE: 'Trắc nghiệm 1 đáp án',
  MULTIPLE_CHOICE: 'Trắc nghiệm nhiều đáp án',
  TRUE_FALSE: 'Đúng / Sai',
  SHORT_ANSWER: 'Câu trả lời ngắn',
  'single-choice': 'Trắc nghiệm 1 đáp án',
  'multiple-choice': 'Trắc nghiệm nhiều đáp án',
  'true-false': 'Đúng / Sai',
  'text-input': 'Câu trả lời ngắn',
}

export function QuizQuestionCard({
  question,
  questionNumber,
  selectedOptionId,
  selectedOptionIds = [],
  textAnswer = '',
  isReviewMode = false,
  onSelectSingle,
  onToggleMulti,
  onTextChange,
}: QuizQuestionCardProps) {
  const isSingle =
    question.questionType === 'SINGLE_CHOICE' ||
    question.questionType === 'TRUE_FALSE' ||
    (question.questionType as string) === 'single-choice' ||
    (question.questionType as string) === 'true-false'

  const isMulti =
    question.questionType === 'MULTIPLE_CHOICE' ||
    (question.questionType as string) === 'multiple-choice'

  const isShort =
    question.questionType === 'SHORT_ANSWER' ||
    (question.questionType as string) === 'text-input'

  const typeLabel = TYPE_LABEL_MAP[question.questionType] || 'Trắc nghiệm'
  const options: QuizOptionData[] = question.options || []

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
            Q{questionNumber}
          </span>
          <Badge variant="outline" className="text-xs font-medium">
            {typeLabel}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            {question.points} điểm
          </span>
        </div>

        {/* Review Mode Score Badge */}
        {isReviewMode && (
          <div className="flex items-center gap-2">
            {question.isCorrect ? (
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 text-xs font-bold gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />+ {question.points} điểm
              </Badge>
            ) : (
              <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-xs font-bold gap-1">
                <XCircle className="h-3.5 w-3.5" />0 / {question.points} điểm
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <h2 className="text-base sm:text-lg font-bold leading-relaxed text-foreground">
          {question.questionText}
        </h2>
        {isMulti && !isReviewMode && (
          <p className="text-xs text-muted-foreground italic">
            * Câu hỏi có thể có nhiều hơn một đáp án đúng. Vui lòng chọn tất cả đáp án phù hợp.
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {isSingle && (
          <div className="space-y-2.5">
            {options.map((opt: QuizOptionData) => {
              const isSelected = selectedOptionId === opt.id
              return (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  state={getOptionState(opt, isSelected, isReviewMode)}
                  disabled={isReviewMode}
                  onClick={() => !isReviewMode && onSelectSingle(opt.id)}
                />
              )
            })}
          </div>
        )}

        {isMulti && (
          <div className="space-y-2.5">
            {options.map((opt: QuizOptionData) => {
              const isSelected = selectedOptionIds.includes(opt.id)
              return (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  isMultiChoice
                  state={getOptionState(opt, isSelected, isReviewMode)}
                  disabled={isReviewMode}
                  onClick={() => !isReviewMode && onToggleMulti(opt.id)}
                />
              )
            })}
          </div>
        )}

        {isShort && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground">
              Nhập câu trả lời của bạn:
            </label>
            <Textarea
              value={textAnswer}
              onChange={(e) => onTextChange(e.target.value)}
              disabled={isReviewMode}
              rows={3}
              placeholder="Nhập nội dung trả lời tại đây..."
              className="resize-none rounded-xl border-border bg-card text-sm text-foreground focus:border-primary focus-visible:ring-primary/20"
            />
            {isReviewMode && (
              <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs space-y-1">
                <span className="font-semibold text-muted-foreground">
                  Đáp án chuẩn mẫu:
                </span>
                <p className="font-medium text-foreground">
                  {options
                    .filter((o: QuizOptionData) => o.isCorrect)
                    .map((o: QuizOptionData) => o.optionText)
                    .join(' / ') || 'Theo quy chuẩn đào tạo'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explanation Box (During Review Mode) */}
      {isReviewMode && question.explanation && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/30 dark:bg-primary/10 space-y-1.5 animate-in fade-in-50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Giải thích đáp án chi tiết</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
