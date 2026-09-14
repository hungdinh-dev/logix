export type LessonType = 'video' | 'document' | 'quiz';
export type LessonStatus = 'completed' | 'current' | 'locked' | 'available';

export interface LessonItem {
  readonly id: string;
  readonly title: string;
  readonly duration: string;
  readonly type: LessonType;
  readonly status: LessonStatus;
}

export interface LessonChapter {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly lessons: readonly LessonItem[];
}

export interface TranscriptLine {
  readonly id: string;
  readonly timestamp: string; // "0:32"
  readonly timestampSeconds: number;
  readonly text: string;
}

export interface ResourceFile {
  readonly id: string;
  readonly name: string;
  readonly size: string;
  readonly url: string;
}

export interface DiscussionComment {
  readonly id: string;
  readonly authorName: string;
  readonly authorInitials: string;
  readonly timeAgo: string;
  readonly text: string;
  readonly likes: number;
  readonly replies: number;
}

export interface ChatMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly text: string;
}

export interface PlayerLesson {
  readonly id: string;
  readonly title: string;
  readonly chapterTitle: string;
  readonly chapterNumber: number;
  readonly lessonIndex: number;
  readonly totalLessons: number;
  readonly videoDuration: string; // "12:45"
  readonly videoDurationSeconds: number;
}
