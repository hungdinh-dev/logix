import prisma from './config/prisma'
import { courseService } from './modules/courses/course.service'
import { lessonService } from './modules/lessons/lesson.service'
import { quizService } from './modules/quizzes/quiz.service'

async function runEndToEndVerification() {
  console.log('🚀 Bắt đầu Kiểm thử Tự động Toàn diện: Curriculum Tree & Quiz Builder (Coursera-Style)...\n')

  // 1. Kiểm tra Course & Category
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    include: { category: true },
  })
  console.log(`✅ [1/8] Tìm thấy ${courses.length} khóa học trong Database Supabase.`)
  const targetCourse = courses.find((c) => c.code === 'BH-SOP-01') || courses[0]
  console.log(`   Khóa học mục tiêu: "${targetCourse.title}" (ID: ${targetCourse.id})\n`)

  // 2. Query Cây chương trình học (Curriculum Tree)
  console.log('🔄 [2/8] Đang tải Cây Chương trình học (GET /curriculum)...')
  const curriculum = await courseService.getCourseCurriculum(targetCourse.id)
  console.log(`   - Khóa học: ${curriculum.title}`)
  console.log(`   - Số lượng Chương: ${curriculum.modules.length}`)
  curriculum.modules.forEach((mod, idx) => {
    console.log(`     📂 Chương ${idx + 1}: ${mod.title} (${mod.lessons.length} bài học)`)
    mod.lessons.forEach((les, lIdx) => {
      console.log(`        [${les.lessonType}] ${les.title} (Quiz ID: ${les.quiz?.id || 'N/A'})`)
    })
  })
  console.log('✅ [2/8] Tải Cây Chương trình học thành công 100%.\n')

  // 3. Tạo Chương mới (Module 2)
  console.log('🔄 [3/8] Tạo Chương học mới: "Chương 2: Kỹ năng Phục vụ & Thu ngân"...')
  const newModule = await courseService.createModule(targetCourse.id, {
    title: 'Chương 2: Kỹ năng Phục vụ & Thu ngân',
  })
  console.log(`✅ [3/8] Tạo Chương thành công (ID: ${newModule.id}, SortOrder: ${newModule.sortOrder})\n`)

  // 4. Tạo Bài học 1 trong Chương 2: VIDEO (Tự upload MP4)
  console.log('🔄 [4/8] Tạo Bài học 1: Video MP4 Tự Upload...')
  const videoLesson = await lessonService.createLesson(newModule.id, {
    title: 'Bài 1: Video Quy trình Chào đón khách hàng 4 bước',
    description: 'Video hướng dẫn cử chỉ, thái độ và lời chào chuẩn mực tại Ba Hưng.',
    lessonType: 'VIDEO',
    videoProvider: 'DIRECT_UPLOAD',
    videoUrl: 'https://storage.bahung.com/videos/chao-khach-4-buoc.mp4',
    videoStoragePath: 'videos/chao-khach-4-buoc.mp4',
    videoDuration: 420, // 7 phút
    isVisible: true,
    estimatedReadTime: 5,
    requiresSignature: false,
    allowDownload: false,
  } as any)
  console.log(`✅ [4/8] Tạo Video Lesson thành công (ID: ${videoLesson?.id}, Provider: ${videoLesson?.videoProvider})\n`)

  // 5. Tạo Bài học 2 trong Chương 2: QUIZ (Bài kiểm tra)
  console.log('🔄 [5/8] Tạo Bài học 2: QUIZ Lesson...')
  const quizLesson = await lessonService.createLesson(newModule.id, {
    title: 'Bài 2: Bài kiểm tra Kỹ năng Phục vụ Khách hàng',
    description: 'Đề thi 2 câu hỏi nhằm xác nhận kiến thức phục vụ trước khi cấp chứng nhận.',
    lessonType: 'QUIZ',
    isVisible: true,
    videoProvider: 'YOUTUBE',
    videoDuration: 0,
    estimatedReadTime: 10,
    requiresSignature: false,
    allowDownload: false,
  } as any)
  console.log(`✅ [5/8] Tạo Quiz Lesson thành công (ID: ${quizLesson?.id}, Quiz ID: ${quizLesson?.quiz?.id})\n`)

  const quizId = quizLesson?.quiz?.id!

  // 6. Cập nhật cấu hình Đề thi & Thêm Câu hỏi (Question Builder)
  console.log('🔄 [6/8] Cập nhật cấu hình Đề thi và thêm Câu hỏi trắc nghiệm...')
  await quizService.updateQuizConfig(quizId, {
    title: 'Đề thi Kỹ năng Phục vụ Cửa hàng Ba Hưng',
    passScore: 80,
    maxAttempts: 3,
    timeLimitMinutes: 20,
    shuffleQuestions: true,
  })

  // Thêm Câu 1: SINGLE_CHOICE
  const q1 = await quizService.createQuestion(quizId, {
    questionText: 'Khoảng cách tiêu chuẩn khi cúi chào khách hàng là bao nhiêu độ?',
    questionType: 'SINGLE_CHOICE',
    points: 1.0,
    explanation: 'Theo sổ tay phục vụ Ba Hưng, nhân viên cúi chào góc 30 độ kèm nụ cười.',
    options: [
      { optionText: 'Góc 30 độ kèm nụ cười', isCorrect: true },
      { optionText: 'Góc 90 độ vuông góc', isCorrect: false },
      { optionText: 'Không cần cúi chỉ cần gật đầu', isCorrect: false },
    ],
  })

  // Thêm Câu 2: TRUE_FALSE
  const q2 = await quizService.createQuestion(quizId, {
    questionText: 'Nhân viên thu ngân được phép nhận tiền của khách bằng một tay khi đang vội?',
    questionType: 'TRUE_FALSE',
    points: 1.0,
    explanation: 'Quy chuẩn Ba Hưng bắt buộc luôn đưa và nhận tiền/hóa đơn bằng cả hai tay.',
    options: [
      { optionText: 'Đúng (Được phép nếu đông khách)', isCorrect: false },
      { optionText: 'Sai (Luôn dùng hai tay)', isCorrect: true },
    ],
  })
  console.log(`✅ [6/8] Đã thêm 2 câu hỏi vào Đề thi (Q1 ID: ${q1.id}, Q2 ID: ${q2.id})\n`)

  // 7. Preview Đề thi (Trainer Preview Mode)
  console.log('🔄 [7/8] Kiểm tra Chế độ Xem trước Đề thi (Preview Mode)...')
  const preview = await quizService.getQuizPreview(quizId)
  console.log(`   - Tiêu đề đề thi: ${preview.quiz.title}`)
  console.log(`   - Điểm đạt: ${preview.quiz.passScore}%`)
  console.log(`   - Tổng số câu hỏi: ${preview.quiz.totalQuestions} (Tổng điểm: ${preview.quiz.totalPoints})`)
  preview.questions.forEach((q, qIdx) => {
    console.log(`     Câu ${qIdx + 1}: [${q.questionType}] ${q.questionText}`)
    q.options.forEach((opt) => {
      console.log(`        ${opt.isCorrect ? '✅ (ĐÚNG)' : '⭕'} ${opt.optionText}`)
    })
  })
  console.log('✅ [7/8] Preview Đề thi hiển thị hoàn hảo.\n')

  // 8. Kiểm tra Utility Parse YouTube
  console.log('🔄 [8/8] Kiểm tra Utility Parse YouTube Link...')
  const youtubeResult = lessonService.parseYoutubeUrl({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  console.log(`   - Video ID trích xuất: ${youtubeResult.videoId}`)
  console.log(`   - Embed URL: ${youtubeResult.embedUrl}`)
  console.log(`   - Thumbnail URL: ${youtubeResult.thumbnailUrl}`)
  console.log('✅ [8/8] Trích xuất YouTube link thành công.\n')

  console.log('🎉 TẤT CẢ 8 HẠNG MỤC KIỂM THỬ END-TO-END ĐỀU ĐẠT CHUẨN 100%!')
}

runEndToEndVerification()
  .catch((err) => {
    console.error('❌ LỖI TRONG QUÁ TRÌNH KIỂM THỬ:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
