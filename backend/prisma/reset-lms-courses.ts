import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetLmsCourses() {
  console.log('🧹 Bắt đầu dọn dẹp dữ liệu khóa học cũ (Giữ nguyên Phòng ban, Nhân viên, Vai trò & Danh mục)...')

  // 1. Xóa Enrollment & Quiz Attempts
  await prisma.quizAttemptOption.deleteMany({})
  await prisma.quizAttemptQuestion.deleteMany({})
  await prisma.quizAttempt.deleteMany({})
  await prisma.lessonProgress.deleteMany({})
  await prisma.courseEnrollment.deleteMany({})
  await prisma.userCertificate.deleteMany({})
  await prisma.lmsActivityLog.deleteMany({})

  // 2. Xóa Quiz & Questions & Options
  await prisma.quizQuestionOption.deleteMany({})
  await prisma.quizQuestion.deleteMany({})
  await prisma.quiz.deleteMany({})

  // 3. Xóa Lessons & Modules
  await prisma.lesson.deleteMany({})
  await prisma.courseModule.deleteMany({})

  // 4. Xóa Courses
  await prisma.course.deleteMany({})

  // 5. Xóa Audit logs của khóa học
  await prisma.auditLog.deleteMany({
    where: {
      tableName: {
        in: ['crs_courses', 'crs_modules', 'crs_lessons'],
      },
    },
  })

  console.log('✅ Đã dọn dẹp sạch sẽ toàn bộ dữ liệu khóa học cũ!')
}

resetLmsCourses()
  .catch((e) => {
    console.error('❌ Lỗi khi dọn dẹp:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
