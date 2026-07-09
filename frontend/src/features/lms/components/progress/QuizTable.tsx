import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { QuizResult, QuizStatus } from '../../types/progress.types';
import { cn } from '@/lib/utils';

function ScoreBadge({ score }: { score: number }) {
  const badgeClass =
    score >= 80
      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
      : score >= 60
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      : 'bg-red-500/10 text-red-600 dark:text-red-400';

  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", badgeClass)}>
      {score}%
    </span>
  );
}

const STATUS_STYLES: Record<QuizStatus, { className: string; label: string }> = {
  passed: { className: 'bg-green-500/10 text-green-600 dark:text-green-400', label: 'Passed' },
  failed: { className: 'bg-red-500/10 text-red-600 dark:text-red-400', label: 'Failed' },
  retake: { className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Retake Available' },
};

function StatusPill({ status }: { status: QuizStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", s.className)}>
      {s.label}
    </span>
  );
}

interface QuizTableProps {
  readonly results: readonly QuizResult[];
}

export function QuizTable({ results }: QuizTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-foreground">Quiz Performance</h2>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-muted-foreground">Course</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Quiz Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Score</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Date</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.id} className="border-border hover:bg-muted/40">
                <TableCell className="text-xs font-medium text-foreground">{row.courseName}</TableCell>
                <TableCell className="text-xs text-foreground">{row.quizName}</TableCell>
                <TableCell><ScoreBadge score={row.score} /></TableCell>
                <TableCell><StatusPill status={row.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{row.date}</TableCell>
                <TableCell>
                  <a
                    href="#"
                    className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Review
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
