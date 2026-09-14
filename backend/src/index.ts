import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRouter from './modules/auth/auth.routes'
import roleRouter from './modules/roles/role.routes'
import permissionRouter from './modules/permissions/permission.routes'
import departmentRouter from './modules/departments/department.routes'
import userRouter from './modules/users/user.routes'
import jobLevelRouter from './modules/job-levels/job-level.routes'
import customFieldRouter from './modules/custom-fields/custom-field.routes'
import coursesRouter from './modules/courses/course.routes'
import lessonsRouter from './modules/lessons/lesson.routes'
import quizzesRouter from './modules/quizzes/quiz.routes'
import progressRouter from './modules/progress/progress.routes'
import { certificateRouter } from './modules/certificates/certificate.routes'

import { globalErrorHandler } from './common/middlewares/error-handler.middleware'
import { ApiResponse } from './common/responses/api-response'
import { setupSwagger } from './config/swagger'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Swagger UI Documentation
setupSwagger(app)

// Root redirect to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs')
})

// Feature Module Routes
app.use('/api/auth', authRouter)
app.use('/api/roles', roleRouter)
app.use('/api/permissions', permissionRouter)
app.use('/api/departments', departmentRouter)
app.use('/api/users', userRouter)
app.use('/api/job-levels', jobLevelRouter)
app.use('/api/custom-field-definitions', customFieldRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/lessons', lessonsRouter)
app.use('/api/quizzes', quizzesRouter)
app.use('/api/progress', progressRouter)
app.use('/api/certificates', certificateRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json(ApiResponse.success({ status: 'ok' }, 'LogiX LMS API is running'))
})

// Global Error Handler Middleware (MUST be registered last)
app.use(globalErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Swagger API Docs available at http://localhost:${PORT}/api-docs`)
})
