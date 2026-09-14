import { cn } from '@/lib/utils';
import type { BackendCategory } from '../../types/course.types';

interface CategoryPillTabsProps {
  readonly value: string;
  readonly categories?: BackendCategory[];
  readonly onValueChange: (value: string) => void;
}

export function CategoryPillTabs({ value, categories = [], onValueChange }: CategoryPillTabsProps) {
  const allTabs = [
    { id: 'All', name: 'Tất cả' },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none' }}
      role="tablist"
      aria-label="Course categories"
    >
      {allTabs.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={value === cat.id}
          onClick={() => onValueChange(cat.id)}
          className={cn(
            'flex-shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all shadow-sm',
            value === cat.id
              ? 'border-primary bg-primary text-primary-foreground font-semibold shadow'
              : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
