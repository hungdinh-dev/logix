import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">403</h1>
      <p className="text-muted-foreground">Bạn không có quyền truy cập trang này.</p>
      <Button asChild variant="outline">
        <Link href="/dashboard">Về trang chủ</Link>
      </Button>
    </div>
  )
}
