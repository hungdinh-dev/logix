import { Clock, Star, GraduationCap, CheckCircle2, Globe } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { CourseDetail } from '../../types/course.types';

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
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/lms/courses"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Danh mục
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/lms/courses"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {course.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm text-foreground font-medium">{course.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {course.title}
      </h1>

      <p className="mb-5 line-clamp-3 text-base leading-relaxed text-muted-foreground">
        {course.subtitle}
      </p>

      {/* 5-Column Metric / Stat Strip (Image 2 reference) */}
      {/* <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm"> */}
      {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:divide-x md:divide-border/60"> */}
      <div className='mt-6'>
        <div className='flex gap-x-5'>
          {/* Stat 1: Rating */}
          <div className="flex flex-col gap-1 md:px-3 first:md:pl-0">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
              <span className="text-base font-semibold">{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {course.reviewCount.toLocaleString()} Đánh giá
            </span>
          </div>

          {/* Stat 2: Enrolled */}
          <div className="flex flex-col gap-1 md:px-3">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <GraduationCap className="h-4 w-4 text-primary shrink-0" />
              <span className="text-base font-semibold">{course.enrolledCount.toLocaleString()}</span>
            </div>
            <span className="text-xs text-muted-foreground">Học viên tham gia</span>
          </div>

          {/* Stat 3: Duration */}
          {/* <div className="flex flex-col gap-1 md:px-3">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Clock className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-base font-semibold">{course.duration}</span>
            </div>
            <span className="text-xs text-muted-foreground">Tổng thời lượng</span>
          </div> */}

          {/* Stat 4: Last Updated */}
          <div className="flex flex-col gap-1 md:px-3">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-base font-semibold">{course.lastUpdated}</span>
            </div>
            <span className="text-xs text-muted-foreground">Lần cập nhật cuối</span>
          </div>

          {/* Stat 5: Language & Level */}
          <div className="flex flex-col gap-1 md:px-3 last:md:pr-0">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <span className="text-base font-semibold">{course.language}</span>
            </div>
            <span className="text-xs text-muted-foreground">Cấp độ {course.level}</span>
          </div>
        </div>
      </div>

      {/* Instructor Profile Header */}
      <div className="flex items-center justify-start gap-3 w-full mt-6">
        <Avatar className="h-10 w-10 shrink-0 border border-border">
          <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{course.instructor.name}</p>
          <p className="text-xs text-muted-foreground">{course.instructor.title}</p>
        </div>
        <a
          href="#instructor-tab"
          className="shrink-0 text-xs font-medium text-primary transition-colors hover:underline ml-2"
        >
          Xem hồ sơ giảng viên →
        </a>
      </div>
    </div>
  );
}
