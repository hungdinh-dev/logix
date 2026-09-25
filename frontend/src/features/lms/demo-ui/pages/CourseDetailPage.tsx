'use client'

import { useMemo } from 'react'
import { CourseHero } from '../components/course-detail/CourseHero'
import { WhatYouLearnCard } from '../components/course-detail/WhatYouLearnCard'
import { CourseContentAccordion } from '../components/course-detail/CourseContentAccordion'
import { CourseDetailTabs } from '../components/course-detail/CourseDetailTabs'
import { CourseEnrollmentCard } from '../components/course-detail/CourseEnrollmentCard'
import type { CourseDetail, CourseLevel } from '../types/course.types'
import { useCourseDetail } from '@/features/lms/hooks/use-course-detail'
import { useCourseProgress, useEnrollCourse } from '@/features/lms/hooks/use-course-progress'
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
    learningOutcomes: course.learningOutcomes || [
      'Nắm vững các quy chuẩn vệ sinh an toàn và SOP vận hành chuẩn',
      'Thành thạo kỹ thuật và quy trình thao tác máy móc chuyên dụng',
      'Đạt điểm đánh giá tiêu chuẩn qua bài kiểm tra trắc nghiệm cuối khóa',
    ],
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
  const { course: realCourse, isLoading: isCourseLoading, refetch: refetchDetail } = useCourseDetail(courseId)
  const { data: progressData, isLoading: isProgressLoading, refetch: refetchProgress } = useCourseProgress(courseId)
  const enrollMutation = useEnrollCourse()

  const isEnrolled = Boolean(progressData?.enrollment)
  const completionPercentage = progressData?.enrollment?.completionPercentage || 0

  const course: CourseDetail = useMemo(() => {
    if (!realCourse) {
      return getFallbackCourseDetail(courseId)
    }

    const rawModules = progressData?.modules && progressData.modules.length > 0
      ? progressData.modules
      : realCourse.modules || []

    const mappedSections = rawModules.map((m: any, mIdx: number) => {
      const lessons = (m.lessons || []).map((l: any, lIdx: number) => {
        const durMinutes = Math.round(
          (l.duration || l.videoDuration || (l.estimatedReadTime ? l.estimatedReadTime * 60 : 600)) / 60
        )
        const type = (l.lessonType?.toLowerCase() || 'video') as 'video' | 'article' | 'quiz'

        const isLessonCompleted = Boolean(l.isCompleted)
        const isLessonLocked = l.isLocked !== undefined ? l.isLocked : !isEnrolled

        return {
          id: l.id || `les-${mIdx}-${lIdx}`,
          title: l.title,
          duration: `${durMinutes || 5} phút`,
          type,
          locked: isLessonLocked,
          completed: isLessonCompleted,
          status: l.status || (isEnrolled ? 'available' : 'locked'),
        }
      })

      const totalMins = lessons.reduce((acc: number, cur: any) => {
        const m = parseInt(cur.duration) || 10
        return acc + m
      }, 0)

      return {
        id: m.id || `mod-${mIdx}`,
        number: m.sortOrder || mIdx + 1,
        title: m.title,
        totalDuration: `${totalMins} phút`,
        lessons,
      }
    })

    const levelMap: Record<string, CourseLevel> = {
      BEGINNER: 'Beginner',
      INTERMEDIATE: 'Intermediate',
      ADVANCED: 'Advanced',
    }
    const resolvedLevel: CourseLevel =
      (realCourse.level && levelMap[realCourse.level]) ||
      (realCourse.courseType === 'ATTP' ? 'Advanced' : 'Beginner')

    const instructorName =
      realCourse.instructor?.fullName ||
      realCourse.createdByUser?.fullName ||
      'Ban Đào Tạo & R&D Ba Hưng'

    const instructorBio = realCourse.instructor?.email
      ? `Cố vấn chuyên môn & giảng viên phụ trách (${realCourse.instructor.email})`
      : 'Phụ trách tiêu chuẩn chất lượng, quy trình đào tạo và an toàn vận hành.'

    const outcomes =
      realCourse.learningOutcomes && realCourse.learningOutcomes.length > 0
        ? realCourse.learningOutcomes
        : [
          'Nắm vững kiến thức và kỹ năng thực hành theo chuẩn nghiệp vụ LogiX',
          'Thành thạo quy trình thao tác và xử lý tình huống thực tế',
          'Hoàn thành bài đánh giá tiêu chuẩn qua hệ thống bài kiểm tra',
        ]

    const formattedLastUpdated = realCourse.updatedAt
      ? `Tháng ${new Date(realCourse.updatedAt).getMonth() + 1}, ${new Date(realCourse.updatedAt).getFullYear()}`
      : 'Mới cập nhật'

    return {
      id: realCourse.id,
      title: realCourse.title,
      subtitle: realCourse.description || `Chương trình đào tạo chuẩn mã ${realCourse.code}`,
      category: realCourse.category?.name || 'Đào tạo nội bộ',
      instructor: {
        name: instructorName,
        title: 'Giảng viên Chuyên môn LogiX',
        bio: instructorBio,
        coursesCount: 1,
        studentsCount: realCourse._count?.enrollments || 0,
        rating: 5.0,
      },
      duration: `${realCourse.durationDays || 14} ngày`,
      enrolledCount: realCourse._count?.enrollments || 0,
      rating: 5.0,
      reviewCount: 18,
      enrolled: isEnrolled,
      isMandatory: realCourse.isMandatory,
      durationDays: realCourse.durationDays || undefined,
      description:
        realCourse.description || 'Chương trình đào tạo toàn diện trang bị kiến thức và kỹ năng thực tế.',
      level: resolvedLevel,
      language: 'Tiếng Việt',
      lastUpdated: formattedLastUpdated,
      isSponsored: false,
      learningOutcomes: outcomes,
      sections: mappedSections.length > 0 ? mappedSections : getFallbackCourseDetail(courseId).sections,
      reviews: [
        {
          id: 'r1',
          reviewerName: 'Nguyễn Văn An',
          rating: 5,
          date: 'Hôm nay',
          comment: 'Khóa học được cấu trúc rất bài bản, kiến thức thực tế và dễ tiếp thu.',
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
  }, [realCourse, progressData, isEnrolled, courseId])

  // Find the next active/current lesson
  const nextLessonId = useMemo(() => {
    const allLessons = course.sections.flatMap((s) => s.lessons)
    const currentOrIncomplete = allLessons.find((l: any) => l.status === 'current')
      || allLessons.find((l: any) => !l.completed && !l.locked)
      || allLessons[0]
    return currentOrIncomplete?.id || null
  }, [course])

  const handleEnroll = async () => {
    await enrollMutation.mutateAsync(courseId)
    await Promise.all([refetchDetail(), refetchProgress()])
  }

  if (isCourseLoading && !realCourse) {
    return <DetailSkeleton />
  }

  return (
    <div className="min-h-screen bg-t-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Main Content Column — 8 cols */}
          <div className="min-w-0 space-y-6 lg:col-span-8">
            <CourseHero course={course} />
            <CourseContentAccordion
              courseId={course.id}
              sections={course.sections}
              isEnrolled={isEnrolled}
            />
            <WhatYouLearnCard outcomes={course.learningOutcomes} />
            <CourseDetailTabs course={course} />
          </div>

          {/* Right Column — 4 cols sticky sidebar */}
          <aside className="shrink-0 lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <CourseEnrollmentCard
                course={course}
                isEnrolled={isEnrolled}
                completionPercentage={completionPercentage}
                nextLessonId={nextLessonId}
                onEnroll={handleEnroll}
                isEnrolling={enrollMutation.isPending}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
