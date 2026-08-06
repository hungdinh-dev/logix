'use client'

import { useState, useEffect } from 'react';
import { Bookmark, Download, Share2, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LessonOutlinePanel } from '../components/lesson-player/LessonOutlinePanel';
import { LessonVideoPlayer } from '../components/lesson-player/LessonVideoPlayer';
import { LessonContentTabs } from '../components/lesson-player/LessonContentTabs';
import { LessonRightPanel } from '../components/lesson-player/LessonRightPanel';
import { LessonBottomBar } from '../components/lesson-player/LessonBottomBar';
import { Button } from '@/components/ui/button';
import { CodePlayground } from '../components/lesson-player/CodePlayground';
import {
  getCourseAndLessonByLessonId,
  JS_INFO_COURSES,
} from '../mocks/javascript-info.mock';
import {
  MOCK_TRANSCRIPT,
  MOCK_RESOURCES,
  MOCK_COMMENTS,
  INITIAL_AI_MESSAGES,
} from '../mocks/lesson-player.mock';

function decodeHtmlEntities(str: string) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function parseHtmlWithPlaygrounds(html: string) {
  const parts = [];
  const regex = /<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'html',
        content: html.substring(lastIndex, match.index),
      });
    }

    parts.push({
      type: 'code',
      code: decodeHtmlEntities(match[1].trim()),
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < html.length) {
    parts.push({
      type: 'html',
      content: html.substring(lastIndex),
    });
  }

  return parts;
}

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = (params?.id as string) || 'l11';
  const [currentTime, setCurrentTime] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  // Auto-collapse panels on smaller screens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) {
        setShowLeftPanel(false);
        setShowRightPanel(false);
      }
    }
  }, []);

  const result = getCourseAndLessonByLessonId(lessonId);
  const course = result?.course || JS_INFO_COURSES[0];
  const section = result?.section || course.sections[0];
  const currentLesson = result?.lesson || section.lessons[0];

  const chapters = course.sections.map((s) => ({
    id: s.id,
    number: s.number,
    title: s.title,
    lessons: s.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      type: l.type,
      status: l.id === currentLesson.id ? ('current' as const) : ('available' as const),
    })),
  }));

  const allLessons = course.sections.flatMap((s) => s.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const totalLessons = allLessons.length;

  const [minStr, secStr] = currentLesson.duration.split(':');
  const totalDurationSeconds = parseInt(minStr || '0', 10) * 60 + parseInt(secStr || '0', 10);

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      router.push(`/lms/lessons/${prevLesson.id}`);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      router.push(`/lms/lessons/${nextLesson.id}`);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-card">
      {/* 3-column body (full height minus bottom bar) */}
      <div className="flex flex-1 overflow-hidden pb-16 relative">
        {/* LEFT — Course outline */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out flex h-full shrink-0 overflow-hidden border-r border-border",
            showLeftPanel ? "w-[280px] opacity-100" : "w-0 opacity-0 pointer-events-none"
          )}
        >
          <LessonOutlinePanel
            courseId={course.id}
            courseTitle={course.title}
            chapters={chapters}
            currentLessonId={currentLesson.id}
            onClose={() => setShowLeftPanel(false)}
          />
        </div>

        {/* Floating Expand Tab (Left) */}
        <button
          type="button"
          onClick={() => setShowLeftPanel(true)}
          className={cn(
            "fixed left-0 top-1/2 -translate-y-1/2 z-40 flex h-20 w-8 items-center justify-center rounded-r-md border border-l-0 border-border bg-card text-muted-foreground shadow-md hover:text-foreground hover:bg-muted/50 transition-all duration-300 ease-in-out",
            showLeftPanel ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
          )}
          aria-label="Open Course Outline"
          title="Mở Outline bài học"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* CENTER — Main content */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-6 py-5">
            {/* Conditional Player/Reader/Quiz */}
            {currentLesson.type === 'video' ? (
              <LessonVideoPlayer
                totalDurationSeconds={totalDurationSeconds}
                totalDurationLabel={currentLesson.duration}
                currentTimeSeconds={currentTime}
                onSeek={setCurrentTime}
              />
            ) : currentLesson.type === 'document' ? (
              <div className="bg-card border-border rounded-xl border p-6 shadow-none max-w-none">
                <h2 className="text-foreground text-lg font-bold mb-4">{currentLesson.title}</h2>
                <div className="space-y-4">
                  {parseHtmlWithPlaygrounds(currentLesson.content || '').map((part, index) => {
                    if (part.type === 'html') {
                      return (
                        <div
                          key={index}
                          className="text-foreground/90 space-y-4 leading-relaxed"
                          style={{ fontSize: 'var(--lms-reader-font-size, 16px)' }}
                          dangerouslySetInnerHTML={{ __html: part.content || '' }}
                        />
                      );
                    } else {
                      return (
                        <CodePlayground key={index} initialCode={part.code || ''} />
                      );
                    }
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-card border-border rounded-xl border p-6 shadow-none flex flex-col items-center justify-center min-h-[250px]">
                <h2 className="text-foreground text-lg font-bold mb-2">{currentLesson.title}</h2>
                <p className="text-muted-foreground text-sm mb-4">Bài học này là bài trắc nghiệm để đánh giá kiến thức.</p>
                <Button onClick={() => router.push(`/lms/quizzes/${currentLesson.id}`)}>
                  Bắt đầu làm Quiz
                </Button>
              </div>
            )}

            {/* Lesson meta */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-foreground">{currentLesson.title}</h1>
                <span className="mt-1 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {section.title}
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
        <div
          className={cn(
            "transition-all duration-300 ease-in-out flex h-full shrink-0 overflow-hidden",
            showRightPanel ? "w-[320px] opacity-100" : "w-0 opacity-0 pointer-events-none"
          )}
        >
          <LessonRightPanel
            comments={MOCK_COMMENTS}
            initialAiMessages={INITIAL_AI_MESSAGES}
            onClose={() => setShowRightPanel(false)}
          />
        </div>

        {/* Floating Expand Tab */}
        <button
          type="button"
          onClick={() => setShowRightPanel(true)}
          className={cn(
            "fixed right-0 top-1/2 -translate-y-1/2 z-40 flex h-20 w-8 items-center justify-center rounded-l-md border border-r-0 border-border bg-card text-muted-foreground shadow-md hover:text-foreground hover:bg-muted/50 transition-all duration-300 ease-in-out",
            showRightPanel ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
          )}
          aria-label="Open Discussion & AI Assistant"
          title="Mở Discussion & AI"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Fixed bottom bar */}
      <LessonBottomBar
        lessonIndex={currentLessonIndex + 1}
        totalLessons={totalLessons}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
