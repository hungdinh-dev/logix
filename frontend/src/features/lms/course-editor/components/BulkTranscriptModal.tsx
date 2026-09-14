'use client'

import React, { useState } from 'react'
import { Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TranscriptEntry } from '../types/course-editor.types'

interface BulkTranscriptModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onImport: (entries: TranscriptEntry[]) => void
}

export function BulkTranscriptModal({ isOpen, onOpenChange, onImport }: BulkTranscriptModalProps) {
  const [bulkText, setBulkText] = useState('')

  const handleApply = () => {
    if (!bulkText.trim()) return

    const lines = bulkText.trim().split('\n')
    const parsedEntries: TranscriptEntry[] = []

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed) return

      // Regex matching mm:ss or hh:mm:ss
      const match = trimmed.match(/(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/)
      if (match) {
        const fullTimestamp = match[0]
        const hours = match[1] ? parseInt(match[1], 10) : 0
        const minutes = parseInt(match[2], 10)
        const seconds = parseInt(match[3], 10)
        const totalSeconds = hours * 3600 + minutes * 60 + seconds

        // Extract title/text by removing the timestamp part
        let text = trimmed.replace(fullTimestamp, '').trim()
        text = text.replace(/^[-–—:.\s)\]]+/, '').trim() || `Mốc ${fullTimestamp}`

        parsedEntries.push({
          id: `tr-${Date.now()}-${idx}`,
          timestamp: fullTimestamp.length <= 5 && hours === 0 ? fullTimestamp.padStart(5, '0') : fullTimestamp,
          timestampSeconds: totalSeconds,
          text,
        })
      }
    })

    if (parsedEntries.length > 0) {
      onImport(parsedEntries)
      toast.success(`Đã trích xuất thành công ${parsedEntries.length} mốc thời gian video!`)
      onOpenChange(false)
      setBulkText('')
    } else {
      toast.error('Không tìm thấy định dạng thời gian (ví dụ 04:48 hoặc 01:00:41) trong nội dung đã dán.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span>Nhập Mốc Thời Gian &amp; Lời Thoại từ YouTube</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Dán đoạn văn bản chứa mốc thời gian từ phần mô tả video (Description) hoặc Tracklist của YouTube. Hệ thống sẽ tự động phân tích và tạo danh sách.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Danh sách mốc thời gian</Label>
              <span className="text-[10px] text-muted-foreground">
                Hỗ trợ cả mm:ss (04:48) và hh:mm:ss (01:00:41)
              </span>
            </div>
            <Textarea
              rows={10}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="Ví dụ:&#10;00:00 Giới thiệu bài học&#10;01:32 Tổng quan kiến trúc&#10;04:48 Hướng dẫn thao tác&#10;10:20 Tổng kết và lưu ý&#10;01:00:41 Phân tích chuyên sâu"
              className="font-mono text-xs leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            disabled={!bulkText.trim()}
            className="text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1.5 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            Chuyển Đổi &amp; Áp Dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
