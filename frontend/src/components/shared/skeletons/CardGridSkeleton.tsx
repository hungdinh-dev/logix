import { Skeleton } from '@/components/ui/skeleton'

export interface CardGridSkeletonProps {
  count?: number
  gridColsClassName?: string
}

export function CardGridSkeleton({
  count = 6,
  gridColsClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
}: CardGridSkeletonProps) {
  return (
    <div className={gridColsClassName} aria-busy="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col rounded-xl border bg-card p-4 shadow-xs space-y-3"
        >
          {/* Thumbnail / Header */}
          <Skeleton className="h-44 w-full rounded-lg" />

          {/* Badges & Meta */}
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Title & Description */}
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
