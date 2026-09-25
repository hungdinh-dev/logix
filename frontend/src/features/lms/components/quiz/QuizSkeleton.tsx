import { Skeleton } from '@/components/ui/skeleton'

export function QuizSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar skeleton */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28 rounded-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* Main content with left navigator */}
      <div className="pt-20 px-6 max-w-6xl mx-auto flex gap-8">
        {/* Left Navigator Skeleton */}
        <div className="hidden lg:block w-[268px] shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Center Question Card Skeleton */}
        <div className="flex-1 max-w-2xl mx-auto space-y-6">
          <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>
            <div className="space-y-3 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
