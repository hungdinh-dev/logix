import { Skeleton } from '@/components/ui/skeleton'

export interface TreeSkeletonProps {
  levels?: number
  itemsPerLevel?: number
}

export function TreeSkeleton({ levels = 2, itemsPerLevel = 3 }: TreeSkeletonProps) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: levels }).map((_, lIdx) => (
        <div key={lIdx} className="rounded-lg border bg-card p-3 space-y-2.5">
          {/* Level Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>

          {/* Children Items */}
          <div className="pl-4 space-y-1.5 pt-1 border-l">
            {Array.from({ length: itemsPerLevel }).map((_, iIdx) => (
              <div key={iIdx} className="flex items-center justify-between p-1.5 rounded-md">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                  <Skeleton className="h-3.5 w-48" />
                </div>
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
