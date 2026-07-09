import { Star, BookOpen, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { CourseDetail } from '../../types/course.types';

function StarRating({ rating }: { readonly rating: number }) {
  const filled = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            'h-3.5 w-3.5',
            index < filled ? 'fill-amber-400 text-amber-400' : 'fill-t-bg-selected text-t-bg-selected',
          )}
        />
      ))}
    </div>
  );
}

function OverviewTab({ course }: { readonly course: CourseDetail }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-base font-semibold text-t-text-primary">About this course</h3>
        {course.description.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-3 text-sm leading-relaxed text-t-text-secondary">
            {paragraph}
          </p>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold text-t-text-primary">Requirements</h3>
        <ul className="space-y-1.5">
          {course.requirements.map((requirement) => (
            <li key={requirement} className="flex items-start gap-2 text-sm text-t-text-secondary">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-t-text-muted" aria-hidden />
              {requirement}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold text-t-text-primary">Who this course is for</h3>
        <ul className="space-y-1.5">
          {course.targetAudience.map((audience) => (
            <li key={audience} className="flex items-start gap-2 text-sm text-t-text-secondary">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-t-text-muted" aria-hidden />
              {audience}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InstructorTab({ course }: { readonly course: CourseDetail }) {
  const { instructor } = course;
  const initials = instructor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div id="instructor-tab" className="rounded-xl border border-border bg-card p-6">
      <div className="mb-5 flex items-start gap-4">
        <Avatar className="h-16 w-16 shrink-0">
          <AvatarFallback className="bg-t-bg-selected text-lg font-medium text-t-text-secondary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-base font-semibold text-t-text-primary">{instructor.name}</h3>
          <p className="text-sm text-t-text-muted">{instructor.title}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-t-text-muted" aria-hidden />
          <span className="text-sm text-t-text-secondary">
            <span className="font-medium text-t-text-primary">{instructor.coursesCount}</span> courses
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-t-text-muted" aria-hidden />
          <span className="text-sm text-t-text-secondary">
            <span className="font-medium text-t-text-primary">
              {instructor.studentsCount.toLocaleString()}
            </span>{' '}
            students
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
          <span className="text-sm text-t-text-secondary">
            <span className="font-medium text-t-text-primary">{instructor.rating.toFixed(1)}</span>{' '}
            rating
          </span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-t-text-secondary">{instructor.bio}</p>
    </div>
  );
}

function ReviewsTab({ course }: { readonly course: CourseDetail }) {
  const sortedBreakdown = [...course.ratingBreakdown].sort((a, b) => b.stars - a.stars);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-8">
        <div className="text-center">
          <p className="font-display text-5xl font-normal tracking-tight text-t-text-primary">
            {course.rating.toFixed(1)}
          </p>
          <div className="my-1.5 flex justify-center">
            <StarRating rating={course.rating} />
          </div>
          <p className="text-xs text-t-text-muted">Course rating</p>
        </div>

        <div className="flex-1 space-y-2">
          {sortedBreakdown.map((breakdown) => (
            <div key={breakdown.stars} className="flex items-center gap-3">
              <div className="flex w-8 items-center justify-end gap-0.5">
                <span className="text-xs text-t-text-muted">{breakdown.stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
              </div>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-t-bg-selected"
                role="progressbar"
                aria-valuenow={breakdown.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${breakdown.stars} stars: ${breakdown.percentage}%`}
              >
                <div
                  className="h-full rounded-full bg-t-accent transition-all"
                  style={{ width: `${breakdown.percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-t-text-muted">
                {breakdown.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {course.reviews.map((review) => {
          const reviewInitials = review.reviewerName.slice(0, 2).toUpperCase();
          return (
            <div key={review.id} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-t-bg-selected text-xs font-medium text-t-text-secondary">
                    {reviewInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-t-text-primary">{review.reviewerName}</p>
                  <p className="text-xs text-t-text-muted">{review.date}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm leading-relaxed text-t-text-secondary">{review.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CourseDetailTabsProps {
  readonly course: CourseDetail;
}

export function CourseDetailTabs({ course }: CourseDetailTabsProps) {
  return (
    <div className="mb-8">
      <Tabs defaultValue="overview" className="flex-col">
        <TabsList className="mb-6 h-auto w-fit rounded-lg bg-t-bg-selected p-1">
          <TabsTrigger
            value="overview"
            className="rounded-md px-4 py-2 text-sm font-medium text-t-text-muted data-[state=active]:bg-t-bg-surface data-[state=active]:text-t-text-primary data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="instructor"
            className="rounded-md px-4 py-2 text-sm font-medium text-t-text-muted data-[state=active]:bg-t-bg-surface data-[state=active]:text-t-text-primary data-[state=active]:shadow-sm"
          >
            Instructor
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-md px-4 py-2 text-sm font-medium text-t-text-muted data-[state=active]:bg-t-bg-surface data-[state=active]:text-t-text-primary data-[state=active]:shadow-sm"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab course={course} />
        </TabsContent>
        <TabsContent value="instructor">
          <InstructorTab course={course} />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsTab course={course} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
