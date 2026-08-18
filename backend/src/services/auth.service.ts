import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { env } from '../config/environment'
import { UnauthorizedError, ConflictError } from '../utils/errors'
import { AuthUser } from '../middlewares/auth'
import { LoginInput, RegisterInput, RegisterAdminInput } from '../validators/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JwtOptions = any

function generateAccessToken(user: AuthUser): string {
  const options: JwtOptions = { expiresIn: env.jwtExpiresIn }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    options
  )
}

function generateRefreshToken(userId: string): string {
  const options: JwtOptions = { expiresIn: env.jwtRefreshExpiresIn }
  return jwt.sign(
    { id: userId, type: 'refresh' },
    env.jwtRefreshSecret,
    options
  )
}

function parseExpiry(expiry: string): Date {
  const match = expiry.match(/^(\d+)([smhd])$/)
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const value = parseInt(match[1], 10)
  const unit = match[2]
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }
  return new Date(Date.now() + value * multipliers[unit])
}

export class AuthService {
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) throw new UnauthorizedError('Invalid email or password')
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated')

    const valid = await bcrypt.compare(data.password, user.password)
    if (!valid) throw new UnauthorizedError('Invalid email or password')

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const authUser: AuthUser = { id: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(authUser)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: parseExpiry(env.jwtRefreshExpiresIn),
      },
    })

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    }
  }

  async register(data: RegisterInput) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) throw new ConflictError('Email already registered')

    const hashed = await bcrypt.hash(data.password, 10)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashed,
          role: 'STUDENT',
        },
      })

      const student = await tx.student.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          cpf: data.cpf || null,
          phone: data.phone || null,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          gender: data.gender || null,
        },
      })

      return { user, student }
    })

    const authUser: AuthUser = { id: result.user.id, email: result.user.email, role: result.user.role }
    const accessToken = generateAccessToken(authUser)
    const refreshToken = generateRefreshToken(result.user.id)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: result.user.id,
        expiresAt: parseExpiry(env.jwtRefreshExpiresIn),
      },
    })

    return {
      user: { id: result.user.id, email: result.user.email, role: result.user.role },
      student: result.student,
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(token: string) {
    let decoded: { id: string; type: string }
    try {
      decoded = jwt.verify(token, env.jwtRefreshSecret) as { id: string; type: string }
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token } })
    if (!stored) throw new UnauthorizedError('Refresh token not found')
    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: stored.id } })
      throw new UnauthorizedError('Refresh token expired')
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } })
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or deactivated')

    await prisma.refreshToken.delete({ where: { id: stored.id } })

    const authUser: AuthUser = { id: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(authUser)
    const newRefreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: parseExpiry(env.jwtRefreshExpiresIn),
      },
    })

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }

  async registerAdmin(data: RegisterAdminInput) {
    const { secret, ...adminData } = data
    if (secret !== env.adminRegistrationSecret) {
      throw new UnauthorizedError('Invalid registration secret')
    }

    const exists = await prisma.user.findUnique({ where: { email: adminData.email } })
    if (exists) throw new ConflictError('Email already registered')

    const hashed = await bcrypt.hash(adminData.password, 10)

    const user = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashed,
        role: 'ADMIN',
      },
    })

    const authUser: AuthUser = { id: user.id, email: user.email, role: user.role }
    const accessToken = generateAccessToken(authUser)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: parseExpiry(env.jwtRefreshExpiresIn),
      },
    })

    return {
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    }
  }

  async logout(token: string) {
    try {
      const stored = await prisma.refreshToken.findUnique({ where: { token } })
      if (stored) {
        await prisma.refreshToken.delete({ where: { id: stored.id } })
      }
    } catch {
      // Token already deleted — silent success
    }
  }
}
