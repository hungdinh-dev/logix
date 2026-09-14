import { HttpStatus, IApiResponse } from '@logix/shared'


export class ApiResponse<T = any> implements IApiResponse<T> {
  public isSuccess: boolean
  public statusCode: number
  public message: string
  public data?: T | null
  public errors?: Record<string, string[]> | null

  constructor({ isSuccess, statusCode, message, data = null, errors = null }: IApiResponse<T>) {
    this.isSuccess = isSuccess
    this.statusCode = statusCode
    this.message = message
    this.data = data
    this.errors = errors
  }

  public static success<T>(
    data: T,
    message = 'Thành công',
    statusCode: number = HttpStatus.OK
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      isSuccess: true,
      statusCode,
      message,
      data,
    })
  }

  public static error(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    errors: Record<string, string[]> | null = null
  ): ApiResponse<null> {
    return new ApiResponse<null>({
      isSuccess: false,
      statusCode,
      message,
      errors,
    })
  }
}
