'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Play,
  Pause,
  Volume2,
  Lock,
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
  readonly onDurationDetected?: (durationSeconds: number) => void
  readonly videoUrl?: string | null
  readonly allowSeeking?: boolean
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match ? match[1] : null
}

export function LessonVideoPlayer({
  totalDurationSeconds,
  totalDurationLabel,
  currentTimeSeconds,
  maxWatchedSeconds = 0,
  onSeek,
  onDurationDetected,
  videoUrl,
  allowSeeking = true,
}: LessonVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<(typeof SPEED_OPTIONS)[number]>(1)
  const [volume, setVolume] = useState(80)
  const [showSpeed, setShowSpeed] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lastReportedTimeRef = useRef<number>(currentTimeSeconds)

  const onSeekRef = useRef(onSeek)
  onSeekRef.current = onSeek

  const onDurationDetectedRef = useRef(onDurationDetected)
  onDurationDetectedRef.current = onDurationDetected

  const youtubeId = videoUrl ? extractYouTubeId(videoUrl) : null

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
  const handleSeekRequest = useCallback((targetSeconds: number) => {
    const bounded = Math.max(0, Math.min(targetSeconds, totalDurationSeconds || 3600))

    if (!allowSeeking) {
      const allowedMax = Math.max(maxWatchedSeconds, currentTimeSeconds)
      if (bounded > allowedMax + 2) {
        toast.warning(
          `🔒 Khóa tua cóc: Bạn cần theo dõi bài giảng tuần tự. Không thể tua vượt quá mốc ${formatTime(allowedMax)}!`
        )
        onSeek(allowedMax)
        return
      }
    }

    lastReportedTimeRef.current = bounded
    onSeek(bounded)

    // Seek HTML5 Video
    if (videoRef.current) {
      videoRef.current.currentTime = bounded
    }

    // Seek YouTube without iframe reload
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [bounded, true],
        }),
        '*'
      )
    }
  }, [allowSeeking, maxWatchedSeconds, currentTimeSeconds, totalDurationSeconds, onSeek])

  // Sync external seek changes (like TranscriptTab click) to HTML5 video or YouTube iframe
  // ONLY if the change is significant (jump > 1.5s) to avoid playback feedback loops
  useEffect(() => {
    if (Math.abs(currentTimeSeconds - lastReportedTimeRef.current) > 1.5) {
      lastReportedTimeRef.current = currentTimeSeconds

      if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTimeSeconds) > 1.5) {
        videoRef.current.currentTime = currentTimeSeconds
      }

      if (youtubeId && iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [currentTimeSeconds, true],
          }),
          '*'
        )
      }
    }
  }, [currentTimeSeconds, youtubeId])

  // Listen to YouTube postMessage events to track playback time, real duration & play state
  useEffect(() => {
    if (!youtubeId) return

    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch {
            return
          }
        }

        if (data && data.event === 'infoDelivery' && data.info) {
          // Capture real duration from YouTube
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            onDurationDetectedRef.current?.(Math.floor(data.info.duration))
          }

          // Capture current time
          if (typeof data.info.currentTime === 'number') {
            const currentSec = Math.floor(data.info.currentTime)
            if (currentSec !== lastReportedTimeRef.current) {
              lastReportedTimeRef.current = currentSec
              onSeekRef.current(currentSec)
            }
          }

          // Capture player state (1: playing, 2: paused, 0: ended)
          if (data.info.playerState === 1) {
            setPlaying(true)
          } else if (data.info.playerState === 2) {
            setPlaying(false)
          } else if (data.info.playerState === 0) {
            setPlaying(false)
            if (typeof data.info.duration === 'number' && data.info.duration > 0) {
              const finalSec = Math.floor(data.info.duration)
              lastReportedTimeRef.current = finalSec
              onSeekRef.current(finalSec)
            }
          }
        }
      } catch {
        // Ignore non-JSON postMessage from other extensions/scripts
      }
    }

    window.addEventListener('message', handleMessage)

    // Initial handshake after mounting
    const initTimer = setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'listening' }),
          '*'
        )
      }
    }, 500)

    return () => {
      window.removeEventListener('message', handleMessage)
      clearTimeout(initTimer)
    }
  }, [youtubeId])

  // Mockup Player: Simulate video playback timer when playing is true
  useEffect(() => {
    if (youtubeId || (videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')))) {
      return
    }

    let interval: NodeJS.Timeout | null = null
    if (playing) {
      interval = setInterval(() => {
        const nextTime = currentTimeSeconds + 1
        if (totalDurationSeconds > 0 && nextTime >= totalDurationSeconds) {
          lastReportedTimeRef.current = totalDurationSeconds
          onSeek(totalDurationSeconds)
          setPlaying(false)
        } else {
          lastReportedTimeRef.current = nextTime
          onSeek(nextTime)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [playing, currentTimeSeconds, totalDurationSeconds, onSeek, youtubeId, videoUrl])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    const target = Math.round(pct * (totalDurationSeconds || 600))
    handleSeekRequest(target)
  }

  // Calculate percentage
  const duration = totalDurationSeconds > 0 ? totalDurationSeconds : 600
  const progressPct = Math.min(100, (currentTimeSeconds / duration) * 100)
  const maxWatchedPct = Math.min(100, (Math.max(maxWatchedSeconds, currentTimeSeconds) / duration) * 100)

  // YouTube embed URL (memoized to keep iframe stable)
  const embedSrc = useMemo(() => {
    if (!youtubeId) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1&origin=${encodeURIComponent(origin)}`
  }, [youtubeId])

  // 1. YouTube Video Mode
  if (youtubeId) {
    return (
      <div className="space-y-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border shadow-md group">
          <iframe
            ref={iframeRef}
            src={embedSrc}
            title="Lesson Video"
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'listening' }),
                  '*'
                )
              }
            }}
          />

          {!allowSeeking && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1.5 shadow-sm pointer-events-none">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Chống tua cóc (Bắt buộc xem 90%)</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 2. Direct HTML5 Video File Mode
  if (videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.includes('storage.'))) {
    return (
      <div className="space-y-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border shadow-md">
          <video
            ref={videoRef}
            src={videoUrl}
            controls={allowSeeking}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => {
              const dur = Math.floor(e.currentTarget.duration)
              if (dur > 0) {
                onDurationDetectedRef.current?.(dur)
              }
            }}
            onTimeUpdate={(e) => {
              const current = Math.floor(e.currentTarget.currentTime)
              if (current !== lastReportedTimeRef.current) {
                lastReportedTimeRef.current = current
                onSeekRef.current(current)
              }
            }}
            onEnded={() => {
              setPlaying(false)
              if (videoRef.current?.duration) {
                const finalSec = Math.floor(videoRef.current.duration)
                lastReportedTimeRef.current = finalSec
                onSeekRef.current(finalSec)
              }
            }}
            className="h-full w-full object-contain"
          />

          {!allowSeeking && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1.5 shadow-sm pointer-events-none">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Khóa tua cóc</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 3. Custom / Placeholder Mock Player Mode
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
          aria-label={playing ? 'Tạm dừng video' : 'Phát video'}
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
