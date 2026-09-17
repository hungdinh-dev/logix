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

export interface BackendCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    courses: number;
  };
}

export interface BackendLesson {
  id: string;
  moduleId: string;
  title: string;
  lessonType: 'VIDEO' | 'PDF' | 'RICHTEXT' | 'CHECKLIST';
  videoUrl?: string | null;
  documentUrl?: string | null;
  bodyHtml?: string | null;
  checklistItems?: string | null;
  sopCode?: string | null;
  sopType?: string | null;
  requiresSignature: boolean;
  durationSeconds: number;
  allowDownload: boolean;
  isVisible: boolean;
  sortOrder: number;
}

export interface BackendCourseModule {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  lessons: BackendLesson[];
}

export interface BackendCourse {
  id: string;
  code: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  categoryId: string;
  category?: BackendCategory;
  courseType: 'STANDARD' | 'ATTP' | 'ONBOARDING';
  isMandatory: boolean;
  durationDays?: number;
  progressionMode: 'FREE' | 'LINEAR_LESSON' | 'LINEAR_MODULE';
  targetPositionId?: string | null;
  targetPosition?: { id: string; positionCode: string; positionName: string } | null;
  targetDepartmentId?: string | null;
  targetDepartment?: { id: string; deptCode: string; deptName: string } | null;
  targetStoreId?: string | null;
  targetStore?: { id: string; storeCode: string; storeName: string } | null;
  targetEmploymentStatus?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isActive: boolean;
  modules?: BackendCourseModule[];
  _count?: {
    enrollments: number;
  };
  createdBy?: string | null;
  createdByUser?: {
    id: string;
    fullName: string;
    email?: string | null;
    employeeCode?: string | null;
  } | null;
  updatedBy?: string | null;
  updatedByUser?: {
    id: string;
    fullName: string;
    email?: string | null;
    employeeCode?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  readonly id: string;
  readonly code?: string;
  readonly title: string;
  readonly category: string;
  readonly instructor: CourseInstructor;
  readonly duration: string;
  readonly enrolledCount: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly enrolled: boolean;
  readonly isMandatory?: boolean;
  readonly durationDays?: number;
  readonly progressionMode?: 'FREE' | 'LINEAR_LESSON' | 'LINEAR_MODULE';
  readonly status?: string;
  readonly thumbnailUrl?: string | null;
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
