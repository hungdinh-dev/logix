'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { TranscriptBuilder } from './TranscriptBuilder'
import type { LessonItem } from '../types/course-editor.types'

interface VideoLessonEditorProps {
  lesson: LessonItem
  onChange: (updated: LessonItem) => void
  onOpenBulkModal: () => void
}

export function VideoLessonEditor({ lesson, onChange, onOpenBulkModal }: VideoLessonEditorProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-xs font-semibold">Đường dẫn Video YouTube / MP4</Label>
          <Input
            value={lesson.videoUrl || ''}
            onChange={(e) => onChange({ ...lesson, videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
            className="text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Thời lượng ước tính (phút)</Label>
          <Input
            type="number"
            value={lesson.durationMinutes}
            onChange={(e) => onChange({ ...lesson, durationMinutes: Number(e.target.value) || 10 })}
            className="text-xs"
          />
        </div>
      </div>

      {/* Anti-seeking & Compliance Option */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-card/70 shadow-2xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Cho phép học viên tua nhanh video (Free Seeking)
            </Label>
            {lesson.allowSeeking === false && (
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 text-[10px] py-0">
                🔒 Khóa tua cóc (Bắt buộc)
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {lesson.allowSeeking === false
              ? 'Đang bật chế độ tuân thủ: Học viên phải xem tuần tự, đạt tối thiểu 90% thời lượng mới được mở bài tiếp.'
              : 'Học viên được tự do tua nhanh và nhảy mốc thời lượng tùy ý.'}
          </p>
        </div>
        <Switch
          checked={lesson.allowSeeking ?? true}
          onCheckedChange={(checked) => onChange({ ...lesson, allowSeeking: checked })}
        />
      </div>

      {/* YouTube Preview Embed */}
      {lesson.videoUrl && lesson.videoUrl.includes('youtube') && (
        <div className="aspect-video w-full max-w-lg rounded-lg overflow-hidden border bg-black shadow-sm">
          <iframe
            className="w-full h-full"
            src={lesson.videoUrl.replace('watch?v=', 'embed/')}
            title={lesson.title}
            allowFullScreen
          />
        </div>
      )}

      {/* Transcripts & Chapters Builder */}
      <TranscriptBuilder
        transcripts={lesson.transcripts}
        onChange={(transcripts) => onChange({ ...lesson, transcripts })}
        onOpenBulkModal={onOpenBulkModal}
      />
    </div>
  )
}
