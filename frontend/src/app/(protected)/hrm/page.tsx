'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, DollarSign, Award, Clock, GitBranch } from 'lucide-react'

export default function HRMPlaceholderPage() {
  const hrmModules = [
    { name: 'Quản Lý Nhân Sự', desc: 'Danh sách nhân viên, hồ sơ chi tiết, hợp đồng', icon: Users, route: '/hr/employees' },
    { name: 'Chấm Công & Ca Làm', desc: 'Bảng công thời gian thực, heatmap chuyên cần', icon: Clock, route: '/hr/attendance' },
    { name: 'Tính Lương (Payroll)', desc: 'Bảng lương, phiếu lương điện tử, phụ cấp', icon: DollarSign, route: '/hr/payroll' },
    { name: 'Đánh Giá KPI', desc: 'Hiệu suất nhân viên, phân bổ điểm định kỳ', icon: Award, route: '/hr/kpi' },
    { name: 'Nghỉ Phép & Đơn Từ', desc: 'Duyệt phép, nghỉ ốm, công tác, lịch nghỉ lễ', icon: Calendar, route: '/hr/leave' },
    { name: 'Sơ Đồ Tổ Chức', desc: 'Cây cơ cấu phòng ban, chức danh trực thuộc', icon: GitBranch, route: '/hr/org-chart' },
  ]

  return (
    <div className="p-6 mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Phân Hệ Quản Trị Nhân Sự (HRM Hub)</span>
          <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5 rounded-full">
            HRM Sandbox Ready
          </Badge>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Khu vực phát triển độc lập dành cho Team HRM — kiến trúc Vertical Slices sẵn sàng tích hợp
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hrmModules.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.name} className="border border-border/80 shadow-xs hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-foreground">{item.name}</CardTitle>
                    <code className="text-[10px] text-muted-foreground font-mono">{item.route}</code>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs text-muted-foreground">
                  {item.desc}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
