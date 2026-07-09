import { PlayCircle, FileText, HelpCircle, Lock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import type { CourseSection, CourseLesson } from '../../types/course.types';

interface LessonRowProps {
  readonly courseId: string;
  readonly lesson: CourseLesson;
}

function LessonRow({ courseId, lesson }: LessonRowProps) {
  const router = useRouter();
  const Icon = lesson.type === 'video' ? PlayCircle : lesson.type === 'quiz' ? HelpCircle : FileText;

  function handleOpenLesson() {
    if (lesson.locked) return;

    if (lesson.type === 'quiz') {
      router.push(`/lms/quizzes/${lesson.id}`);
      return;
    }

    router.push(`/lms/lessons/${lesson.id}`);
  }

  return (
    <li>
      <button
        type="button"
        onClick={handleOpenLesson}
        disabled={lesson.locked}
        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-t-bg-hover disabled:cursor-not-allowed"
      >
      {lesson.completed ? (
        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
      ) : (
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            lesson.locked ? 'text-t-text-muted' : 'text-t-text-secondary',
          )}
          aria-hidden
        />
      )}
      <span
        className={cn(
          'flex-1 text-sm',
          lesson.locked ? 'text-t-text-muted' : 'text-t-text-secondary',
          lesson.completed && 'line-through text-t-text-muted',
        )}
      >
        {lesson.title}
      </span>
      <span className="shrink-0 text-xs text-t-text-muted">{lesson.duration}</span>
      {lesson.locked && (
        <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-label="Locked" />
      )}
      </button>
    </li>
  );
}

function sectionLessonCount(section: CourseSection): string {
  const count = section.lessons.length;
  return `${count} lesson${count !== 1 ? 's' : ''}`;
}

interface CourseContentAccordionProps {
  readonly courseId: string;
  readonly sections: readonly CourseSection[];
}

export function CourseContentAccordion({ courseId, sections }: CourseContentAccordionProps) {
  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-t-text-primary">Course Content</h2>
        <span className="text-sm text-t-text-muted">
          {sections.length} sections · {totalLessons} lessons
        </span>
      </div>

      <Accordion type="single" collapsible className="rounded-xl border border-border bg-card">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id} className="border-t-border px-4">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex flex-1 items-center justify-between pr-3">
                <span className="text-left text-sm font-medium text-t-text-primary">
                  {section.number}. {section.title}
                </span>
                <span className="shrink-0 text-xs text-t-text-muted">
                  {sectionLessonCount(section)} · {section.totalDuration}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <ul className="space-y-0.5">
                {section.lessons.map((lesson) => (
                  <LessonRow key={lesson.id} courseId={courseId} lesson={lesson} />
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
