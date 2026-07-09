import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get quiz by lesson ID or quiz ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params
    // Find quiz by quiz ID first, fallback to lesson ID
    let quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    })

    if (!quiz) {
      quiz = await prisma.quiz.findFirst({
        where: { lessonId: id },
        include: { questions: true }
      })
    }

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    // Parse options string back to array for each question
    const questions = quiz.questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options)
    }))

    res.json({
      id: quiz.id,
      title: quiz.title,
      passingScore: quiz.passingScore,
      lessonId: quiz.lessonId,
      questions
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Submit quiz answers
router.post('/:id/submit', async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { answers, userId } = req.body // answers: Record<questionId, answerIndex>

    if (!answers || !userId) {
      return res.status(400).json({ error: 'Answers and userId are required' })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    })

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    let correctCount = 0
    const details = quiz.questions.map((q) => {
      const userAnswer = answers[q.id]
      const isCorrect = userAnswer === q.correctAnswer
      if (isCorrect) correctCount++
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      }
    })

    const score = (correctCount / quiz.questions.length) * 100
    const passed = score >= quiz.passingScore

    // If passed, mark the lesson as completed
    if (passed) {
      const enrollment = await prisma.courseEnrollment.findFirst({
        where: {
          userId,
          course: {
            sections: {
              some: {
                lessons: {
                  some: { id: quiz.lessonId }
                }
              }
            }
          }
        }
      })

      if (enrollment) {
        // Create user progress for this quiz lesson
        await prisma.userProgress.upsert({
          where: {
            userId_lessonId: { userId, lessonId: quiz.lessonId }
          },
          update: { completed: true },
          create: { userId, lessonId: quiz.lessonId, completed: true }
        })

        // Recalculate enrollment progress percentage
        const totalLessons = await prisma.lesson.count({
          where: { section: { courseId: enrollment.courseId } }
        })
        const completedLessons = await prisma.userProgress.count({
          where: {
            userId,
            completed: true,
            lesson: { section: { courseId: enrollment.courseId } }
          }
        })
        const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0.0

        await prisma.courseEnrollment.update({
          where: { id: enrollment.id },
          data: { progress: progressPercent }
        })
      }
    }

    res.json({
      score,
      passed,
      correctCount,
      totalCount: quiz.questions.length,
      details
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
