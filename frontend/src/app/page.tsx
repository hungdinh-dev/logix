import Link from 'next/link'
import type { Metadata } from 'next'
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
} from 'lucide-react'
import { Header } from '@/components/shared/Header'

export const metadata: Metadata = {
  title: 'LogiX LMS — Nền tảng Đào tạo và Phát triển Năng lực Nội bộ',
  description:
    'Hệ thống quản lý học tập (LMS) thế hệ mới giúp doanh nghiệp chuẩn hóa quy trình đào tạo, theo dõi tiến độ nhân viên và tối ưu hóa năng lực tổ chức.',
}

const features = [
  {
    icon: GraduationCap,
    title: 'Lộ trình học cá nhân hóa',
    desc: 'Thiết lập lộ trình học tập chi tiết cho từng vị trí phòng ban, tự động phân phối bài học phù hợp.',
    iconBg: 'bg-[#e8f0fb]',
    iconColor: 'text-[#1e40af]',
  },
  {
    icon: BookOpen,
    title: 'Kho khóa học đa dạng',
    desc: 'Quản lý bài giảng video, tài liệu PDF, bài thi trắc nghiệm và các bài thực hành thực tế trực quan.',
    iconBg: 'bg-[#faf3e8]',
    iconColor: 'text-[#e8a55a]',
  },
  {
    icon: Brain,
    title: 'Đánh giá & Trắc nghiệm AI',
    desc: 'Chấm điểm tự động và đề xuất ôn tập kiến thức thông minh bằng các bài Quiz thiết kế khoa học.',
    iconBg: 'bg-[#e8f4f1]',
    iconColor: 'text-[#5db8a6]',
  },
  {
    icon: TrendingUp,
    title: 'Báo cáo tiến độ Real-time',
    desc: 'Giúp HR và quản lý theo dõi sát sao tỷ lệ hoàn thành khóa học, điểm số trung bình và năng lực của từng nhân viên.',
    iconBg: 'bg-[#f5ede8]',
    iconColor: 'text-[#cc785c]',
  },
  {
    icon: Award,
    title: 'Chứng chỉ chuẩn hóa',
    desc: 'Tự động cấp chứng nhận số hoàn thành khóa học có thời hạn, đáp ứng yêu cầu kiểm toán và ISO.',
    iconBg: 'bg-[#ece8f5]',
    iconColor: 'text-[#8b5cf6]',
  },
  {
    icon: Zap,
    title: 'Giao diện mượt mà & Tương tác cao',
    desc: 'Trình phát video bài học tốc độ cao tích hợp ghi chú, hỏi đáp với AI Tutor hỗ trợ học viên 24/7.',
    iconBg: 'bg-[#e8f3ea]',
    iconColor: 'text-[#5db872]',
  },
]

const stats = [
  { value: '100%', label: 'Đào tạo tự động' },
  { value: '95%', label: 'Tỷ lệ hoàn thành' },
  { value: '4.8★', label: 'Học viên hài lòng' },
  { value: '< 15m', label: 'Thiết lập khóa học' },
  { value: 'ISO 27001', label: 'Bảo mật tiêu chuẩn' },
]

const steps = [
  {
    num: '01',
    title: 'Tạo khóa học & Lộ trình',
    desc: 'Tải lên bài giảng video, tài liệu đọc và thiết lập các phần thi trắc nghiệm kiểm tra kiến thức.',
  },
  {
    num: '02',
    title: 'Phân phối tới học viên',
    desc: 'Tự động gán khóa học theo vị trí công việc, phòng ban hoặc gửi email kích hoạt cho học viên mới.',
  },
  {
    num: '03',
    title: 'Theo dõi tiến trình & Cấp chứng chỉ',
    desc: 'Xem báo cáo hoàn thành chi tiết của từng cá nhân và tự động gửi chứng nhận khi học viên đạt yêu cầu.',
  },
]

const testimonials = [
  {
    quote:
      'Quy trình onboarding nhân viên mới giảm từ 2 tuần xuống còn 3 ngày nhờ lộ trình học tập tự động trên LogiX LMS.',
    name: 'Nguyễn Thu Trang',
    title: 'Trưởng phòng Đào tạo (L&D)',
    company: 'Chuỗi F&B 1,200 nhân viên',
    stars: 5,
  },
  {
    quote:
      'Trình phát bài học cực kỳ mượt mà, nhân viên có thể học ngay trên điện thoại khi có thời gian rảnh. Báo cáo trực quan, rất dễ quản lý.',
    name: 'Phạm Minh Đức',
    title: 'Giám đốc Vận hành',
    company: 'Tập đoàn Bán lẻ VinMart',
    stars: 5,
  },
  {
    quote:
      'Hệ thống Quiz giúp chúng tôi kiểm tra chính xác mức độ hiểu biết của nhân viên về các quy định tuân thủ bảo mật thông tin trước khi kiểm toán.',
    name: 'Trần Hoàng Nam',
    title: 'Giám đốc An ninh Thông tin',
    company: 'Công ty Cổ phần Fintech Việt',
    stars: 5,
  },
]

function LMSDashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#2a2825] bg-[#0d0c0a] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-[#2a2825] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 text-[11px] text-[#4a4840] select-none">
          LogiX LMS — Học viên Dashboard
        </span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {[
          { label: 'Đang học', value: '4 khóa', change: 'Tiến độ: 65%', positive: true },
          { label: 'Đã hoàn thành', value: '12 khóa', change: '12 Chứng chỉ', positive: true },
          { label: 'Điểm Quiz TB', value: '8.8 / 10', change: 'Đạt yêu cầu', positive: true },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-[#252320] bg-[#1a1916] p-2.5">
            <div className="mb-1 text-[9px] text-[#5a5850]">{kpi.label}</div>
            <div className="text-sm leading-none font-bold text-[#faf9f5]">{kpi.value}</div>
            <div className="mt-1 text-[9px] text-[#5db872]">{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Course list */}
      <div className="px-3 pb-3">
        <div className="overflow-hidden rounded-lg border border-[#252320] bg-[#1a1916]">
          <div className="border-b border-[#252320] px-2.5 py-1.5 flex justify-between items-center">
            <span className="text-[8px] text-[#5a5850]">Khóa học đang học</span>
            <span className="text-[8px] text-[#3b82f6]">Học tiếp →</span>
          </div>
          {[
            { title: 'Cybersecurity Awareness 2024', duration: 'Còn 1h 15m', pct: 60, color: '#cc785c' },
            { title: 'Strategic Leadership Fundamentals', duration: 'Còn 3h 45m', pct: 25, color: '#e8a55a' },
            { title: 'GDPR Compliance Essentials', duration: 'Còn 45m', pct: 85, color: '#5db8a6' },
          ].map((row) => (
            <div key={row.title} className="border-b border-[#1f1e1b] px-2.5 py-1.5 last:border-0">
              <div className="mb-1 flex items-center justify-between">
                <span className="truncate max-w-[130px] text-[8px] text-[#8a8880] font-medium">{row.title}</span>
                <span className="text-[7px] text-[#5a5850]">{row.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#2a2825]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                  />
                </div>
                <span className="text-[7px]" style={{ color: row.color }}>{row.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LearningFlowMockup() {
  return (
    <div className="w-full rounded-xl border border-[#2a2825] bg-[#0d0c0a] p-4 shadow-2xl">
      <div className="mb-4 text-[10px] text-[#5a5850]">Quy trình học và tương tác</div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { label: 'Video Bài giảng', value: 'Streaming chất lượng cao', color: '#cc785c' },
          { label: 'Tài liệu hướng dẫn', value: 'PDF / Slide đính kèm', color: '#5db8a6' },
          { label: 'Quiz Tương tác', value: 'Trắc nghiệm chấm điểm', color: '#e8a55a' },
          { label: 'AI Hỏi đáp', value: 'Giải đáp thắc mắc 24/7', color: '#8b5cf6' },
        ].map((src) => (
          <div
            key={src.label}
            className="flex items-center gap-2 rounded-lg border border-[#252320] bg-[#1a1916] px-2.5 py-2"
          >
            <div
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[7px] font-bold text-white"
              style={{ backgroundColor: src.color }}
            >
              {src.label[0]}
            </div>
            <div>
              <div className="text-[8px] font-medium text-[#faf9f5]">{src.label}</div>
              <div className="text-[7px] text-[#5a5850]">{src.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-3 w-0.5 rounded bg-[#3b82f6]/60"
                style={{ opacity: 0.4 + i * 0.2 }}
              />
            ))}
          </div>
          <div className="rounded-full bg-[#3b82f6]/10 px-2 py-0.5 text-[7px] text-[#3b82f6]">
            Theo dõi tiến trình & Ghi nhận hoạt động
          </div>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 w-0.5 rounded bg-[#3b82f6]/60" />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#1e40af]/30 bg-[#1e3a8a]/20 p-3 text-center">
        <span className="text-[10px] font-semibold text-[#3b82f6]">CẤP CHỨNG CHỈ TỰ ĐỘNG</span>
        <div className="mt-1 text-[8px] text-[#8a8880]">Học viên đạt trên 80% điểm số sẽ tự động nhận chứng chỉ xuất file PDF.</div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf9f5]">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0d1117]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(250,249,245,0.8) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[600px] opacity-15"
          style={{ background: 'radial-gradient(ellipse at center, #1e40af 0%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-1/4 h-[300px] w-[400px] opacity-10"
          style={{ background: 'radial-gradient(ellipse at center, #e8784a 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
          <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:gap-16 lg:text-left">
            {/* Left — copy */}
            <div className="max-w-2xl flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8784a]/30 bg-[#e8784a]/10 px-3 py-1 text-xs font-medium text-[#e8784a]">
                <span
                  className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8784a]"
                  aria-hidden="true"
                />
                Giải pháp đào tạo nội bộ doanh nghiệp chuẩn mực
              </span>

              <h1 className="mt-6 text-4xl leading-[1.15] font-bold tracking-tight text-[#faf9f5] sm:text-5xl lg:text-[52px]">
                Nâng tầm nguồn lực
                <br />
                <span className="text-[#e8784a]">với học tập thông minh</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8a8880] lg:max-w-none">
                LogiX LMS hỗ trợ doanh nghiệp xây dựng, vận hành và đo lường hiệu quả các chương trình đào tạo nội bộ. Gắn kết học viên, tự động hóa lộ trình và cấp chứng chỉ trực tuyến.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                <Button
                  asChild
                  size="lg"
                  className="border-0 bg-[#e8784a] px-6 text-base text-white hover:bg-[#d96b3c]"
                >
                  <Link href={routePath.login}>
                    Đăng nhập hệ thống
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-[#faf9f5]/20 bg-transparent px-6 text-base text-[#faf9f5] hover:border-[#faf9f5]/30 hover:bg-[#faf9f5]/10 hover:text-[#faf9f5]"
                >
                  <Link href={routePath.courses}>
                    Khám phá khóa học
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
                {['Tự động 100%', 'Báo cáo chi tiết', 'Tương tác AI hỗ trợ'].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-sm text-[#5a5850]">
                    <CheckCircle2 className="h-4 w-4 text-[#5db872]" aria-hidden="true" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — dashboard mockup */}
            <div className="mt-12 w-full max-w-lg flex-shrink-0 lg:mt-0 lg:w-[440px]">
              <LMSDashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-[#e6dfd8] bg-[#efe9de]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`text-center ${i < stats.length - 1 ? 'lg:border-r lg:border-[#ddd6cc]' : ''}`}
              >
                <div className="text-2xl font-bold text-[#141413] sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-sm text-[#6c6a64]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[#faf9f5] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="text-sm font-semibold tracking-widest text-[#e8784a] uppercase">
              Tính năng nổi bật
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[#141413] sm:text-4xl">
              Quản lý đào tạo tối giản, hiệu quả tối đa
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6c6a64]">
              Tất cả công cụ cần thiết để xây dựng đội ngũ kế thừa tinh nhuệ.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card
                  key={f.title}
                  className="group cursor-pointer border-[#e6dfd8] bg-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#e8784a]/30 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg} ${f.iconColor}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mb-2 font-semibold text-[#141413]">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-[#6c6a64]">{f.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Split Highlights ── */}
      <section className="bg-[#efe9de] py-24">
        <div className="mx-auto max-w-7xl space-y-24 px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="w-full lg:w-1/2">
              <LearningFlowMockup />
            </div>
            <div className="w-full max-w-lg lg:w-1/2">
              <span className="text-sm font-semibold tracking-widest text-[#e8784a] uppercase">
                Quy trình tương tác
              </span>
              <h3 className="mt-3 text-3xl font-bold text-[#141413]">
                Học tập tương tác chủ động và hiệu quả
              </h3>
              <p className="mt-4 leading-relaxed text-[#6c6a64]">
                Học viên không chỉ xem video thụ động. Hệ thống hỗ trợ làm Quiz kiểm tra tức thì, tải tài liệu thực hành và chat hỏi đáp trực tiếp để gỡ rối kiến thức.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Chấm điểm trắc nghiệm trực quan',
                  'Gợi ý học tập bù đắp lỗ hổng kiến thức',
                  'Tự động cấp chứng chỉ PDF ngay khi hoàn thành',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      className="h-5 w-5 flex-shrink-0 text-[#e8784a]"
                      aria-hidden="true"
                    />
                    <span className="text-[#141413]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
