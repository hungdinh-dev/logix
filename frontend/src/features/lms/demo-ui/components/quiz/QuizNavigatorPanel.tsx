import { Flag, AlertTriangle } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { QuizQuestion } from '../../types/quiz.types';

type NavStatus = 'answered' | 'current' | 'flagged' | 'unanswered';

function getNavStatus(
  question: QuizQuestion,
  currentId: string,
  answers: Record<string, string>,
  flagged: Set<string>,
): NavStatus {
  if (question.id === currentId) return 'current';
  if (flagged.has(question.id)) return 'flagged';
  if (answers[question.id]) return 'answered';
  return 'unanswered';
}

interface QuizNavigatorPanelProps {
  readonly questions: readonly QuizQuestion[];
  readonly currentQuestionId: string;
  readonly answers: Record<string, string>;
  readonly flagged: Set<string>;
  readonly onNavigate: (index: number) => void;
  readonly onToggleFlag: () => void;
  readonly onSubmit: () => void;
}

export function QuizNavigatorPanel({
  questions,
  currentQuestionId,
  answers,
  flagged,
  onNavigate,
  onToggleFlag,
  onSubmit,
}: QuizNavigatorPanelProps) {
  const currentFlagged = flagged.has(currentQuestionId);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="fixed left-6 top-[88px] z-30 w-[268px] rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Question Navigator
      </p>

      {/* Grid */}
      <div className="mb-4 grid grid-cols-4 gap-1.5">
        {questions.map((q, i) => {
          const status = getNavStatus(q, currentQuestionId, answers, flagged);

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onNavigate(i)}
              className={cn(
                'relative flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-semibold transition-all',
                status === 'answered' && 'bg-primary text-white',
                status === 'current' && 'bg-card text-primary ring-2 ring-primary',
                status === 'flagged' && 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
                status === 'unanswered' && 'bg-muted text-muted-foreground',
              )}
              aria-label={`Go to question ${q.number}`}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              {q.number}
              {status === 'flagged' && (
                <Flag className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 fill-amber-700 text-amber-700 dark:fill-amber-400 dark:text-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mb-4 space-y-1">
        {[
          { color: 'bg-primary', label: `Answered (${answeredCount})` },
          { color: 'bg-amber-500/15 ring-1 ring-amber-500/50', label: `Flagged (${flagged.size})` },
          { color: 'bg-muted', label: `Unanswered (${unansweredCount})` },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={cn('h-2.5 w-2.5 rounded-sm', color)} />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Flag toggle */}
      <button
        type="button"
        onClick={onToggleFlag}
        className={cn(
          'mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
          currentFlagged
            ? 'border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
            : 'border-border bg-card text-muted-foreground hover:bg-muted/50',
        )}
      >
        <Flag className={cn('h-3.5 w-3.5', currentFlagged && 'fill-amber-700 dark:fill-amber-400')} />
        {currentFlagged ? 'Unflag Question' : 'Flag for Review'}
      </button>

      {/* Submit */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-destructive px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-destructive/80"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Submit Quiz
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Submit quiz?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              You have answered {answeredCount} of {questions.length} questions.
              {unansweredCount > 0 && (
                <span className="block mt-1 font-medium text-destructive">
                  {unansweredCount} question{unansweredCount !== 1 ? 's' : ''} unanswered.
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-card text-foreground hover:bg-muted/50">
              Continue Reviewing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onSubmit}
              className="bg-destructive text-white hover:bg-destructive/80"
            >
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
