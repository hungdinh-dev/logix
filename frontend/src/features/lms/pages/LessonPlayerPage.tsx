'use client'

import { useState } from 'react';
import { Bookmark, Download, Share2, ThumbsUp } from 'lucide-react';
import { useParams } from 'next/navigation';
import { LessonOutlinePanel } from '../components/lesson-player/LessonOutlinePanel';
import { LessonVideoPlayer } from '../components/lesson-player/LessonVideoPlayer';
import { LessonContentTabs } from '../components/lesson-player/LessonContentTabs';
import { LessonRightPanel } from '../components/lesson-player/LessonRightPanel';
import { LessonBottomBar } from '../components/lesson-player/LessonBottomBar';
import {
  MOCK_CHAPTERS,
  MOCK_TRANSCRIPT,
  MOCK_RESOURCES,
  MOCK_COMMENTS,
  INITIAL_AI_MESSAGES,
  MOCK_CURRENT_LESSON,
} from '../mocks/lesson-player.mock';

const COURSE_TITLE = 'Cybersecurity Awareness 2024';

export default function LessonPlayerPage() {
  const params = useParams();
  const courseId = (params?.courseId as string) || '7';
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-card">
      {/* 3-column body (full height minus bottom bar) */}
      <div className="flex flex-1 overflow-hidden pb-16">
        {/* LEFT — Course outline */}
        <LessonOutlinePanel
          courseId={courseId}
          courseTitle={COURSE_TITLE}
          chapters={MOCK_CHAPTERS}
          currentLessonId={MOCK_CURRENT_LESSON.id}
        />

        {/* CENTER — Main content */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-6 py-5">
            {/* Video player */}
            <LessonVideoPlayer
              totalDurationSeconds={MOCK_CURRENT_LESSON.videoDurationSeconds}
              totalDurationLabel={MOCK_CURRENT_LESSON.videoDuration}
              currentTimeSeconds={currentTime}
              onSeek={setCurrentTime}
            />

            {/* Lesson meta */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-foreground">{MOCK_CURRENT_LESSON.title}</h1>
                <span className="mt-1 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Chapter {MOCK_CURRENT_LESSON.chapterNumber}: {MOCK_CURRENT_LESSON.chapterTitle}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex shrink-0 items-center gap-1.5">
                {[
                  { icon: ThumbsUp, label: 'Like' },
                  { icon: Bookmark, label: 'Bookmark' },
                  { icon: Download, label: 'Download' },
                  { icon: Share2, label: 'Share' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content tabs (Transcript / Resources / Notes) */}
            <div className="mt-6">
              <LessonContentTabs
                transcript={MOCK_TRANSCRIPT}
                resources={MOCK_RESOURCES}
                currentTimeSeconds={currentTime}
                onSeek={setCurrentTime}
              />
            </div>
          </div>
        </main>

        {/* RIGHT — Discussion / AI */}
        <LessonRightPanel
          comments={MOCK_COMMENTS}
          initialAiMessages={INITIAL_AI_MESSAGES}
        />
      </div>

      {/* Fixed bottom bar */}
      <LessonBottomBar
        lessonIndex={MOCK_CURRENT_LESSON.lessonIndex}
        totalLessons={MOCK_CURRENT_LESSON.totalLessons}
        onPrev={() => {}}
        onNext={() => {}}
      />
    </div>
  );
}
