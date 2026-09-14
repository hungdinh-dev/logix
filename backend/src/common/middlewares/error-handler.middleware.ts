import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/app.error'
import { ApiResponse } from '../responses/api-response'
import { HttpStatus } from '../enums/http-status.enum'
import { ZodError, ZodIssue } from 'zod'

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err)
  }

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {}
    err.issues.forEach((issue: ZodIssue) => {
      const field = issue.path.join('.') || 'body'
      if (!formattedErrors[field]) {
        formattedErrors[field] = []
      }
      formattedErrors[field].push(issue.message)
    })

    return res.status(HttpStatus.BAD_REQUEST).json(
      ApiResponse.error(
        'Dữ liệu đầu vào không hợp lệ',
        HttpStatus.BAD_REQUEST,
        formattedErrors
      )
    )
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, err.statusCode, err.errors)
    )
  }

  // 3. System Error
  const isDev = process.env.NODE_ENV === 'development'
  const message = isDev ? err.message || 'Lỗi hệ thống máy chủ' : 'Lỗi hệ thống máy chủ'

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
    ApiResponse.error(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      isDev && err.stack ? { stack: [err.stack] } : null
    )
  )
}
