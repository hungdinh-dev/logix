import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-2">
            <Logo height={28} />
            <p className="text-sm text-muted-foreground max-w-sm">
              LogiX Enterprise Ecosystem — Hệ sinh thái Quản trị Nhân sự (HRM) & Đào tạo Năng lực Nội bộ (LMS) thế hệ mới dành cho doanh nghiệp chuỗi và F&B.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Phân hệ Hệ thống</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/lms/dashboard" className="hover:text-foreground">LogiX LMS (Đào tạo)</Link></li>
              <li><Link href="/hrm" className="hover:text-foreground">LogiX HRM (Nhân sự)</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Cổng Đăng nhập</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Hỗ trợ & Pháp lý</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-pointer hover:text-foreground">Điều khoản dịch vụ</span></li>
              <li><span className="cursor-pointer hover:text-foreground">Chính sách bảo mật</span></li>
              <li><span className="cursor-pointer hover:text-foreground">Tiêu chuẩn ISO & ATTP</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LogiX Enterprise Platform. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
