import { CheckCircle } from 'lucide-react';

interface WhatYouLearnCardProps {
  readonly outcomes: readonly string[];
}

export function WhatYouLearnCard({ outcomes }: WhatYouLearnCardProps) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-t-text-primary">What You'll Learn</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {outcomes.map((outcome) => (
          <li key={outcome} className="flex items-start gap-2.5">
            <CheckCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
              aria-hidden
            />
            <span className="text-sm leading-snug text-t-text-secondary">{outcome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
