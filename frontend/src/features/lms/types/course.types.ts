export const COURSE_CATEGORIES = [
  'All',
  'Leadership',
  'Compliance',
  'Technical',
  'Soft Skills',
  'Onboarding',
] as const;

export type CategoryFilter = (typeof COURSE_CATEGORIES)[number];
export type CourseCategory = Exclude<CategoryFilter, 'All'>;
export type SortOption = 'most-popular' | 'newest' | 'a-z';
export type ViewMode = 'grid' | 'list';

export interface CourseInstructor {
  readonly name: string;
}

export interface Course {
  readonly id: string;
  readonly title: string;
  readonly category: CourseCategory;
  readonly instructor: CourseInstructor;
  readonly duration: string;
  readonly enrolledCount: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly enrolled: boolean;
}

// ── Course Detail ──────────────────────────────────────────────────────────────

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseLesson {
  readonly id: string;
  readonly title: string;
  readonly duration: string;
  readonly type: 'video' | 'document' | 'quiz';
  readonly locked: boolean;
  readonly completed: boolean;
}

export interface CourseSection {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly lessons: readonly CourseLesson[];
  readonly totalDuration: string;
}

export interface CourseReview {
  readonly id: string;
  readonly reviewerName: string;
  readonly rating: number;
  readonly date: string;
  readonly comment: string;
}

export interface RatingBreakdown {
  readonly stars: 1 | 2 | 3 | 4 | 5;
  readonly count: number;
  readonly percentage: number;
}

export interface CourseInstructorProfile extends CourseInstructor {
  readonly title: string;
  readonly bio: string;
  readonly coursesCount: number;
  readonly studentsCount: number;
  readonly rating: number;
}

export interface CourseDetail extends Omit<Course, 'instructor'> {
  readonly subtitle: string;
  readonly description: string;
  readonly level: CourseLevel;
  readonly language: string;
  readonly lastUpdated: string;
  readonly price?: number;
  readonly isSponsored: boolean;
  readonly learningOutcomes: readonly string[];
  readonly requirements: readonly string[];
  readonly targetAudience: readonly string[];
  readonly sections: readonly CourseSection[];
  readonly instructor: CourseInstructorProfile;
  readonly reviews: readonly CourseReview[];
  readonly ratingBreakdown: readonly RatingBreakdown[];
}
