import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get lesson details
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    })

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' })
    }

    res.json(lesson)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
