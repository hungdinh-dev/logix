import { Loader2 } from 'lucide-react'

export default function ProtectedLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-3 p-6">
      <div className="flex items-center gap-3 rounded-full border bg-card/80 px-4 py-2 shadow-xs backdrop-blur-xs">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Đang tải dữ liệu...</span>
      </div>
    </div>
  )
}
