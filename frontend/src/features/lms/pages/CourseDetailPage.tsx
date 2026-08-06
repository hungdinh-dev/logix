'use client'

import { CourseHero } from '../components/course-detail/CourseHero';
import { WhatYouLearnCard } from '../components/course-detail/WhatYouLearnCard';
import { CourseContentAccordion } from '../components/course-detail/CourseContentAccordion';
import { CourseDetailTabs } from '../components/course-detail/CourseDetailTabs';
import { CourseEnrollmentCard } from '../components/course-detail/CourseEnrollmentCard';
import type { CourseDetail } from '../types/course.types';

import { JS_INFO_COURSES } from '../mocks/javascript-info.mock';

export function getCourseDetail(courseId: string): CourseDetail {
  const course = JS_INFO_COURSES.find(c => c.id === courseId) || JS_INFO_COURSES[0];
  
  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    category: 'Technical',
    instructor: {
      name: course.instructor.name,
      title: course.instructor.title,
      bio: course.instructor.bio,
      coursesCount: 3,
      studentsCount: course.enrolled,
      rating: course.rating,
    },
    duration: course.duration,
    enrolledCount: course.enrolled,
    rating: course.rating,
    reviewCount: course.reviews,
    enrolled: course.id === '1',
    description: course.subtitle,
    level: 'Beginner',
    language: 'Tiếng Việt',
    lastUpdated: 'Tháng 7, 2026',
    isSponsored: false,
    learningOutcomes: course.learningOutcomes,
    requirements: course.requirements,
    targetAudience: course.targetAudience,
    sections: course.sections.map(s => ({
      id: s.id,
      number: s.number,
      title: s.title,
      totalDuration: `${s.lessons.reduce((acc, l) => {
        const [m, sSec] = l.duration.split(':');
        return acc + parseInt(m || '0', 10);
      }, 0)}m`,
      lessons: s.lessons.map(l => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        type: l.type,
        locked: false,
        completed: false,
      })),
    })),
    reviews: [
      {
        id: 'r1',
        reviewerName: 'Hoàng Nguyễn',
        rating: 5,
        date: 'Tháng 6, 2026',
        comment: 'Bài giảng giải thích rất trực quan, dễ hiểu. Cảm ơn tác giả!',
      },
      {
        id: 'r2',
        reviewerName: 'Trang Phạm',
        rating: 5,
        date: 'Tháng 5, 2026',
        comment: 'Tài liệu cực kỳ đầy đủ. Đọc bản dịch tiếng Việt rất mượt.',
      }
    ],
    ratingBreakdown: [
      { stars: 5, count: 180, percentage: 80 },
      { stars: 4, count: 35, percentage: 15 },
      { stars: 3, count: 5, percentage: 5 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ]
  };
}

export default function CourseDetailPage({ courseId = '1' }: { courseId?: string }) {
  const course = getCourseDetail(courseId);

  return (
    <div className="min-h-screen bg-t-bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left column — 60% */}
          <div className="min-w-0 lg:flex-[3]">
            <CourseHero course={course} />
            <WhatYouLearnCard outcomes={course.learningOutcomes} />
            <CourseContentAccordion courseId={course.id} sections={course.sections} />
            <CourseDetailTabs course={course} />
          </div>

          {/* Right column — 40% sticky */}
          <aside className="shrink-0 lg:flex-[2]">
            <div className="lg:sticky lg:top-24">
              <CourseEnrollmentCard course={course} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
