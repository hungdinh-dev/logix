'use client'

import React from 'react'
import { ChevronRight, Layers } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TreeSkeleton } from '@/components/shared/skeletons'

export function CourseEditorSkeleton() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-background">
      {/* Top Bar Skeleton */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-6 bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-28" />
            <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-36 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </header>

      {/* Editor Split Pane Skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane Skeleton */}
        <aside className="w-96 shrink-0 border-r bg-card/40 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b p-3 px-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground/50" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-7 w-20 rounded-md" />
          </div>
          <div className="p-3">
            <TreeSkeleton levels={2} itemsPerLevel={3} />
          </div>
        </aside>

        {/* Right Main Workspace Skeleton */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-7 w-80" />
            </div>
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <Skeleton className="h-64 w-full rounded-xl" />

          <div className="space-y-3 pt-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        </main>
      </div>
    </div>
  )
}
