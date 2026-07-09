export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';
export type QuizStatus = 'passed' | 'failed' | 'retake';
export type CourseStatus = 'in-progress' | 'completed';

export interface StreakDay {
  readonly date: string;
  readonly active: boolean;
}

export interface CourseProgress {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly thumbnailColor: string;
  readonly currentModule: number;
  readonly totalModules: number;
  readonly progressPercent: number;
  readonly lastAccessed: string;
  readonly status: CourseStatus;
}

export interface WeeklyActivity {
  readonly day: string;      // "Mon"
  readonly minutes: number;
  readonly isToday: boolean;
}

export interface Skill {
  readonly id: string;
  readonly name: string;
  readonly level: ProficiencyLevel;
  readonly percent: number;
}

export interface Certificate {
  readonly id: string;
  readonly courseName: string;
  readonly completedDate: string;
  readonly locked: boolean;
}

export interface QuizResult {
  readonly id: string;
  readonly courseName: string;
  readonly quizName: string;
  readonly score: number;
  readonly status: QuizStatus;
  readonly date: string;
}
