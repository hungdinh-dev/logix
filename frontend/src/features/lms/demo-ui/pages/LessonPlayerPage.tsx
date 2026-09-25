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
  ArrowRight,
  Lock,
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
import { DetailSkeleton, LessonPlayerSkeleton } from '@/components/shared/skeletons';
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
import type { LessonChapter, LessonType, TranscriptLine, ResourceFile } from '../types/lesson-player.types';

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
  const [detectedDuration, setDetectedDuration] = useState<number | null>(null);

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
        setBackendLesson(null);
        setBackendCourseProgress(null);
        setCurrentTime(0);
        setMaxWatchedSeconds(0);
        setDetectedDuration(null);
        setIsSignedSop(false);

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

  // Fallback to mock dataset if backend lesson is not available (only for matched mock IDs)
  const mockResult = useMemo(() => {
    return getCourseAndLessonByLessonId(lessonId) || null;
  }, [lessonId]);

  // Computed properties
  const isUsingBackend = Boolean(backendLesson);

  const courseTitle = isUsingBackend
    ? backendCourseProgress?.title || backendLesson?.module?.course?.title || 'Khóa học Đào tạo'
    : mockResult?.course?.title || 'Khóa học Đào tạo';

  const courseId = isUsingBackend
    ? backendCourseProgress?.courseId || backendLesson?.module?.courseId || ''
    : mockResult?.course?.id || '';

  const sectionTitle = isUsingBackend
    ? backendLesson?.module?.title || 'Chương học'
    : mockResult?.section?.title || 'Chương học';

  const lessonTitle = isUsingBackend
    ? backendLesson.title
    : mockResult?.lesson?.title || 'Bài học';

  const lessonTypeRaw = isUsingBackend
    ? backendLesson.lessonType
    : mockResult?.lesson?.type?.toUpperCase();
  const isVideo = lessonTypeRaw === 'VIDEO';
  const isQuiz = lessonTypeRaw === 'QUIZ';
  const isDocument = !isVideo && !isQuiz;

  const videoUrl = isUsingBackend ? backendLesson.videoUrl : undefined;
  const bodyContent = isUsingBackend
    ? backendLesson.bodyHtml || backendLesson.description || ''
    : mockResult?.lesson?.content || '';
  const sopCode = isUsingBackend ? backendLesson.sopCode : undefined;
  const requiresSignature = isUsingBackend ? Boolean(backendLesson.requiresSignature) : false;

  const durationSeconds = detectedDuration || (
    isUsingBackend
      ? backendLesson.videoDuration || (backendLesson.estimatedReadTime ? backendLesson.estimatedReadTime * 60 : 300)
      : 600
  );

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

    if (mockResult) {
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
    }

    return [];
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

  // Dynamic lesson resources from backend or fallback to MOCK_RESOURCES
  const lessonResources: readonly ResourceFile[] = useMemo(() => {
    if (backendLesson?.resources && Array.isArray(backendLesson.resources) && backendLesson.resources.length > 0) {
      return backendLesson.resources.map((r: any) => ({
        id: r.id,
        name: r.title,
        url: r.url,
        type: r.resourceType,
        size: r.fileSizeBytes ? `${Math.round(r.fileSizeBytes / 1024)} KB` : undefined,
        extension: r.fileExtension,
        description: r.description,
      }));
    }
    return MOCK_RESOURCES;
  }, [backendLesson?.resources]);

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const totalLessons = allLessons.length > 0 ? allLessons.length : 1;

  const currentChapter = useMemo(() => {
    return chapters.find((c) => c.lessons.some((l) => l.id === lessonId));
  }, [chapters, lessonId]);

  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
    ? allLessons[currentLessonIndex + 1]
    : null;

  const nextLessonChapter = useMemo(() => {
    if (!nextLesson) return null;
    return chapters.find((c) => c.lessons.some((l) => l.id === nextLesson.id));
  }, [chapters, nextLesson]);

  const isNextChapter = Boolean(
    currentChapter && nextLessonChapter && currentChapter.id !== nextLessonChapter.id
  );

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

      if (requiresSignature && !isSignedSop) {
        toast.warning('⚠️ Vui lòng bấm "Ký Cam Kết Tuân Thủ SOP" trước khi qua bài tiếp theo!');
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
      }

      // 2. Chuyển sang bài tiếp theo hoặc chương tiếp theo
      if (nextLesson) {
        if (isNextChapter && nextLessonChapter) {
          toast.success(`🎉 Hoàn thành ${currentChapter?.title || 'chương'}! Bắt đầu: ${nextLessonChapter.title}`);
        } else {
          toast.success('Đã lưu hoàn thành bài học!');
        }
        router.push(`/lms/lessons/${nextLesson.id}`);
      } else {
        toast.success(`🎉 Xuất sắc! Bạn đã hoàn thành toàn bộ khóa học ${courseTitle}!`);
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

  const isUnenrolledCourse = Boolean(
    backendCourseProgress && backendCourseProgress.enrollment === null
  );

  if (!isLoadingLesson && isUnenrolledCourse) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-card p-6">
        <div className="flex max-w-md flex-col items-center text-center gap-4 p-8 rounded-2xl border border-border bg-background shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">Bạn chưa ghi danh khóa học</h2>
            <p className="text-sm text-muted-foreground">
              Khóa học <strong>{courseTitle}</strong> yêu cầu bạn ghi danh trước khi truy cập nội dung bài học.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full pt-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => router.push(courseId ? `/lms/courses/${courseId}` : '/lms/courses')}
            >
              Về trang khóa học
            </Button>
            <Button
              className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={async () => {
                try {
                  if (courseId) {
                    await api.post(apiRoutes.courses.enroll(courseId));
                    toast.success('Ghi danh thành công! Đang tải lại bài học...');
                    window.location.reload();
                  }
                } catch (e: any) {
                  toast.error(e?.response?.data?.message || 'Ghi danh thất bại');
                }
              }}
            >
              Ghi danh ngay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingLesson) {
    return <LessonPlayerSkeleton />;
  }

  if (!backendLesson && !mockResult) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-card p-6">
        <div className="flex max-w-md flex-col items-center text-center gap-4 p-8 rounded-2xl border border-border bg-background shadow-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">Không tìm thấy bài học</h2>
            <p className="text-sm text-muted-foreground">
              Bài học không tồn tại hoặc đã bị gỡ bỏ khỏi chương trình đào tạo.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={() => router.push('/lms/courses')}
          >
            Quay lại danh mục khóa học
          </Button>
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
                  onDurationDetected={(dur) => setDetectedDuration(dur)}
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

                {/* Article / Reading Completion Action Box */}
                <div className="mt-8 rounded-xl border border-primary/25 bg-primary/5 p-5 dark:border-primary/30 dark:bg-primary/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <h3 className="text-sm sm:text-base font-bold text-foreground">
                          Hoàn thành bài đọc này
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {nextLesson
                          ? isNextChapter
                            ? `Tiếp theo: Bắt đầu ${nextLessonChapter?.title || 'chương mới'} — Bài ${nextLesson.title}`
                            : `Tiếp theo: ${nextLesson.title} (${nextLesson.duration})`
                          : 'Bạn đang ở bài học cuối cùng của khóa học!'}
                      </p>
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={isCompleting || (requiresSignature && !isSignedSop)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 gap-2 shrink-0 shadow-sm"
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang lưu tiến độ...
                        </>
                      ) : !nextLesson ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Hoàn thành khóa học
                        </>
                      ) : isNextChapter ? (
                        <>
                          Qua chương tiếp theo
                          <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Đánh dấu đã học & Tiếp tục
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  {requiresSignature && !isSignedSop && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      ⚠️ Vui lòng bấm &quot;Ký Cam Kết Tuân Thủ SOP&quot; ở trên trước khi bấm hoàn thành bài học.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Lesson View */
              <div className="bg-card border-border rounded-2xl border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-start gap-4 border-b border-border pb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-foreground text-lg sm:text-xl font-bold">{lessonTitle}</h2>
                      {(backendLesson?.progress?.isCompleted || (backendLesson as any)?.isCompleted) && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 text-xs font-semibold gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Đã Đạt
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {backendLesson?.description ||
                        'Bài kiểm tra trắc nghiệm đánh giá kiến thức và quy trình nghiệp vụ đã học trong chương trình.'}
                    </p>
                  </div>
                </div>

                {/* Quiz Requirements Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground font-medium">Điểm đạt yêu cầu</p>
                    <p className="mt-1 text-base font-bold text-foreground font-mono">
                      {backendLesson?.quiz?.passScore ?? 80}%
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground font-medium">Thời gian làm bài</p>
                    <p className="mt-1 text-base font-bold text-foreground font-mono">
                      {backendLesson?.quiz?.timeLimitMinutes
                        ? `${backendLesson.quiz.timeLimitMinutes} phút`
                        : 'Không giới hạn'}
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-muted/30 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground font-medium">Số lần thi tối đa</p>
                    <p className="mt-1 text-base font-bold text-foreground font-mono">
                      {backendLesson?.quiz?.maxAttempts
                        ? `${backendLesson.quiz.maxAttempts} lần`
                        : 'Không giới hạn'}
                    </p>
                  </div>
                </div>

                {/* Progress highlight if previously attempted */}
                {backendLesson?.progress?.quizHighestScore !== undefined &&
                  backendLesson?.progress?.quizHighestScore !== null && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-300/60 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                          Điểm cao nhất của bạn: {backendLesson.progress.quizHighestScore}%
                        </span>
                      </div>
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                        {backendLesson.progress.isCompleted ? 'Đã hoàn thành' : 'Chưa đạt'}
                      </span>
                    </div>
                  )}

                {/* Big Action CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Button
                    onClick={() => router.push(`/lms/quizzes/${backendLesson?.quiz?.id || lessonId}`)}
                    className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 gap-2.5 shadow-sm text-sm"
                  >
                    <PlayCircle className="h-5 w-5" />
                    {backendLesson?.progress?.isCompleted
                      ? 'Làm Lại Bài Kiểm Tra'
                      : 'Bắt Đầu Làm Bài Kiểm Tra'}
                  </Button>

                  {nextLesson && (backendLesson?.progress?.isCompleted || (backendLesson as any)?.isCompleted) && (
                    <Button
                      variant="outline"
                      onClick={handleNext}
                      className="w-full sm:w-auto text-xs py-6 border-border font-semibold gap-2"
                    >
                      Qua bài tiếp theo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
                resources={lessonResources}
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
            lessonId={lessonId}
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
        isNextChapter={isNextChapter}
        isCompleting={isCompleting}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
