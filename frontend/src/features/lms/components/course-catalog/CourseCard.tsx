import { Award, ShieldCheck, Code2, MessageCircle, Rocket, Clock, Star, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Course, CourseCategory } from '../../types/course.types';

const CATEGORY_ICONS: Record<CourseCategory, LucideIcon> = {
  Leadership: Award,
  Compliance: ShieldCheck,
  Technical: Code2,
  'Soft Skills': MessageCircle,
  Onboarding: Rocket,
};

interface StarRatingProps {
  readonly rating: number;
}

function StarRating({ rating }: StarRatingProps) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            'h-3 w-3',
            index < filled
              ? 'fill-amber-400 text-amber-400'
              : 'fill-t-bg-selected text-t-bg-selected',
          )}
        />
      ))}
    </div>
  );
}

interface CourseCardProps {
  readonly course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { title, category, instructor, duration, enrolledCount, rating, reviewCount, enrolled } =
    course;
  const CategoryIcon = CATEGORY_ICONS[category];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-t-bg-surface shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative flex h-[180px] flex-shrink-0 items-center justify-center bg-t-bg-selected">
        <CategoryIcon className="h-12 w-12 text-t-text-muted" aria-hidden />
        <span className="absolute right-3 top-3 rounded-full bg-t-accent px-2 py-0.5 text-xs font-medium text-white">
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-t-text-primary">
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 flex-shrink-0 rounded-full bg-t-bg-selected"
            aria-hidden
          />
          <span className="text-xs text-t-text-muted">{instructor.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-t-text-muted" aria-hidden />
            <span className="text-xs text-t-text-muted">{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-t-text-muted" aria-hidden />
            <span className="text-xs text-t-text-muted">{enrolledCount.toLocaleString()} enrolled</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-xs text-t-text-muted">
            {rating.toFixed(1)} ({reviewCount.toLocaleString()})
          </span>
        </div>

        <Separator className="bg-t-border" />

        {enrolled ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-md border-t-accent text-t-accent hover:bg-t-accent hover:text-white"
          >
            Resume
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full rounded-md bg-t-accent text-white hover:bg-t-accent-hover"
          >
            Enroll Now
          </Button>
        )}
      </div>
    </article>
  );
}
