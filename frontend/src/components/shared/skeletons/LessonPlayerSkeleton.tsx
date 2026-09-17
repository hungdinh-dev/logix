import { Skeleton } from '@/components/ui/skeleton'

export function LessonPlayerSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-card" aria-busy="true">
      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden pb-16 relative">
        {/* LEFT Outline Skeleton */}
        <div className="hidden lg:flex w-[280px] shrink-0 flex-col border-r border-border bg-card p-4 space-y-4">
          <div className="space-y-2 pb-3 border-b border-border">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-3 flex-1 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg border border-border/40">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER Main Player Skeleton */}
        <main className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="mx-auto w-full max-w-3xl space-y-5">
            {/* Video/Article Area */}
            <Skeleton className="aspect-video w-full rounded-xl shadow-sm" />

            {/* Header & Meta */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4 max-w-md" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>

            {/* Article / Tabs preview skeleton */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-12 w-full rounded-lg mt-6" />
            </div>
          </div>
        </main>

        {/* RIGHT Discussion Skeleton */}
        <div className="hidden xl:flex w-[320px] shrink-0 flex-col border-l border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-t border-border bg-card/95 px-6">
        <Skeleton className="h-8 w-24 rounded-md" />
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-1.5 w-48 rounded-full" />
        </div>
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>
    </div>
  )
}
