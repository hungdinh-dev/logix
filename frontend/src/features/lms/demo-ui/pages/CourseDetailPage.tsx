'use client'

import { useMemo } from 'react'
import { CourseHero } from '../components/course-detail/CourseHero'
import { WhatYouLearnCard } from '../components/course-detail/WhatYouLearnCard'
import { CourseContentAccordion } from '../components/course-detail/CourseContentAccordion'
import { CourseDetailTabs } from '../components/course-detail/CourseDetailTabs'
import { CourseEnrollmentCard } from '../components/course-detail/CourseEnrollmentCard'
import type { CourseDetail } from '../types/course.types'
import { useCourseDetail } from '@/features/lms/hooks/use-course-detail'
import { JS_INFO_COURSES } from '@/features/lms/mocks/javascript-info.mock'
import { DetailSkeleton } from '@/components/shared/skeletons'

export function getFallbackCourseDetail(courseId: string): CourseDetail {
  const course = JS_INFO_COURSES.find((c) => c.id === courseId) || JS_INFO_COURSES[0]

  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    category: 'Nghiệp vụ Đào tạo',
    instructor: {
      name: course.instructor.name || 'Ban Đào Tạo Ba Hưng',
      title: course.instructor.title || 'Giảng viên Chuyên môn',
      bio: course.instructor.bio || 'Chuyên gia đào tạo quy trình & an toàn vận hành',
      coursesCount: 5,
      studentsCount: course.enrolled || 120,
      rating: 4.9,
    },
    duration: course.duration,
    enrolledCount: course.enrolled,
    rating: 4.9,
    reviewCount: 42,
    enrolled: true,
    description: course.subtitle,
    level: 'Beginner',
    language: 'Tiếng Việt',
    lastUpdated: 'Tháng 8, 2026',
    isSponsored: false,
    learningOutcomes: [
      'Nắm vững các quy chuẩn vệ sinh an toàn và SOP vận hành chuẩn',
      'Thành thạo kỹ thuật và quy trình thao tác máy móc chuyên dụng',
      'Đạt điểm đánh giá tiêu chuẩn qua bài kiểm tra trắc nghiệm cuối khóa',
    ],
    requirements: ['Nhân sự mới onboard hoặc nhân viên định kỳ cập nhật kiến thức'],
    targetAudience: ['Toàn bộ nhân sự thuộc khối cửa hàng, xưởng sản xuất và vận hành'],
    sections: [
      {
        id: 'sec-1',
        number: 1,
        title: 'Phần 1: Chuẩn bị & Nguyên tắc Vệ sinh An toàn',
        totalDuration: '23 phút',
        lessons: [
          {
            id: 'les-fb-1',
            title: 'Bài 1: Quy định bảo hộ lao động và vệ sinh cá nhân 6 bước',
            duration: '8 phút',
            type: 'document',
            locked: false,
            completed: false,
          },
          {
            id: 'les-fb-2',
            title: 'Bài 2: Video hướng dẫn tiệt trùng máy làm kem Taylor C712',
            duration: '15 phút',
            type: 'video',
            locked: false,
            completed: false,
          },
        ],
      },
      {
        id: 'sec-2',
        number: 2,
        title: 'Phần 2: Quy trình Phối trộn & Định lượng Nguyên Liệu',
        totalDuration: '32 phút',
        lessons: [
          {
            id: 'les-fb-3',
            title: 'Bài 3: Tỷ lệ pha bột nền kem và sữa tươi thanh trùng chuẩn Ba Hưng',
            duration: '12 phút',
            type: 'video',
            locked: false,
            completed: false,
          },
          {
            id: 'les-fb-4',
            title: 'Bài 4: Bài kiểm tra đánh giá kiến thức An toàn & Vận hành',
            duration: '20 phút',
            type: 'quiz',
            locked: false,
            completed: false,
          },
        ],
      },
    ],
    reviews: [
      {
        id: 'r1',
        reviewerName: 'Nguyễn Văn An',
        rating: 5,
        date: 'Hôm nay',
        comment: 'Bài giảng giải thích rất trực quan, các video thực hành rõ ràng!',
      },
      {
        id: 'r2',
        reviewerName: 'Trần Thị Bích',
        rating: 5,
        date: 'Tuần trước',
        comment: 'Tài liệu chi tiết, các câu hỏi trắc nghiệm sát với thực tế vận hành.',
      },
    ],
    ratingBreakdown: [
      { stars: 5, count: 38, percentage: 90 },
      { stars: 4, count: 4, percentage: 10 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ],
  }
}

export default function CourseDetailPage({ courseId = '1' }: { courseId?: string }) {
  const { course: realCourse, isLoading } = useCourseDetail(courseId)

  const course: CourseDetail = useMemo(() => {
    if (!realCourse) {
      return getFallbackCourseDetail(courseId)
    }

    const mappedSections = (realCourse.modules || []).map((m: any, mIdx: number) => {
      const lessons = (m.lessons || []).map((l: any, lIdx: number) => {
        const durMinutes = Math.round(
          (l.videoDuration || (l.estimatedReadTime ? l.estimatedReadTime * 60 : 600)) / 60
        )
        const type = (l.lessonType?.toLowerCase() || 'video') as 'video' | 'article' | 'quiz'

        return {
          id: l.id || `les-${mIdx}-${lIdx}`,
          title: l.title,
          duration: `${durMinutes} phút`,
          type,
          locked: false,
          completed: false,
        }
      })

      const totalMins = lessons.reduce((acc: number, cur: any) => {
        const m = parseInt(cur.duration) || 10
        return acc + m
      }, 0)

      return {
        id: m.id || `mod-${mIdx}`,
        number: mIdx + 1,
        title: m.title,
        totalDuration: `${totalMins} phút`,
        lessons,
      }
    })

    return {
      id: realCourse.id,
      title: realCourse.title,
      subtitle: realCourse.description || `Chương trình đào tạo chuẩn mã ${realCourse.code}`,
      category: realCourse.category?.name || 'Đào tạo nội bộ',
      instructor: {
        name: 'Ban Đào Tạo & R&D Ba Hưng',
        title: 'Giảng viên chuyên môn Ba Hưng LMS',
        bio: 'Phụ trách tiêu chuẩn chất lượng, quy trình vận hành chuỗi và an toàn vệ sinh.',
        coursesCount: 6,
        studentsCount: realCourse._count?.enrollments || 120,
        rating: 4.9,
      },
      duration: `${realCourse.durationDays || 14} ngày`,
      enrolledCount: realCourse._count?.enrollments || 120,
      rating: 4.9,
      reviewCount: 28,
      enrolled: true,
      description:
        realCourse.description || 'Chương trình đào tạo toàn diện trang bị kiến thức và kỹ năng thực tế.',
      level: realCourse.courseType === 'ATTP' ? 'Advanced' : 'Beginner',
      language: 'Tiếng Việt',
      lastUpdated: 'Tháng 8, 2026',
      isSponsored: false,
      learningOutcomes: [
        'Hiểu rõ và tuân thủ đúng quy chuẩn SOP và vệ sinh an toàn',
        'Nắm chắc kỹ thuật thao tác máy móc và định lượng nguyên vật liệu',
        'Hoàn thành bài kiểm tra trắc nghiệm đánh giá năng lực đạt chuẩn công ty',
      ],
      requirements: ['Nhân sự thuộc các chi nhánh cửa hàng, bar, bếp và xưởng sản xuất'],
      targetAudience: ['Toàn bộ nhân sự thuộc khối vận hành và sản xuất F&B'],
      sections: mappedSections.length > 0 ? mappedSections : getFallbackCourseDetail(courseId).sections,
      reviews: [
        {
          id: 'r1',
          reviewerName: 'Nguyễn Văn An',
          rating: 5,
          date: 'Hôm nay',
          comment: 'Khóa học được cấu trúc rất bài bản, video chi tiết!',
        },
        {
          id: 'r2',
          reviewerName: 'Trần Thị Bích',
          rating: 5,
          date: '3 ngày trước',
          comment: 'Nội dung cập nhật đúng thực tế thao tác tại cửa hàng.',
        },
      ],
      ratingBreakdown: [
        { stars: 5, count: 25, percentage: 90 },
        { stars: 4, count: 3, percentage: 10 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ],
    }
  }, [realCourse, courseId])

  if (isLoading && !realCourse) {
    return <DetailSkeleton />
  }

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
  )
}
