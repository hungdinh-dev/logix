'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { routePath } from '@/config/route-path'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  Clock,
  Zap,
  TrendingUp,
  Brain,
  ShieldCheck,
  Star,
  Building2,
  Briefcase,
  FileCheck,
} from 'lucide-react'

const features = [
  {
    icon: GraduationCap,
    title: 'Lộ trình học cá nhân hóa',
    desc: 'Thiết lập lộ trình học tập chi tiết cho từng vị trí phòng ban, tự động phân phối bài học phù hợp.',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Kho khóa học đa dạng',
    desc: 'Quản lý bài giảng video, tài liệu PDF, bài thi trắc nghiệm và các bài thực hành thực tế trực quan.',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: Brain,
    title: 'Đánh giá & Trắc nghiệm AI',
    desc: 'Chấm điểm tự động và đề xuất ôn tập kiến thức thông minh bằng các bài Quiz thiết kế khoa học.',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Báo cáo tiến độ Real-time',
    desc: 'Giúp HR và quản lý theo dõi sát sao tỷ lệ hoàn thành khóa học, điểm số trung bình và năng lực nhân sự.',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  {
    icon: Award,
    title: 'Chứng chỉ chuẩn hóa',
    desc: 'Tự động cấp chứng nhận số hoàn thành khóa học có thời hạn, đáp ứng yêu cầu kiểm toán và ISO.',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  {
    icon: Zap,
    title: 'Trình phát bài giảng thông minh',
    desc: 'Tích hợp tài liệu SOP, video tốc độ cao, ký xác nhận điện tử và trợ lý AI Tutor giải đáp 24/7.',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
  },
]

const stats = [
  { value: '100%', label: 'Đào tạo tự động' },
  { value: '95%', label: 'Tỷ lệ hoàn thành' },
  { value: '4.8★', label: 'Học viên hài lòng' },
  { value: '< 15m', label: 'Thiết lập khóa học' },
  { value: 'ISO 27001', label: 'Bảo mật tiêu chuẩn' },
]

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/40 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Hệ sinh thái Doanh nghiệp Thế hệ Mới: LMS & HRM</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Chuẩn hóa Đào tạo & <br />
              <span className="text-primary">Phát triển Năng lực Nhân sự</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              LogiX kết hợp đồng bộ giữa <strong>Quản lý Học tập (LMS)</strong> và <strong>Quản trị Nhân sự (HRM)</strong>, giúp doanh nghiệp tự động hóa onboarding, theo dõi tiến độ nhân viên và nâng tầm năng lực tổ chức.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href={routePath.login}>
                <Button size="lg" className="gap-2 text-base px-6 h-12 shadow-md">
                  <span>Trải nghiệm ngay</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#solutions">
                <Button size="lg" variant="outline" className="text-base px-6 h-12">
                  Xem hai phân hệ
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-12 border-t border-border/40 mt-12">
              {stats.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Solutions Section (Showcase LMS & HRM) ────────────────────── */}
      <section id="solutions" className="py-20 bg-muted/20 border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Hai Trụ Cột Độc Lập & Đồng Bộ</h2>
            <p className="text-muted-foreground">
              Thiết kế theo kiến trúc Vertical Slice Architecture giúp đội ngũ phát triển độc lập không xung đột.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: LogiX LMS */}
            <Card className="border-border/60 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">1. Phân hệ LogiX LMS</h3>
                  <p className="text-sm text-muted-foreground">
                    Hệ thống Đào tạo & Quản lý Giáo trình Chuyên sâu.
                  </p>
                </div>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Quản lý danh mục & khóa học chuyên môn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Trình soạn bài giảng & kéo thả Sortable giáo trình</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Trình phát bài giảng video, SOP ký điện tử & AI Tutor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Hệ thống Quiz trắc nghiệm chấm điểm tự động</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/lms/dashboard">
                    <Button variant="outline" size="sm" className="gap-1.5 w-full justify-between">
                      <span>Vào Cổng Đào tạo</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: LogiX HRM */}
            <Card className="border-border/60 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-6">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">2. Phân hệ LogiX HRM</h3>
                  <p className="text-sm text-muted-foreground">
                    Hệ thống Quản trị Nhân sự & Đãi ngộ Toàn diện.
                  </p>
                </div>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Cơ cấu tổ chức: Phòng ban, Chức danh & Cấp bậc</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Quản lý hồ sơ nhân sự, hợp đồng & thời hạn onboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Chấm công, tính lương tự động & theo dõi ca làm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Đánh giá hiệu quả công việc (KPI / Performance)</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link href="/hrm">
                    <Button variant="outline" size="sm" className="gap-1.5 w-full justify-between">
                      <span>Vào Cổng Nhân sự</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── 3. Features Section ─────────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Tính Năng Đột Phá Cho Doanh Nghiệp</h2>
            <p className="text-muted-foreground">
              Giải pháp toàn diện tối ưu hóa hiệu suất làm việc và chuẩn hóa quy trình đào tạo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon
              return (
                <Card key={idx} className="border-border/60">
                  <CardContent className="p-6 space-y-4">
                    <div className={`h-11 w-11 rounded-lg ${f.iconBg} ${f.iconColor} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-base">{f.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
