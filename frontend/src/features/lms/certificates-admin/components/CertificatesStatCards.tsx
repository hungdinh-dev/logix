'use client'

import React from 'react'
import { Award, ShieldCheck, AlertTriangle, XCircle, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CertificateStats } from '../types/certificate-admin.types'

interface CertificatesStatCardsProps {
  stats?: CertificateStats
  isLoading: boolean
}

export function CertificatesStatCards({ stats, isLoading }: CertificatesStatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border border-border/80 bg-card shadow-2xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    {
      label: 'Tổng Đã Cấp',
      value: stats?.total ?? 0,
      icon: Award,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
      desc: 'Toàn hệ thống',
    },
    {
      label: 'Còn Hiệu Lực',
      value: stats?.active ?? 0,
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      desc: 'Đang lưu hành',
    },
    {
      label: 'Sắp Hết Hạn (<30d)',
      value: stats?.expiringSoon ?? 0,
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      desc: 'Cần gia hạn / thi lại',
    },
    {
      label: 'Hết Hạn / Thu Hồi',
      value: (stats?.expired ?? 0) + (stats?.revoked ?? 0),
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
      desc: `${stats?.expired ?? 0} hết hạn, ${stats?.revoked ?? 0} thu hồi`,
    },
    {
      label: 'Mẫu Phôi Chuẩn',
      value: stats?.templatesCount ?? 0,
      icon: Layers,
      color: 'text-slate-700 dark:text-slate-300',
      bgColor: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      desc: 'Phôi chứng chỉ active',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon
        return (
          <Card
            key={idx}
            className="border border-border/80 bg-card/90 hover:bg-card transition-all shadow-2xs hover:shadow-xs"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{item.value}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${item.bgColor} shrink-0`}>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
