import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    userAccountId: string
    loginEmail: string
    email: string | null
    employeeCode: string | null
    userType: string
    fullName: string
  }
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Access Token missing' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' })
    }

    const userAccount = await prisma.userAccount.findUnique({
      where: { id: decoded.userAccountId || decoded.id },
      include: { user: true },
    })

    if (!userAccount || !userAccount.user || !userAccount.user.isActive) {
      return res.status(401).json({ error: 'Unauthorized: User account inactive or missing' })
    }

    if (userAccount.isLocked) {
      return res.status(403).json({ error: 'Forbidden: Account is locked' })
    }

    req.user = {
      id: userAccount.user.id,
      userAccountId: userAccount.id,
      loginEmail: userAccount.loginEmail,
      email: userAccount.user.email,
      employeeCode: userAccount.user.employeeCode,
      userType: userAccount.user.userType,
      fullName: userAccount.user.fullName,
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}
