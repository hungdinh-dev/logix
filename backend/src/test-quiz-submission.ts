import prisma from './config/prisma'
import { quizService } from './modules/quizzes/quiz.service'

async function runQuizVerification() {
  console.log('🚀 [QA-QC-Agent] Bắt đầu Kiểm thử Tự động: Real Quiz Engine & Progress Integration...\n')

  // 1. Tìm tài khoản người dùng mẫu
  let student = await prisma.user.findFirst({
    where: { email: 'student@bahung.com' },
  })

  if (!student) {
    student = await prisma.user.findFirst()
  }

  if (!student) {
    throw new Error('Không tìm thấy tài khoản người dùng nào trong Database!')
  }
  console.log(`✅ [1/6] Học viên kiểm thử: ${student.fullName} (${student.email}, ID: ${student.id})`)

  // 2. Tìm bài học Quiz trong Khóa học Làm Kem (BH-SX-01) hoặc SOP
  const quizLesson = await prisma.lesson.findFirst({
    where: {
      lessonType: 'QUIZ',
      quiz: { isNot: null },
    },
    include: {
      quiz: {
        include: {
          questions: {
            include: { options: true },
          },
        },
      },
      module: {
        include: { course: true },
      },
    },
  })

  if (!quizLesson || !quizLesson.quiz) {
    throw new Error('Không tìm thấy bài học Quiz nào trong Database!')
  }

  const quiz = quizLesson.quiz
  console.log(`✅ [2/6] Tìm thấy Quiz: "${quiz.title}" (Khóa học: ${quizLesson.module.course.title})`)
  console.log(`       - Lesson ID: ${quizLesson.id}`)
  console.log(`       - Quiz ID: ${quiz.id}`)
  console.log(`       - Pass Score: ${quiz.passScore}%, Max Attempts: ${quiz.maxAttempts}, Questions: ${quiz.questions.length}`)

  // Đảm bảo học viên đã ghi danh và làm sạch trạng thái bài test để test được độc lập (idempotent)
  await prisma.quizAttempt.deleteMany({
    where: {
      userId: student.id,
      quizId: quiz.id,
    },
  })
  await prisma.lessonProgress.deleteMany({
    where: {
      userId: student.id,
      lessonId: quizLesson.id,
    },
  })

  await prisma.courseEnrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: quizLesson.module.courseId,
      },
    },
    update: { status: 'ENROLLED', completionPercentage: 0 },
    create: {
      userId: student.id,
      courseId: quizLesson.module.courseId,
      status: 'ENROLLED',
      completionPercentage: 0,
    },
  })

  // 3. Test API getQuizForTake (Bảo mật - Chống lộ đáp án DevTools)
  console.log('\n🔄 [3/6] Kiểm thử getQuizForTake (Kiểm tra an toàn bảo mật dữ liệu)...')
  const takeData = await quizService.getQuizForTake(student.id, quizLesson.id)
  console.log(`       - Lấy đề thi thành công theo Lesson ID: ${takeData.quiz.title}`)
  console.log(`       - Số lượng câu hỏi: ${takeData.questions.length}`)
  console.log(`       - Số lượt thi đã làm: ${takeData.studentStatus.attemptCount}, Lượt còn lại: ${takeData.studentStatus.remainingAttempts}`)

  // Security assertion: Không được rò rỉ `isCorrect` trong options
  let hasLeakedAnswer = false
  for (const q of takeData.questions) {
    for (const opt of q.options) {
      if ((opt as any).isCorrect !== undefined) {
        hasLeakedAnswer = true
      }
    }
  }

  if (hasLeakedAnswer) {
    throw new Error('❌ BẢO MẬT THẤT BẠI: isCorrect bị rò rỉ trong payload getQuizForTake!')
  }
  console.log('✅ [3/6] An toàn bảo mật 100%: Toàn bộ đáp án đúng đã được ẩn an toàn trước khi nộp bài.')

  // 4. Test nộp bài thi Không Đạt (Failing Attempt)
  console.log('\n🔄 [4/6] Kiểm thử nộp bài thi KHÔNG ĐẠT (< passScore)...')
  // Chọn các đáp án sai
  const wrongAnswers = quiz.questions.map((q) => {
    const wrongOpt = q.options.find((o) => !o.isCorrect) || q.options[0]
    return {
      questionId: q.id,
      selectedOptionId: wrongOpt.id,
    }
  })

  const failResult = await quizService.submitQuiz(student.id, quiz.id, {
    answers: wrongAnswers,
    timeSpentSeconds: 45,
  })

  console.log(`       - Kết quả thi: Điểm ${failResult.score}% (Điểm đạt yêu cầu: ${failResult.passScore}%)`)
  console.log(`       - isPassed: ${failResult.isPassed}`)
  console.log(`       - Số câu đúng: ${failResult.correctCount}/${failResult.totalQuestions}`)
  console.log(`       - Lượt thi thứ: ${failResult.attemptNumber}, Số lượt còn lại: ${failResult.remainingAttempts}`)

  // Kiểm tra LessonProgress trong DB
  const progressAfterFail = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: student.id,
        lessonId: quizLesson.id,
      },
    },
  })
  console.log(`       - Trạng thái hoàn thành bài học trong DB: isCompleted = ${progressAfterFail?.isCompleted}`)

  if (failResult.isPassed !== false || progressAfterFail?.isCompleted === true) {
    throw new Error('❌ Logic điểm thi chưa chuẩn: Bài thi sai toàn bộ nhưng lại báo Đạt!')
  }
  console.log('✅ [4/6] Chấm điểm Không Đạt chính xác, không cập nhật hoàn thành bài học.')

  // 5. Test nộp bài thi ĐẠT (Passing Attempt)
  console.log('\n🔄 [5/6] Kiểm thử nộp bài thi ĐẠT (100% Correct Answers)...')
  const correctAnswers = quiz.questions.map((q) => {
    const correctOpt = q.options.find((o) => o.isCorrect) || q.options[0]
    return {
      questionId: q.id,
      selectedOptionId: correctOpt.id,
    }
  })

  const passResult = await quizService.submitQuiz(student.id, quiz.id, {
    answers: correctAnswers,
    timeSpentSeconds: 90,
  })

  console.log(`       - Kết quả thi: Điểm ${passResult.score}% (Điểm đạt yêu cầu: ${passResult.passScore}%)`)
  console.log(`       - isPassed: ${passResult.isPassed}`)
  console.log(`       - Số câu đúng: ${passResult.correctCount}/${passResult.totalQuestions}`)
  console.log(`       - Next Lesson: ${passResult.nextLesson?.title || 'Đã hết bài trong khóa'}`)

  // Kiểm tra LessonProgress trong DB sau khi đỗ
  const progressAfterPass = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: student.id,
        lessonId: quizLesson.id,
      },
    },
  })
  console.log(`       - Trạng thái hoàn thành bài học trong DB: isCompleted = ${progressAfterPass?.isCompleted}`)
  console.log(`       - Điểm cao nhất lưu trong DB: quizHighestScore = ${progressAfterPass?.quizHighestScore}%`)

  if (!passResult.isPassed || !progressAfterPass?.isCompleted) {
    throw new Error('❌ Logic hoàn thành bài học thất bại: Bài thi đúng 100% nhưng chưa đánh dấu hoàn thành!')
  }
  console.log('✅ [5/6] Chấm điểm Đạt 100%, ghi nhận hoàn thành bài học và cập nhật tiến độ khóa học thành công!')

  // 6. Kiểm tra Lịch sử làm bài thi (getUserQuizAttempts)
  console.log('\n🔄 [6/6] Kiểm tra lịch sử làm bài thi của học viên (getUserQuizAttempts)...')
  const history = await quizService.getUserQuizAttempts(student.id, quiz.id)
  console.log(`       - Tổng số lượt thi đã lưu: ${history.attempts.length}`)
  history.attempts.forEach((att) => {
    console.log(`         • Lần #${att.attemptNumber}: Điểm ${att.score}% - ${att.isPassed ? 'ĐẠT' : 'CHƯA ĐẠT'} (Nộp lúc: ${att.submittedAt?.toISOString()})`)
  })

  console.log('\n🎉 ====================================================================')
  console.log('🎉 TOÀN BỘ KIỂM THỬ QUIZ ENGINE & TIẾN ĐỘ HỌC TẬP ĐÃ HOÀN THÀNH 100%!')
  console.log('🎉 ====================================================================\n')
}

runQuizVerification()
  .catch((err) => {
    console.error('❌ Kiểm thử thất bại:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
