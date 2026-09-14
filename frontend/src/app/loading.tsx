import { Loader2 } from 'lucide-react'

export default function RootLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-xs">
      <div className="relative flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <div className="absolute size-4 rounded-full bg-primary/20 animate-ping" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Đang tải trang...
      </p>
    </div>
  )
}
