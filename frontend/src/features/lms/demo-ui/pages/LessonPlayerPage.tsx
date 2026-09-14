'use client'

import { useState, useEffect, useMemo } from 'react';
import {
  Bookmark,
  Download,
  Share2,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  ShieldAlert,
  HelpCircle,
  PlayCircle,
  FileText,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { api } from '@/lib/axios';
import { apiRoutes } from '@/config/api-routes';
import { LessonOutlinePanel } from '../components/lesson-player/LessonOutlinePanel';
import { LessonVideoPlayer } from '../components/lesson-player/LessonVideoPlayer';
import { LessonContentTabs } from '../components/lesson-player/LessonContentTabs';
import { LessonRightPanel } from '../components/lesson-player/LessonRightPanel';
import { LessonBottomBar } from '../components/lesson-player/LessonBottomBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodePlayground } from '../components/lesson-player/CodePlayground';
import { MarkdownLessonViewer } from '@/features/lms/components/viewer';
import {
  getCourseAndLessonByLessonId,
  JS_INFO_COURSES,
} from '@/features/lms/mocks/javascript-info.mock';
import {
  MOCK_TRANSCRIPT,
  MOCK_RESOURCES,
  MOCK_COMMENTS,
  INITIAL_AI_MESSAGES,
} from '@/features/lms/mocks/lesson-player.mock';
import type { LessonChapter, LessonType, TranscriptLine } from '../types/lesson-player.types';

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
  const lessonId = (params?.id as string) || '';

  const [currentTime, setCurrentTime] = useState(0);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  // Real backend state
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);
  const [backendLesson, setBackendLesson] = useState<any>(null);
  const [backendCourseProgress, setBackendCourseProgress] = useState<any>(null);
  const [isSignedSop, setIsSignedSop] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Auto-collapse panels on smaller screens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) {
        setShowLeftPanel(false);
        setShowRightPanel(false);
      }
    }
  }, []);

  // Fetch real lesson and course outline from backend API
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!lessonId) return;

      try {
        setIsLoadingLesson(true);
        // 1. Lấy chi tiết bài học từ Backend
        const resLesson = await api.get(apiRoutes.lessons.byId(lessonId));
        const lData = resLesson.data?.data;

        if (isMounted && lData) {
          setBackendLesson(lData);
          setIsSignedSop(false);

          // 2. Lấy outline và tiến độ của cả khóa học
          const courseId = lData.module?.courseId;
          if (courseId) {
            try {
              const resProgress = await api.get(`/api/progress/course/${courseId}`);
              if (isMounted && resProgress.data?.data) {
                setBackendCourseProgress(resProgress.data.data);
              }
            } catch (err) {
              console.warn('Lỗi lấy tiến độ khóa học từ backend:', err);
            }
          }
        }
      } catch (err) {
        console.warn('Không tìm thấy bài học trên Backend, chuyển sang Mock fallback:', err);
      } finally {
        if (isMounted) {
          setIsLoadingLesson(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  // Fallback to mock dataset if backend lesson is not available
  const mockResult = useMemo(() => {
    return getCourseAndLessonByLessonId(lessonId) || {
      course: JS_INFO_COURSES[0],
      section: JS_INFO_COURSES[0].sections[0],
      lesson: JS_INFO_COURSES[0].sections[0].lessons[0],
    };
  }, [lessonId]);

  // Computed properties
  const isUsingBackend = Boolean(backendLesson);

  const courseTitle = isUsingBackend
    ? backendCourseProgress?.title || backendLesson?.module?.course?.title || 'Khóa học Đào tạo'
    : mockResult.course.title;

  const courseId = isUsingBackend
    ? backendCourseProgress?.courseId || backendLesson?.module?.courseId || ''
    : mockResult.course.id;

  const sectionTitle = isUsingBackend
    ? backendLesson?.module?.title || 'Chương học'
    : mockResult.section.title;

  const lessonTitle = isUsingBackend ? backendLesson.title : mockResult.lesson.title;

  const lessonTypeRaw = isUsingBackend ? backendLesson.lessonType : mockResult.lesson.type?.toUpperCase();
  const isVideo = lessonTypeRaw === 'VIDEO';
  const isQuiz = lessonTypeRaw === 'QUIZ';
  const isDocument = !isVideo && !isQuiz;

  const videoUrl = isUsingBackend ? backendLesson.videoUrl : undefined;
  const bodyContent = isUsingBackend ? backendLesson.bodyHtml || backendLesson.description || '' : mockResult.lesson.content;
  const sopCode = isUsingBackend ? backendLesson.sopCode : undefined;
  const requiresSignature = isUsingBackend ? Boolean(backendLesson.requiresSignature) : false;

  const durationSeconds = isUsingBackend
    ? backendLesson.videoDuration || (backendLesson.estimatedReadTime ? backendLesson.estimatedReadTime * 60 : 300)
    : 600;

  const durationLabel = `${Math.ceil(durationSeconds / 60)} phút`;

  const [maxWatchedSeconds, setMaxWatchedSeconds] = useState(0);

  useEffect(() => {
    if (backendLesson) {
      const savedPos = (backendLesson as any)?.progress?.lastPositionSeconds || 0;
      setMaxWatchedSeconds(savedPos);
      if (savedPos > 0) {
        setCurrentTime(savedPos);
      }
    }
  }, [backendLesson]);

  const watchPercentage = durationSeconds > 0
    ? Math.min(100, Math.round((Math.max(maxWatchedSeconds, currentTime) / durationSeconds) * 100))
    : 100;
  const isVideoWatchCompleted = watchPercentage >= 90;

  // Build chapter outlines
  const chapters: LessonChapter[] = useMemo(() => {
    if (isUsingBackend && backendCourseProgress?.modules) {
      return backendCourseProgress.modules.map((m: any, idx: number) => ({
        id: m.id,
        number: m.sortOrder || idx + 1,
        title: m.title,
        lessons: (m.lessons || []).map((l: any) => ({
          id: l.id,
          title: l.title,
          duration: `${Math.ceil((l.duration || l.videoDuration || 300) / 60)}m`,
          type: (l.lessonType?.toLowerCase() === 'video'
            ? 'video'
            : l.lessonType?.toLowerCase() === 'quiz'
              ? 'quiz'
              : 'document') as LessonType,
          status: l.id === lessonId
            ? ('current' as const)
            : l.isCompleted
              ? ('completed' as const)
              : l.isLocked
                ? ('locked' as const)
                : ('available' as const),
        })),
      }));
    }

    // Mock fallback chapters
    return mockResult.course.sections.map((s) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      lessons: s.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        type: l.type,
        status: l.id === mockResult.lesson.id ? ('current' as const) : ('available' as const),
      })),
    }));
  }, [isUsingBackend, backendCourseProgress, lessonId, mockResult]);

  // Flattened lessons list for sequential navigation
  const allLessons = useMemo(() => {
    return chapters.flatMap((c) => c.lessons);
  }, [chapters]);

  // Dynamic lesson transcripts from backend (stored in checklistItems) or fallback
  const lessonTranscripts: readonly TranscriptLine[] = useMemo(() => {
    if (backendLesson?.checklistItems) {
      try {
        const parsed = JSON.parse(backendLesson.checklistItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            id: item.id || `tr-${idx}`,
            timestamp: item.timestamp || '00:00',
            timestampSeconds: Number(item.timestampSeconds) || 0,
            text: item.text || item.title || '',
          }));
        }
      } catch {
        // Not a JSON transcript list
      }
    }
    return MOCK_TRANSCRIPT;
  }, [backendLesson?.checklistItems]);

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const totalLessons = allLessons.length > 0 ? allLessons.length : 1;

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      router.push(`/lms/lessons/${prevLesson.id}`);
    }
  };

  const handleNext = async () => {
    try {
      // 0. Guard: Bắt buộc xem tối thiểu 90% thời lượng video trước khi hoàn thành
      if (isVideo && !isVideoWatchCompleted) {
        toast.warning(
          `⚠️ Bạn cần theo dõi tối thiểu 90% thời lượng bài giảng video (Hiện tại: ${watchPercentage}%/90%) trước khi chuyển sang bài tiếp theo!`
        );
        return;
      }

      setIsCompleting(true);

      // 1. Gửi cập nhật tiến độ lên backend nếu đang học bài thực
      if (isUsingBackend) {
        await api.post(apiRoutes.progress.lesson, {
          lessonId,
          isCompleted: true,
          lastPositionSeconds: Math.max(maxWatchedSeconds, currentTime),
        });
        toast.success('Đã lưu hoàn thành bài học!');
      }

      // 2. Chuyển sang bài tiếp theo
      if (currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentLessonIndex + 1];
        if (nextLesson.status === 'locked') {
          toast.info('Đang mở khóa bài học tiếp theo...');
        }
        router.push(`/lms/lessons/${nextLesson.id}`);
      } else {
        toast.success('Chúc mừng! Bạn đã hoàn thành toàn bộ chương trình học!');
        if (courseId) {
          router.push(`/lms/courses/${courseId}`);
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi khi cập nhật tiến độ bài học');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSignSop = async () => {
    setIsSignedSop(true);
    toast.success(`Đã ký cam kết điện tử tuân thủ quy chuẩn ${sopCode || 'SOP'} thành công!`);
    if (isUsingBackend) {
      try {
        await api.post(apiRoutes.progress.lesson, {
          lessonId,
          isCompleted: true,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (isLoadingLesson && !backendLesson && !mockResult.lesson) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-card">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Đang tải nội dung bài học...</p>
        </div>
      </div>
    );
  }

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
            courseId={courseId}
            courseTitle={courseTitle}
            chapters={chapters}
            currentLessonId={lessonId}
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
            {/* Conditional Player / Reader / Quiz */}
            {isVideo ? (
              <div className="space-y-3">
                <LessonVideoPlayer
                  totalDurationSeconds={durationSeconds}
                  totalDurationLabel={durationLabel}
                  currentTimeSeconds={currentTime}
                  maxWatchedSeconds={maxWatchedSeconds}
                  onSeek={(sec) => {
                    setCurrentTime(sec);
                    setMaxWatchedSeconds((prev) => Math.max(prev, sec));
                  }}
                  videoUrl={videoUrl}
                  allowSeeking={(backendLesson as any)?.allowSeeking !== false}
                />

                {/* Video Watch Progress Tracker Badge */}
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border bg-muted/20 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isVideoWatchCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                      }`}
                    />
                    <span className="font-medium text-foreground">
                      Tiến độ theo dõi video: <strong className="font-bold font-mono">{watchPercentage}%</strong> / 90% để qua bài
                    </span>
                  </div>
                  {isVideoWatchCompleted ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 text-[10px]">
                      ✓ Đã đủ điều kiện qua bài
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Cần xem thêm {Math.max(0, 90 - watchPercentage)}% nữa
                    </span>
                  )}
                </div>
              </div>
            ) : isDocument ? (
              <div className="bg-card border-border rounded-xl border p-6 shadow-sm max-w-none space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="space-y-1">
                    <h2 className="text-foreground text-xl font-bold">{lessonTitle}</h2>
                    {sopCode && (
                      <Badge variant="outline" className="text-xs font-semibold text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40">
                        {sopCode} • Quy Chuẩn Vận Hành
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Thời gian đọc: {durationLabel}
                  </span>
                </div>

                {/* Body Content */}
                {bodyContent ? (
                  <div className="space-y-4">
                    {bodyContent.includes('<pre><code>') ? (
                      parseHtmlWithPlaygrounds(bodyContent).map((part, index) => {
                        if (part.type === 'html') {
                          return (
                            <div
                              key={index}
                              className="text-foreground/90 space-y-3 leading-relaxed text-sm sm:text-base prose prose-neutral dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{ __html: part.content || '' }}
                            />
                          );
                        } else {
                          return (
                            <CodePlayground key={index} initialCode={part.code || ''} />
                          );
                        }
                      })
                    ) : (
                      <MarkdownLessonViewer content={bodyContent} />
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Chưa có nội dung văn bản cho bài học này.
                  </p>
                )}

                {/* SOP Electronic Signature Block */}
                {requiresSignature && (
                  <div className="mt-6 rounded-lg border border-amber-300/60 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                          Bắt buộc ký xác nhận tuân thủ SOP
                        </p>
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/70">
                          Theo quy định an toàn và quy trình F&B Ba Hưng, nhân viên cần xác nhận đã đọc, hiểu và cam kết tuân thủ đúng các bước trong tài liệu này.
                        </p>
                        <div className="pt-2">
                          {isSignedSop ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-100/80 px-3 py-1.5 rounded-md dark:bg-emerald-950">
                              <CheckCircle2 className="h-4 w-4" />
                              Đã ký cam kết điện tử thành công
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={handleSignSop}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium gap-1.5"
                            >
                              <FileCheck2 className="h-4 w-4" />
                              Ký Cam Kết Tuân Thủ SOP
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Lesson View */
              <div className="bg-card border-border rounded-xl border p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HelpCircle className="h-7 w-7" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h2 className="text-foreground text-lg font-bold">{lessonTitle}</h2>
                  <p className="text-muted-foreground text-xs">
                    {backendLesson?.description || 'Bài học trắc nghiệm đánh giá kiến thức và quy trình nghiệp vụ đã học.'}
                  </p>
                </div>
                <Button
                  onClick={() => router.push(`/lms/quizzes/${backendLesson?.quiz?.id || lessonId}`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 gap-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  Bắt Đầu Làm Bài Kiểm Tra
                </Button>
              </div>
            )}

            {/* Lesson meta */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-foreground">{lessonTitle}</h1>
                <span className="mt-1 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {sectionTitle}
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
                transcript={lessonTranscripts}
                resources={MOCK_RESOURCES}
                currentTimeSeconds={currentTime}
                onSeek={(sec) => {
                  setCurrentTime(sec);
                  setMaxWatchedSeconds((prev) => Math.max(prev, sec));
                }}
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
        lessonIndex={Math.max(1, currentLessonIndex + 1)}
        totalLessons={totalLessons}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
