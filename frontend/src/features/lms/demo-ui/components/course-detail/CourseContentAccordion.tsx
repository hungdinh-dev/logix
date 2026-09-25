'use client'

import Link from 'next/link';
import { PlayCircle, FileText, HelpCircle, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CourseSection, CourseLesson } from '../../types/course.types';

interface LessonRowProps {
  readonly courseId: string;
  readonly lesson: CourseLesson;
  readonly isEnrolled?: boolean;
}

function LessonRow({ courseId, lesson, isEnrolled }: LessonRowProps) {
  const Icon = lesson.type === 'video' ? PlayCircle : lesson.type === 'quiz' ? HelpCircle : FileText;
  const targetUrl = `/lms/lessons/${lesson.id}`;
  const isLocked = lesson.locked || !isEnrolled;

  const content = (
    <>
      {lesson.completed ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
      ) : (
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            isLocked ? 'text-muted-foreground/60' : 'text-primary',
          )}
          aria-hidden
        />
      )}
      <span
        className={cn(
          'flex-1 text-sm font-medium',
          isLocked ? 'text-muted-foreground' : 'text-foreground',
          lesson.completed && 'text-muted-foreground line-through opacity-80',
        )}
      >
        {lesson.title}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">{lesson.duration}</span>
      {isLocked && (
        <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-label="Bị khóa" />
      )}
    </>
  );

  return (
    <li>
      {isLocked ? (
        <div
          title={!isEnrolled ? 'Vui lòng ghi danh khóa học để bắt đầu học bài này' : 'Hoàn thành bài trước để mở bài này'}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-muted-foreground bg-muted/20 cursor-not-allowed border border-transparent select-none"
        >
          {content}
        </div>
      ) : (
        <Link
          href={targetUrl}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/60 hover:text-primary cursor-pointer border border-transparent hover:border-border/60"
        >
          {content}
        </Link>
      )}
    </li>
  );
}

function sectionLessonCount(section: CourseSection): string {
  const count = section.lessons.length;
  return `${count} bài học`;
}

interface CourseContentAccordionProps {
  readonly courseId: string;
  readonly sections: readonly CourseSection[];
  readonly isEnrolled?: boolean;
}

export function CourseContentAccordion({ courseId, sections, isEnrolled }: CourseContentAccordionProps) {
  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const completedLessons = sections.reduce(
    (sum, s) => sum + s.lessons.filter((l) => l.completed).length,
    0
  );

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Card Header Bar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-foreground">Nội dung khóa học</h2>
          {!isEnrolled && (
            <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40">
              🔒 Chưa ghi danh
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {sections.length} phần · {totalLessons} bài học
          {isEnrolled && ` · Đã hoàn thành ${completedLessons}/${totalLessons} bài`}
        </span>
      </div>

      {!isEnrolled && (
        <div className="flex items-center gap-2.5 border-b border-amber-200/60 bg-amber-50/50 px-6 py-2.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Giáo trình đang ở chế độ xem mục lục. <strong>Ghi danh khóa học</strong> ở khung bên phải để mở khóa toàn bộ bài học.
          </span>
        </div>
      )}

      <Accordion type="single" collapsible defaultValue={sections[0]?.id} className="w-full">
        {sections.map((section, idx) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className={cn(
              "border-border px-6",
              idx === sections.length - 1 && "border-b-0"
            )}
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex flex-1 items-center justify-between pr-3">
                <span className="text-left text-sm font-semibold text-foreground">
                  {section.number}. {section.title}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {sectionLessonCount(section)} · {section.totalDuration}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <ul className="space-y-1">
                {section.lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    courseId={courseId}
                    lesson={lesson}
                    isEnrolled={isEnrolled}
                  />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
