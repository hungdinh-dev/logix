import bcrypt from 'bcryptjs'
import prisma from '../../config/prisma'
import { ConflictError } from '../../common/errors/app.error'
import { CreateUserDto } from './user.dto'

export class UserService {
  public async getAllUsers(search?: string) {
    const searchStr = typeof search === 'string' ? search.toLowerCase() : ''

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        ...(searchStr
          ? {
              OR: [
                { fullName: { contains: searchStr, mode: 'insensitive' } },
                { email: { contains: searchStr, mode: 'insensitive' } },
                { employeeCode: { contains: searchStr, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    return users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      employeeCode: u.employeeCode || '',
      email: u.email || '',
      avatarUrl: undefined,
    }))
  }

  public async createUser(dto: CreateUserDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (existingUser) {
      throw new ConflictError('Email này đã tồn tại trong hệ thống')
    }

    const defaultPassword = 'password123'
    const passwordHash = await bcrypt.hash(defaultPassword, 10)

    const user = await prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        employeeCode: dto.employeeCode || `EMP-${Date.now().toString().slice(-4)}`,
        positionId: dto.jobLevelId || undefined,
        userAccount: {
          create: {
            loginEmail: dto.email,
            passwordHash,
          },
        },
      },
    })

    return user.id
  }
}

export const userService = new UserService()
