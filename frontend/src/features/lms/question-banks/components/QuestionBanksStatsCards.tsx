'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, FileQuestion, FileSpreadsheet, Sparkles } from 'lucide-react'
import type { QuestionBanksStats } from '../types/question-banks.types'

interface QuestionBanksStatsCardsProps {
  stats?: QuestionBanksStats
  isLoading?: boolean
}

export function QuestionBanksStatsCards({ stats, isLoading }: QuestionBanksStatsCardsProps) {
  const totalBanks = stats?.totalBanks ?? 0
  const totalQuestions = stats?.totalQuestions ?? 0
  const googleSheetBanks = stats?.googleSheetBanks ?? 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng Ngân Hàng */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Ngân Hàng Đề Thi</CardTitle>
          <HelpCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : totalBanks}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Kho lưu trữ tập trung theo môn & nghiệp vụ
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Tổng Số Câu Hỏi */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Tổng Câu Hỏi Đang Sử Dụng</CardTitle>
          <FileQuestion className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? '...' : totalQuestions.toLocaleString('vi-VN')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Sẵn sàng rút ngẫu nhiên vào các bài kiểm tra
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Google Sheets Connected */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Đồng Bộ Google Sheets</CardTitle>
          <FileSpreadsheet className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
            {isLoading ? '...' : googleSheetBanks}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Ngân hàng hỗ trợ cập nhật tự động 1-Click
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Audit & Dynamic Matrix */}
      <Card className="shadow-xs border border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Kiểm Toán & Rút Đề Thi</CardTitle>
          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            100%
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Lưu vết thay đổi và chống rò rỉ đề thi
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
