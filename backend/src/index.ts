import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import coursesRouter from './routes/courses'
import lessonsRouter from './routes/lessons'
import quizzesRouter from './routes/quizzes'
import progressRouter from './routes/progress'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/lessons', lessonsRouter)
app.use('/api/quizzes', quizzesRouter)
app.use('/api/progress', progressRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LogiX LMS API is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
