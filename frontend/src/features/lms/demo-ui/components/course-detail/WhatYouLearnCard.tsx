import { CheckCircle } from 'lucide-react';

interface WhatYouLearnCardProps {
  readonly outcomes: readonly string[];
}

export function WhatYouLearnCard({ outcomes }: WhatYouLearnCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Card Header Bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold text-foreground">Đạt được sau khóa học</h2>
        <span className="text-xs text-muted-foreground font-medium">{outcomes.length} mục tiêu</span>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-2.5">
              <CheckCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                aria-hidden
              />
              <span className="text-sm leading-snug text-muted-foreground">{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
