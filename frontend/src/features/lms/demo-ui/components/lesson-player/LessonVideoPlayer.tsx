'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Subtitles,
  Lock,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2] as const

export interface LessonVideoPlayerProps {
  readonly totalDurationSeconds: number
  readonly totalDurationLabel: string
  readonly currentTimeSeconds: number
  readonly maxWatchedSeconds?: number
  readonly onSeek: (seconds: number) => void
  readonly videoUrl?: string | null
  readonly allowSeeking?: boolean
}

function getYouTubeEmbedUrl(url: string, startTime: number = 0) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (!match) return null
  const base = `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0&enablejsapi=1`
  return startTime > 0 ? `${base}&start=${startTime}` : base
}

export function LessonVideoPlayer({
  totalDurationSeconds,
  totalDurationLabel,
  currentTimeSeconds,
  maxWatchedSeconds = 0,
  onSeek,
  videoUrl,
  allowSeeking = true,
}: LessonVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<(typeof SPEED_OPTIONS)[number]>(1)
  const [volume, setVolume] = useState(80)
  const [showSpeed, setShowSpeed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const youtubeEmbed = videoUrl ? getYouTubeEmbedUrl(videoUrl, currentTimeSeconds) : null

  // Format mm:ss or hh:mm:ss
  const formatTime = (s: number) => {
    const hours = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.floor(s % 60)
    if (hours > 0) {
      return `${hours}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    }
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  // Handle Seek with Anti-seek security check
  const handleSeekRequest = (targetSeconds: number) => {
    const bounded = Math.max(0, Math.min(targetSeconds, totalDurationSeconds))

    if (!allowSeeking) {
      // If anti-seek is active, learner can only seek up to maxWatchedSeconds + 2s
      const allowedMax = Math.max(maxWatchedSeconds, currentTimeSeconds)
      if (bounded > allowedMax + 2) {
        toast.warning(
          `🔒 Khóa tua cóc: Bạn cần theo dõi bài giảng tuần tự. Không thể tua vượt quá mốc ${formatTime(allowedMax)}!`
        )
        onSeek(allowedMax)
        return
      }
    }

    onSeek(bounded)
    if (videoRef.current) {
      videoRef.current.currentTime = bounded
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const target = Math.round(pct * totalDurationSeconds)
    handleSeekRequest(target)
  }

  // Calculate percentage
  const progressPct = totalDurationSeconds > 0 ? (currentTimeSeconds / totalDurationSeconds) * 100 : 0
  const maxWatchedPct = totalDurationSeconds > 0 ? (Math.max(maxWatchedSeconds, currentTimeSeconds) / totalDurationSeconds) * 100 : 0

  if (youtubeEmbed) {
    return (
      <div className="space-y-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border shadow-md group">
          <iframe
            key={currentTimeSeconds > 0 ? `${videoUrl}-${currentTimeSeconds}` : videoUrl}
            src={youtubeEmbed}
            title="Lesson Video"
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {!allowSeeking && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Chống tua cóc (Bắt buộc xem 90%)</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.includes('storage.'))) {
    return (
      <div className="space-y-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border shadow-md">
          <video
            ref={videoRef}
            src={videoUrl}
            controls={allowSeeking}
            onTimeUpdate={(e) => {
              const current = Math.floor(e.currentTarget.currentTime)
              onSeek(current)
            }}
            className="h-full w-full object-contain"
          />

          {!allowSeeking && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Khóa tua cóc</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#181715] shadow-md border border-border">
      {/* Anti-seeking compliance banner */}
      {!allowSeeking && (
        <div className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Bài giảng bắt buộc: Khóa tua tiến</span>
        </div>
      )}

      {/* Placeholder video frame */}
      <div className="flex h-full w-full items-center justify-center">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          {playing ? (
            <Pause className="h-9 w-9 text-white" />
          ) : (
            <Play className="ml-1 h-9 w-9 text-white" />
          )}
        </button>
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 pb-3 pt-8">
        {/* Progress bar */}
        <div
          role="slider"
          aria-label="Video progress"
          aria-valuenow={currentTimeSeconds}
          aria-valuemin={0}
          aria-valuemax={totalDurationSeconds}
          tabIndex={0}
          className="relative mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20 hover:h-2 transition-all"
          onClick={handleProgressClick}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') handleSeekRequest(currentTimeSeconds + 10)
            if (e.key === 'ArrowLeft') handleSeekRequest(currentTimeSeconds - 10)
          }}
        >
          {/* Max Watched Buffer (Gray/Amber) */}
          {!allowSeeking && (
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white/30"
              style={{ width: `${maxWatchedPct}%` }}
              title={`Đã xem tới: ${formatTime(maxWatchedSeconds)}`}
            />
          )}

          {/* Current Progress (Primary) */}
          <div
            className="relative h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          >
            <span className="absolute -right-1.5 -top-1 h-3.5 w-3.5 rounded-full bg-amber-400 shadow-md ring-2 ring-black" />
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            type="button"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={() => setPlaying((v) => !v)}
            className="cursor-pointer text-white/90 transition-colors hover:text-white"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          {/* Time */}
          <span className="text-[11px] tabular-nums text-white/80 font-mono">
            {formatTime(currentTimeSeconds)} / {totalDurationLabel}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <Volume2 className="h-4 w-4 text-white/60" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-1 w-16 cursor-pointer accent-primary"
            />
          </div>

          {/* Speed */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSpeed((v) => !v)}
              className="cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium text-white/60 hover:bg-white/10 hover:text-white font-mono"
            >
              {speed}x
            </button>
            {showSpeed && (
              <div className="absolute bottom-full right-0 mb-1 overflow-hidden rounded-lg border border-white/10 bg-[#1f1e1b] py-1 shadow-lg z-20">
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSpeed(s)
                      setShowSpeed(false)
                    }}
                    className={cn(
                      'block w-full cursor-pointer px-4 py-1 text-left text-[11px] hover:bg-white/10',
                      s === speed ? 'text-primary font-bold' : 'text-white/60'
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default LessonVideoPlayer
