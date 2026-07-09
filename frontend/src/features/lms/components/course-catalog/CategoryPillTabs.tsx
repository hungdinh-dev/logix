import { cn } from '@/lib/utils';
import { COURSE_CATEGORIES } from '../../types/course.types';
import type { CategoryFilter } from '../../types/course.types';

interface CategoryPillTabsProps {
  readonly value: CategoryFilter;
  readonly onValueChange: (value: CategoryFilter) => void;
}

export function CategoryPillTabs({ value, onValueChange }: CategoryPillTabsProps) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none' }}
      role="tablist"
      aria-label="Course categories"
    >
      {COURSE_CATEGORIES.map((category) => (
        <button
          key={category}
          role="tab"
          aria-selected={value === category}
          onClick={() => onValueChange(category)}
          className={cn(
            'flex-shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            value === category
              ? 'border-transparent bg-t-accent text-white'
              : 'border-t-border bg-t-bg-surface text-t-text-secondary hover:bg-t-bg-hover hover:text-t-text-primary',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
