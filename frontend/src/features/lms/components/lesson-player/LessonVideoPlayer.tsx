import { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Subtitles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2] as const;

interface LessonVideoPlayerProps {
  readonly totalDurationSeconds: number;
  readonly totalDurationLabel: string;
  readonly currentTimeSeconds: number;
  readonly onSeek: (seconds: number) => void;
}

export function LessonVideoPlayer({
  totalDurationSeconds,
  totalDurationLabel,
  currentTimeSeconds,
  onSeek,
}: LessonVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEED_OPTIONS)[number]>(1);
  const [volume, setVolume] = useState(80);
  const [showSpeed, setShowSpeed] = useState(false);

  const progressPct = totalDurationSeconds > 0 ? (currentTimeSeconds / totalDurationSeconds) * 100 : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onSeek(Math.round(pct * totalDurationSeconds));
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#181715]">
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-8">
        {/* Progress bar */}
        <div
          role="slider"
          aria-label="Video progress"
          aria-valuenow={currentTimeSeconds}
          aria-valuemin={0}
          aria-valuemax={totalDurationSeconds}
          tabIndex={0}
          className="mb-3 h-1 w-full cursor-pointer rounded-full bg-white/20"
          onClick={handleProgressClick}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onSeek(Math.min(currentTimeSeconds + 10, totalDurationSeconds));
            if (e.key === 'ArrowLeft') onSeek(Math.max(currentTimeSeconds - 10, 0));
          }}
        >
          <div
            className="relative h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          >
            <span className="absolute -right-1.5 -top-1 h-3 w-3 rounded-full bg-amber-400" />
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
          <span className="text-[11px] tabular-nums text-white/60">
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
              className="cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium text-white/60 hover:bg-white/10 hover:text-white"
            >
              {speed}x
            </button>
            {showSpeed && (
              <div className="absolute bottom-full right-0 mb-1 overflow-hidden rounded-lg border border-white/10 bg-[#1f1e1b] py-1 shadow-lg">
                {SPEED_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setSpeed(s); setShowSpeed(false); }}
                    className={cn(
                      'block w-full cursor-pointer px-4 py-1 text-left text-[11px] hover:bg-white/10',
                      s === speed ? 'text-primary' : 'text-white/60',
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CC */}
          <button type="button" aria-label="Closed captions" className="cursor-pointer text-white/60 hover:text-white">
            <Subtitles className="h-4 w-4" />
          </button>

          {/* Fullscreen */}
          <button type="button" aria-label="Fullscreen" className="cursor-pointer text-white/60 hover:text-white">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
