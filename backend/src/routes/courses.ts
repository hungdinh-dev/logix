import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { published: true }
    })
    res.json(courses)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get single course details with sections & lessons
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json(course)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Enroll in a course
router.post('/:id/enroll', async (req: any, res: any) => {
  try {
    const { id: courseId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    })

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' })
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        progress: 0.0,
      }
    })

    res.status(201).json(enrollment)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
