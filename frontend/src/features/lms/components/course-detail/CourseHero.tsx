import { Clock, Users, Star } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { CourseDetail, CourseLevel } from '../../types/course.types';

const LEVEL_STYLES: Record<CourseLevel, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

function StarRating({ rating }: { readonly rating: number }) {
  const filled = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            'h-4 w-4',
            index < filled ? 'fill-amber-400 text-amber-400' : 'fill-t-bg-selected text-t-bg-selected',
          )}
        />
      ))}
    </div>
  );
}

interface CourseHeroProps {
  readonly course: CourseDetail;
}

export function CourseHero({ course }: CourseHeroProps) {
  const initials = course.instructor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mb-8">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/lms/explore"
              className="text-sm text-t-text-muted transition-colors hover:text-t-text-primary"
            >
              Catalog
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/lms/explore"
              className="text-sm text-t-text-muted transition-colors hover:text-t-text-primary"
            >
              {course.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm text-t-text-secondary">{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-3 font-display text-3xl font-normal tracking-tight text-t-text-primary">
        {course.title}
      </h1>

      <p className="mb-5 line-clamp-3 text-base leading-relaxed text-t-text-secondary">
        {course.subtitle}
      </p>

      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-1.5">
          <StarRating rating={course.rating} />
          <span className="text-sm font-medium text-amber-600">{course.rating.toFixed(1)}</span>
          <span className="text-sm text-t-text-muted">
            ({course.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-t-text-muted">
          <Users className="h-4 w-4" aria-hidden />
          <span>{course.enrolledCount.toLocaleString()} enrolled</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-t-text-muted">
          <Clock className="h-4 w-4" aria-hidden />
          <span>{course.duration}</span>
        </div>

        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-medium',
            LEVEL_STYLES[course.level],
          )}
        >
          {course.level}
        </span>

        <span className="text-sm text-t-text-muted">Updated {course.lastUpdated}</span>
        <span className="text-sm text-t-text-muted">{course.language}</span>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-t-bg-selected text-sm font-medium text-t-text-secondary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-medium text-t-text-primary">{course.instructor.name}</p>
          <p className="text-xs text-t-text-muted">{course.instructor.title}</p>
        </div>
        <a
          href="#instructor-tab"
          className="shrink-0 text-sm font-medium text-t-accent transition-colors hover:text-t-accent-hover"
        >
          View profile
        </a>
      </div>
    </div>
  );
}
