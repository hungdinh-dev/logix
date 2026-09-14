import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed: any = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })

      if (parsed && parsed.body) {
        req.body = parsed.body
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
