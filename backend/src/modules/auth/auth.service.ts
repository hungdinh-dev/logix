import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma'
import { getUserPermissions, invalidatePermissionCacheForUser } from '../../services/permission.service'
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '../../common/errors/app.error'
import { LoginDto } from './auth.dto'

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret_key'
const MAX_FAILED_LOGINS = 5

export class AuthService {
  public async login(dto: LoginDto) {
    const targetEmail = dto.loginEmail || dto.email
    if (!targetEmail) {
      throw new BadRequestError('Email đăng nhập không được để trống')
    }

    const userAccount = await prisma.userAccount.findUnique({
      where: { loginEmail: targetEmail },
      include: {
        user: {
          include: {
            store: true,
            department: true,
            position: true,
            userRoles: {
              where: { isActive: true, revokedAt: null },
              include: { role: true },
            },
          },
        },
      },
    })

    if (!userAccount) {
      throw new UnauthorizedError('Email hoặc mật khẩu không chính xác')
    }

    if (userAccount.isLocked) {
      throw new ForbiddenError(
        'Tài khoản của bạn đã bị khóa do đăng nhập sai quá nhiều lần. Vui lòng liên hệ Admin.'
      )
    }

    const isMatch = await bcrypt.compare(dto.password, userAccount.passwordHash)
    if (!isMatch) {
      const newFailedCount = userAccount.failedLoginCount + 1
      const isNowLocked = newFailedCount >= MAX_FAILED_LOGINS

      await prisma.userAccount.update({
        where: { id: userAccount.id },
        data: {
          failedLoginCount: newFailedCount,
          isLocked: isNowLocked,
        },
      })

      if (isNowLocked) {
        throw new ForbiddenError('Mật khẩu sai quá 5 lần. Tài khoản vừa bị tự động khóa.')
      }

      throw new UnauthorizedError(
        `Mật khẩu không đúng. Cảnh báo: bạn còn ${MAX_FAILED_LOGINS - newFailedCount} lần thử.`
      )
    }

    if (!userAccount.user.isActive || userAccount.user.status !== 'ACTIVE') {
      throw new ForbiddenError('Tài khoản nhân sự đang bị tạm ngừng hoạt động')
    }

    const refreshToken = jwt.sign(
      { userId: userAccount.userId, userAccountId: userAccount.id },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.userAccount.update({
      where: { id: userAccount.id },
      data: {
        failedLoginCount: 0,
        lastLoginAt: new Date(),
        refreshToken,
        refreshTokenExpiresAt,
      },
    })

    const permissionsSet = await getUserPermissions(userAccount.userId)
    const permissions = Array.from(permissionsSet)

    const roles = userAccount.user.userRoles.map((ur) => ur.role.roleName)
    const primaryRole = roles[0] || 'STUDENT'

    const accessToken = jwt.sign(
      {
        userId: userAccount.userId,
        userAccountId: userAccount.id,
        email: userAccount.user.email,
        employeeCode: userAccount.user.employeeCode,
        fullName: userAccount.user.fullName,
        roles,
        role: primaryRole,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    return {
      accessToken,
      refreshToken,
      user: {
        id: userAccount.user.id,
        userAccountId: userAccount.id,
        employeeCode: userAccount.user.employeeCode,
        fullName: userAccount.user.fullName,
        email: userAccount.user.email,
        loginEmail: userAccount.loginEmail,
        status: userAccount.user.status,
        userType: userAccount.user.userType,
        employmentStatus: userAccount.user.employmentStatus,
        store: userAccount.user.store,
        department: userAccount.user.department,
        position: userAccount.user.position,
        roles,
        role: primaryRole,
      },
      permissions,
    }
  }

  public async refreshToken(refreshTokenStr: string) {
    let decoded: any
    try {
      decoded = jwt.verify(refreshTokenStr, REFRESH_SECRET)
    } catch {
      throw new UnauthorizedError('Refresh token không hợp lệ hoặc đã hết hạn')
    }

    const userAccount = await prisma.userAccount.findUnique({
      where: { id: decoded.userAccountId },
      include: { user: true },
    })

    if (
      !userAccount ||
      userAccount.refreshToken !== refreshTokenStr ||
      (userAccount.refreshTokenExpiresAt && userAccount.refreshTokenExpiresAt < new Date()) ||
      userAccount.isLocked
    ) {
      throw new UnauthorizedError('Refresh token không hợp lệ hoặc đã hết hạn')
    }

    const newAccessToken = jwt.sign(
      {
        userId: userAccount.userId,
        userAccountId: userAccount.id,
        email: userAccount.user.email,
        employeeCode: userAccount.user.employeeCode,
        fullName: userAccount.user.fullName,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    return { accessToken: newAccessToken }
  }

  public async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAccount: {
          select: {
            id: true,
            loginEmail: true,
            lastLoginAt: true,
            isLocked: true,
          },
        },
        store: true,
        department: true,
        position: true,
        userRoles: {
          where: { isActive: true, revokedAt: null },
          include: { role: true },
        },
      },
    })

    if (!user) {
      throw new NotFoundError('Người dùng')
    }

    const permissionsSet = await getUserPermissions(userId)

    return {
      user: {
        id: user.id,
        employeeCode: user.employeeCode,
        fullName: user.fullName,
        email: user.email,
        loginEmail: user.userAccount?.loginEmail,
        userAccountId: user.userAccount?.id,
        status: user.status,
        userType: user.userType,
        employmentStatus: user.employmentStatus,
        store: user.store,
        department: user.department,
        position: user.position,
        roles: user.userRoles.map((ur) => ur.role.roleName),
        role: user.userRoles[0]?.role?.roleName || 'STUDENT',
      },
      permissions: Array.from(permissionsSet),
    }
  }

  public async logout(userAccountId?: string, userId?: string) {
    if (userAccountId) {
      await prisma.userAccount.update({
        where: { id: userAccountId },
        data: { refreshToken: null, refreshTokenExpiresAt: null },
      })
    }

    if (userId) {
      invalidatePermissionCacheForUser(userId)
    }

    return { message: 'Đăng xuất thành công' }
  }
}

export const authService = new AuthService()
