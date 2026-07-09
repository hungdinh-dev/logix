import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.userProgress.deleteMany({})
  await prisma.courseEnrollment.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.quiz.deleteMany({})
  await prisma.lesson.deleteMany({})
  await prisma.section.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.user.deleteMany({})

  // Hash password
  const passwordHash = await bcrypt.hash('password123', 10)

  // Create Users
  const student = await prisma.user.create({
    data: {
      email: 'alex@logix.com',
      password: passwordHash,
      name: 'Alex Thompson',
      role: 'STUDENT',
    },
  })

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@logix.com',
      password: passwordHash,
      name: 'Sarah Chen',
      role: 'INSTRUCTOR',
    },
  })

  console.log('Created Users:', { student: student.email, instructor: instructor.email })

  // Course 1: Leadership
  const course1 = await prisma.course.create({
    data: {
      id: '1',
      title: 'Strategic Leadership Fundamentals for Modern Organizations',
      description: 'Learn to lead teams and organizations through strategic thinking, communication, and decision making.',
      category: 'Leadership',
      duration: '6h 30m',
      price: 0,
      published: true,
    },
  })

  // Course 2: Compliance
  const course2 = await prisma.course.create({
    data: {
      id: '2',
      title: 'GDPR & Data Privacy Compliance Essentials',
      description: 'Understand the core principles of GDPR and how to protect sensitive data inside your organization.',
      category: 'Compliance',
      duration: '3h 15m',
      price: 0,
      published: true,
    },
  })

  // Course 7: Cybersecurity
  const course7 = await prisma.course.create({
    data: {
      id: '7',
      title: 'Cybersecurity Awareness 2024',
      description: 'Protect yourself and your organization from modern cyber threats — learn to spot phishing attacks, manage credentials safely, and respond to security incidents.',
      category: 'Compliance',
      duration: '1h 45m',
      price: 0,
      published: true,
    },
  })

  // Sections & Lessons for Course 7
  const section1 = await prisma.section.create({
    data: {
      id: 's1',
      title: 'The Threat Landscape in 2024',
      order: 1,
      courseId: course7.id,
    },
  })

  await prisma.lesson.createMany({
    data: [
      {
        id: 'l1',
        title: "Why Cybersecurity Is Everyone's Responsibility",
        duration: '5:10',
        order: 1,
        sectionId: section1.id,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        content: 'Overview of cybersecurity in the modern digital workspace.',
      },
      {
        id: 'l2',
        title: 'How Attackers Choose Their Targets',
        duration: '7:30',
        order: 2,
        sectionId: section1.id,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        content: 'Learn about reconnaissance and target selection by cyber criminals.',
      },
    ],
  })

  const section2 = await prisma.section.create({
    data: {
      id: 's2',
      title: 'Phishing & Social Engineering',
      order: 2,
      courseId: course7.id,
    },
  })

  const lessonQuiz = await prisma.lesson.create({
    data: {
      id: 'l8',
      title: 'Phishing Detection Assessment',
      duration: '5:00',
      order: 1,
      sectionId: section2.id,
    },
  })

  const quiz = await prisma.quiz.create({
    data: {
      id: 'q1',
      title: 'Phishing Awareness Quiz',
      passingScore: 80,
      lessonId: lessonQuiz.id,
    },
  })

  await prisma.question.createMany({
    data: [
      {
        id: 'q1_1',
        quizId: quiz.id,
        text: 'Which of the following is a red flag in a suspicious email?',
        options: JSON.stringify([
          'Urgent language demanding immediate action',
          'A sender address that doesn\'t match the signature name',
          'Generic greeting like "Dear Customer"',
          'All of the above'
        ]),
        correctAnswer: 3,
      },
      {
        id: 'q1_2',
        quizId: quiz.id,
        text: 'What should you do if you suspect an email is a phishing attempt?',
        options: JSON.stringify([
          'Reply to the sender to verify',
          'Forward it to your personal email to check on your phone',
          'Use the report button or notify the IT Security team',
          'Click the links to see where they lead'
        ]),
        correctAnswer: 2,
      }
    ],
  })

  // Enroll student to Course 7
  await prisma.courseEnrollment.create({
    data: {
      userId: student.id,
      courseId: course7.id,
      progress: 50.0,
    },
  })

  // Create initial user progress (Lesson 1 completed)
  await prisma.userProgress.create({
    data: {
      userId: student.id,
      lessonId: 'l1',
      completed: true,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
