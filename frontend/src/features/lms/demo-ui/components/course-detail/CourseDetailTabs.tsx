import { Star, BookOpen, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
        <h3 className="mb-3 text-base font-semibold text-foreground">Giới thiệu khóa học</h3>
        {course.description.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-3 text-sm leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span>Quy chế & Tiêu chuẩn hoàn thành</span>
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>Hoàn thành 100% thời lượng các bài giảng (Video/Tài liệu) trong giáo trình.</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>Đạt điểm chuẩn bài kiểm tra trắc nghiệm đánh giá năng lực cuối khóa.</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <span>Kết quả học tập được ghi nhận trực tiếp vào hồ sơ nhân sự trên hệ thống LogiX.</span>
          </li>
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
    <div id="instructor-tab" className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-4">
        <Avatar className="h-16 w-16 shrink-0 border border-border">
          <AvatarFallback className="bg-muted text-lg font-semibold text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-base font-semibold text-foreground">{instructor.name}</h3>
          <p className="text-sm text-muted-foreground">{instructor.title}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{instructor.coursesCount}</span> khóa học
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {instructor.studentsCount.toLocaleString()}
            </span>{' '}
            học viên
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{instructor.rating.toFixed(1)}</span>{' '}
            đánh giá
          </span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{instructor.bio}</p>
    </div>
  );
}

function ReviewsTab({ course }: { readonly course: CourseDetail }) {
  const sortedBreakdown = [...course.ratingBreakdown].sort((a, b) => b.stars - a.stars);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="text-center shrink-0">
          <p className="font-display text-5xl font-bold tracking-tight text-foreground">
            {course.rating.toFixed(1)}
          </p>
          <div className="my-1.5 flex justify-center">
            <StarRating rating={course.rating} />
          </div>
          <p className="text-xs text-muted-foreground">Đánh giá trung bình</p>
        </div>

        <div className="flex-1 space-y-2">
          {sortedBreakdown.map((breakdown) => (
            <div key={breakdown.stars} className="flex items-center gap-3">
              <div className="flex w-8 items-center justify-end gap-0.5">
                <span className="text-xs text-muted-foreground">{breakdown.stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
              </div>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={breakdown.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${breakdown.stars} stars: ${breakdown.percentage}%`}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${breakdown.percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-muted-foreground">
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
            <div key={review.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <Avatar className="h-9 w-9 shrink-0 border border-border">
                  <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                    {reviewInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{review.reviewerName}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
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

  const primaryCss = `relative rounded-none border-b-2 border-transparent px-1 pb-3 pt-2 text-sm font-medium text-muted-foreground 
                      hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground 
                      data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all cursor-pointer -mb-px`

  return (
    <Tabs defaultValue="overview" className="w-full">
      {/* Minimalist Underline Tab Bar (Image 4 reference) */}
      <TabsList className="h-9 mb-6 w-full justify-start rounded-none bg-transparent p-0">
        <TabsTrigger
          value="overview"
          className={primaryCss}
        >
          Tổng quan
        </TabsTrigger>
        <TabsTrigger
          value="instructor"
          className={primaryCss}
        >
          Giảng viên
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className={primaryCss}
        >
          Đánh giá ({course.reviews.length})
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
  );
}
