import { useState } from 'react';
import { Clock, Wifi, Award, RefreshCw, Share2, Check, Heart, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { CourseDetail } from '../../types/course.types';

const COURSE_FEATURES = [
  { icon: Clock, label: 'Full lifetime access' },
  { icon: Wifi, label: 'Online — learn at your pace' },
  { icon: Award, label: 'Certificate of completion' },
  { icon: RefreshCw, label: 'Content updated regularly' },
] as const;

interface CourseEnrollmentCardProps {
  readonly course: CourseDetail;
}

export function CourseEnrollmentCard({ course }: CourseEnrollmentCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-md">
      {/* Thumbnail */}
      <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-t-bg-selected">
        <div className="flex h-full items-center justify-center">
          <BookOpen className="h-12 w-12 text-t-text-muted" aria-hidden />
        </div>
      </div>

      {/* Price */}
      <div className="mb-4 flex items-center gap-2">
        {course.price ? (
          <>
            <span className="text-2xl font-bold text-t-text-primary">
              ${course.price.toLocaleString()}
            </span>
            {course.isSponsored && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Company Sponsored
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-t-text-primary">Free</span>
            {course.isSponsored && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Company Sponsored
              </span>
            )}
          </div>
        )}
      </div>

      {/* Enroll */}
      <Button
        className="mb-2 h-11 w-full rounded-md bg-t-accent text-base font-medium text-white hover:bg-t-accent-hover"
        onClick={() => router.push(`/lms/lessons/${course.id}`)}
        aria-label={`Enroll in ${course.title}`}
      >
        Start Learning
      </Button>

      {/* Wishlist */}
      <Button
        variant="outline"
        className="mb-5 h-11 w-full rounded-md border-t-border text-t-text-secondary hover:border-t-accent hover:text-t-accent"
        onClick={() => setWishlisted((prev) => !prev)}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={
            wishlisted ? 'mr-2 h-4 w-4 fill-t-accent text-t-accent' : 'mr-2 h-4 w-4'
          }
          aria-hidden
        />
        {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
      </Button>

      {/* Features */}
      <ul className="mb-5 space-y-2.5">
        {COURSE_FEATURES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="text-sm text-t-text-secondary">{label}</span>
          </li>
        ))}
      </ul>

      {/* Share */}
      <div className="flex items-center justify-between border-t border-t-border pt-4">
        <div className="flex items-center gap-2 text-sm text-t-text-muted">
          <Share2 className="h-4 w-4" aria-hidden />
          <span>Share course</span>
        </div>
        <button
          onClick={handleShare}
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-t-accent transition-colors hover:bg-t-bg-hover"
          aria-label="Copy course link to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden />
              Copied!
            </>
          ) : (
            'Copy link'
          )}
        </button>
      </div>
    </div>
  );
}
