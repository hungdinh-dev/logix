import { HttpStatus } from '../enums/http-status.enum'

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly errors?: Record<string, string[]> | null

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    isOperational = true,
    errors: Record<string, string[]> | null = null
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errors = errors
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Yêu cầu không hợp lệ', errors: Record<string, string[]> | null = null) {
    super(message, HttpStatus.BAD_REQUEST, true, errors)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Chưa xác thực hoặc phiên đăng nhập đã hết hạn') {
    super(message, HttpStatus.UNAUTHORIZED, true)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Bạn không có quyền thực hiện thao tác này') {
    super(message, HttpStatus.FORBIDDEN, true)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Tài nguyên') {
    super(`${resource} không tồn tại`, HttpStatus.NOT_FOUND, true)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Dữ liệu đã tồn tại hoặc bị trùng lặp') {
    super(message, HttpStatus.CONFLICT, true)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Lỗi hệ thống máy chủ') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, false)
  }
}
