import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get user progress for a course
router.get('/:courseId', async (req: any, res: any) => {
  try {
    const { courseId } = req.params
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' })
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    })

    const completedLessons = await prisma.userProgress.findMany({
      where: {
        userId,
        completed: true,
        lesson: {
          section: {
            courseId
          }
        }
      },
      select: {
        lessonId: true
      }
    })

    res.json({
      enrolled: !!enrollment,
      progressPercent: enrollment ? enrollment.progress : 0,
      completedLessonIds: completedLessons.map((l) => l.lessonId)
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Toggle/Mark lesson progress
router.post('/lesson/:lessonId', async (req: any, res: any) => {
  try {
    const { lessonId } = req.params
    const { userId, completed } = req.body // completed: boolean

    if (!userId || completed === undefined) {
      return res.status(400).json({ error: 'userId and completed boolean are required' })
    }

    // Find the lesson to get the section and course
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { section: true }
    })

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' })
    }

    const courseId = lesson.section.courseId

    // Upsert user progress record
    await prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: { completed },
      create: { userId, lessonId, completed }
    })

    // Find enrollment to update progress percent
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    })

    if (enrollment) {
      const totalLessons = await prisma.lesson.count({
        where: { section: { courseId } }
      })

      const completedCount = await prisma.userProgress.count({
        where: {
          userId,
          completed: true,
          lesson: { section: { courseId } }
        }
      })

      const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0.0

      await prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { progress: progressPercent }
      })
    }

    res.json({ success: true, completed })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
