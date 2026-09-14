'use client'

import React from 'react'
import { Sparkles, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TranscriptEntry } from '../types/course-editor.types'

interface TranscriptBuilderProps {
  transcripts?: TranscriptEntry[]
  onChange: (transcripts: TranscriptEntry[]) => void
  onOpenBulkModal: () => void
}

export function TranscriptBuilder({ transcripts = [], onChange, onOpenBulkModal }: TranscriptBuilderProps) {
  const handleAddRow = () => {
    const newTr: TranscriptEntry = {
      id: `tr-${Date.now()}`,
      timestamp: '00:00',
      timestampSeconds: 0,
      text: 'Nhập tiêu đề hoặc lời thoại...',
    }
    onChange([...transcripts, newTr])
  }

  const handleUpdateTimestamp = (id: string, newTimestamp: string) => {
    const parts = newTimestamp.split(':')
    let secs = 0
    if (parts.length === 3) {
      secs = (parseInt(parts[0]) || 0) * 3600 + (parseInt(parts[1]) || 0) * 60 + (parseInt(parts[2]) || 0)
    } else if (parts.length === 2) {
      secs = (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0)
    }

    const updated = transcripts.map((item) =>
      item.id === id ? { ...item, timestamp: newTimestamp, timestampSeconds: secs } : item
    )
    onChange(updated)
  }

  const handleUpdateText = (id: string, newText: string) => {
    const updated = transcripts.map((item) =>
      item.id === id ? { ...item, text: newText } : item
    )
    onChange(updated)
  }

  const handleDeleteRow = (id: string) => {
    onChange(transcripts.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-2.5 pt-2 border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            🎙️ Mốc Thời Gian &amp; Lời Thoại (Timestamps / Chapters)
          </span>
          <span className="text-[10px] text-muted-foreground block">
            Học viên click vào mốc thời gian sẽ tự động nhảy đến đúng đoạn video đó.
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenBulkModal}
            className="h-7 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer gap-1 shadow-2xs"
          >
            <Sparkles className="h-3 w-3" />
            ⚡ Nhập mốc YouTube
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            className="h-7 text-xs font-medium cursor-pointer gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            + Thêm mốc
          </Button>
        </div>
      </div>

      {transcripts.length > 0 ? (
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {transcripts.map((tr) => (
            <div key={tr.id} className="flex items-center gap-2 text-xs">
              <Input
                value={tr.timestamp}
                onChange={(e) => handleUpdateTimestamp(tr.id, e.target.value)}
                className="w-24 h-7 text-xs font-mono shrink-0"
                placeholder="00:00"
              />
              <Input
                value={tr.text}
                onChange={(e) => handleUpdateText(tr.id, e.target.value)}
                className="flex-1 h-7 text-xs"
                placeholder="Mô tả phân đoạn..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteRow(tr.id)}
                className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                title="Xóa mốc này"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground italic py-1">
          Chưa có mốc thời gian hoặc lời thoại nào cho bài học này. Bấm &quot;⚡ Nhập mốc YouTube&quot; để dán danh sách tự động.
        </p>
      )}
    </div>
  )
}
