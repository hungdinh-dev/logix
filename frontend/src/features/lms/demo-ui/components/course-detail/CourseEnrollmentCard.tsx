'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Wifi, Award, RefreshCw, Share2, Check, Heart, BookOpen, PlayCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { CourseDetail } from '../../types/course.types';

const COURSE_FEATURES = [
  { icon: Clock, label: 'Truy cập không giới hạn thời gian' },
  { icon: Wifi, label: 'Học trực tuyến mọi lúc mọi nơi' },
  { icon: Award, label: 'Cấp chứng chỉ hoàn thành chuẩn Ba Hưng' },
  { icon: RefreshCw, label: 'Nội dung cập nhật quy chuẩn SOP liên tục' },
] as const;

interface CourseEnrollmentCardProps {
  readonly course: CourseDetail;
  readonly isEnrolled?: boolean;
  readonly completionPercentage?: number;
  readonly nextLessonId?: string | null;
  readonly onEnroll?: () => Promise<void>;
  readonly isEnrolling?: boolean;
}

export function CourseEnrollmentCard({
  course,
  isEnrolled,
  completionPercentage = 0,
  nextLessonId,
  onEnroll,
  isEnrolling,
}: CourseEnrollmentCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const firstLessonId = course.sections[0]?.lessons[0]?.id;
  const targetLessonId = nextLessonId || firstLessonId;
  const isCompletedCourse = completionPercentage >= 100;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md">
      {/* Thumbnail */}
      <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted/40 relative">
        <div className="flex h-full items-center justify-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/60" aria-hidden />
        </div>
        {isEnrolled && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Đã tham gia
            </Badge>
          </div>
        )}
      </div>

      {/* Status or Tag */}
      <div className="mb-4">
        {isEnrolled ? (
          <div className="space-y-2 rounded-lg bg-muted/30 p-3 border border-border/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Tiến độ của bạn</span>
              <span className="font-bold text-primary font-mono">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-[11px] text-muted-foreground">
              {isCompletedCourse
                ? '🎉 Bạn đã hoàn thành toàn bộ khóa học này!'
                : 'Tiếp tục học để hoàn thành và nhận chứng chỉ.'}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Miễn phí Đào tạo</span>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Nội bộ Ba Hưng
            </Badge>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      {isEnrolled ? (
        targetLessonId ? (
          <Button
            asChild
            className="mb-2 h-11 w-full rounded-md bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm"
          >
            <Link href={`/lms/lessons/${targetLessonId}`} aria-label="Tiếp tục bài học">
              <PlayCircle className="h-4 w-4" />
              {isCompletedCourse ? 'Xem lại bài học' : 'Tiếp tục bài học'}
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            className="mb-2 h-11 w-full rounded-md bg-primary text-base font-medium text-primary-foreground opacity-70"
          >
            Chưa có bài học nào
          </Button>
        )
      ) : onEnroll ? (
        <Button
          onClick={onEnroll}
          disabled={isEnrolling}
          className="mb-2 h-11 w-full rounded-md bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 gap-2 shadow-sm"
        >
          {isEnrolling ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang ghi danh...
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4" />
              Ghi danh ngay
            </>
          )}
        </Button>
      ) : null}

      {/* Wishlist / Save */}
      <Button
        variant="outline"
        className="mb-5 h-10 w-full rounded-md border-border text-foreground hover:border-primary hover:text-primary transition-colors text-xs"
        onClick={() => setWishlisted((prev) => !prev)}
        aria-label={wishlisted ? 'Đã lưu vào danh sách yêu thích' : 'Lưu vào danh sách'}
      >
        <Heart
          className={
            wishlisted ? 'mr-2 h-4 w-4 fill-primary text-primary' : 'mr-2 h-4 w-4'
          }
          aria-hidden
        />
        {wishlisted ? 'Đã lưu vào mục yêu thích' : 'Lưu vào mục yêu thích'}
      </Button>

      {/* Features */}
      <ul className="mb-5 space-y-2.5">
        {COURSE_FEATURES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-xs text-muted-foreground">{label}</span>
          </li>
        ))}
      </ul>

      {/* Share */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          <span>Chia sẻ khóa học</span>
        </div>
        <button
          onClick={handleShare}
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
          aria-label="Copy course link to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
              <span className="text-emerald-600 font-semibold">Đã sao chép</span>
            </>
          ) : (
            'Sao chép link'
          )}
        </button>
      </div>
    </div>
  );
}
