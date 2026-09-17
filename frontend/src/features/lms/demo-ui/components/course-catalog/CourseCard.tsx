import { Award, Clock, Star, Users, CheckCircle2, AlertCircle, BookOpen, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { BackendCourse } from '../../types/course.types';

interface CourseCardProps {
  readonly course: BackendCourse;
  readonly isEnrolled?: boolean;
  readonly progressPercent?: number;
  readonly onEnroll?: (courseId: string) => void;
  readonly isEnrolling?: boolean;
}

export function CourseCard({ course, isEnrolled, progressPercent, onEnroll, isEnrolling }: CourseCardProps) {
  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const enrollmentCount = course._count?.enrollments || 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40">
      {/* Thumbnail */}
      <div className="relative flex h-[160px] flex-shrink-0 items-center justify-center bg-muted/40 overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <BookOpen className="h-12 w-12 opacity-60" />
            <span className="text-xs font-medium">{course.code}</span>
          </div>
        )}

        {/* Category Badge */}
        {course.category && (
          <span className="absolute left-3 top-3 rounded-md bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-foreground border border-border/60 shadow-sm">
            {course.category.name}
          </span>
        )}

        {/* Enrolled Badge or Mandatory / Optional Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {isEnrolled ? (
            <Badge className="bg-emerald-600 text-white flex items-center gap-1 shadow-sm text-[11px] font-bold">
              <CheckCircle2 className="h-3 w-3" />
              Đã ghi danh
            </Badge>
          ) : course.isMandatory ? (
            <Badge variant="destructive" className="flex items-center gap-1 shadow-sm text-[11px] font-bold">
              <AlertCircle className="h-3 w-3" />
              Bắt buộc
            </Badge>
          ) : (
            <Badge variant="secondary" className="shadow-sm text-[11px]">
              Tùy chọn
            </Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono font-medium">{course.code}</span>
            <span className="capitalize">{course.courseType}</span>
          </div>

          <Link href={`/lms/courses/${course.id}`} className="group">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </h3>
          </Link>

          {course.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {course.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {/* Metadata chips (LMS-011 & LMS-012) */}
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/30 p-2 text-center text-xs">
            <div>
              <p className="text-[10px] text-muted-foreground">Bài học</p>
              <p className="font-semibold text-foreground">{totalLessons} bài</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Thời hạn</p>
              <p className="font-semibold text-foreground">{course.durationDays || 30} ngày</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Chế độ học</p>
              <p className="font-semibold text-foreground">
                {course.progressionMode === 'FREE'
                  ? '🔓 Tự do'
                  : course.progressionMode === 'LINEAR_MODULE'
                    ? '📦 Theo chương'
                    : '🔗 Theo bài'}
              </p>
            </div>
          </div>

          {/* Enrolled Progress Bar if available */}
          {isEnrolled && progressPercent !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Tiến độ học</span>
                <span className="font-semibold text-primary">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <Separator className="bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              <Link href={`/lms/courses/${course.id}`}>Chi tiết</Link>
            </Button>
            {isEnrolled ? (
              <Button
                asChild
                size="sm"
                className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                <Link href={`/lms/courses/${course.id}`}>
                  <PlayCircle className="h-3.5 w-3.5" />
                  Học tiếp
                </Link>
              </Button>
            ) : onEnroll ? (
              <Button
                size="sm"
                disabled={isEnrolling}
                onClick={() => onEnroll(course.id)}
                className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                {isEnrolling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Ghi danh ngay
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
