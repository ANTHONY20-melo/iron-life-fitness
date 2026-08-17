import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'
import prisma from '../config/database'
import { NotFoundError, ConflictError, AppError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { CreateStudentInput, UpdateStudentInput, UpdateBodyStatsInput } from '../validators/student'
import { Prisma } from '@prisma/client'

function generateStudentCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export class StudentService {
  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(query)

    const where: Prisma.StudentWhereInput = {}
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }
    if (query.unitId) where.unitId = query.unitId
    if (query.trainerId) where.trainerId = query.trainerId
    if (query.level) where.level = query.level

    const [data, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, role: true, isActive: true } },
          unit: { select: { id: true, name: true } },
          trainer: { select: { id: true, fullName: true } },
          subscriptions: {
            where: { status: 'ACTIVE' },
            include: { plan: { select: { id: true, name: true, price: true } } },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.student.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, role: true, isActive: true, createdAt: true } },
        unit: true,
        trainer: { select: { id: true, fullName: true, specialty: true, cref: true } },
        subscriptions: {
          include: { plan: true, payments: { orderBy: { dueDate: 'desc' }, take: 5 } },
          orderBy: { createdAt: 'desc' },
        },
        evaluations: { orderBy: { date: 'desc' }, take: 5 },
        checkins: { orderBy: { date: 'desc' }, take: 10 },
        achievements: {
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
        },
        ranking: true,
      },
    })
    if (!student) throw new NotFoundError('Student')
    return student
  }

  async create(data: CreateStudentInput) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) throw new ConflictError('Email already registered')

    const hashed = await bcrypt.hash(data.password, 10)
    const studentCode = generateStudentCode()
    const qrData = `ironlife://student/${studentCode}`
    const qrCode = await QRCode.toDataURL(qrData)

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email: data.email, password: hashed, role: 'STUDENT' },
      })

      const student = await tx.student.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          cpf: data.cpf || null,
          phone: data.phone || null,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          gender: data.gender || null,
          unitId: data.unitId || null,
          trainerId: data.trainerId || null,
          goal: data.goal || null,
          weight: data.weight || null,
          height: data.height || null,
          bodyFatPercent: data.bodyFatPercent || null,
          muscleMass: data.muscleMass || null,
          studentCode,
          qrCode,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
        },
      })

      return student
    })
  }

  async update(id: string, data: UpdateStudentInput) {
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw new NotFoundError('Student')

    return prisma.student.update({
      where: { id },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.cpf !== undefined && { cpf: data.cpf }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.birthDate && { birthDate: new Date(data.birthDate) }),
        ...(data.gender && { gender: data.gender }),
        ...(data.unitId !== undefined && { unitId: data.unitId }),
        ...(data.trainerId !== undefined && { trainerId: data.trainerId }),
        ...(data.goal !== undefined && { goal: data.goal }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.weight !== undefined && { weight: data.weight }),
        ...(data.height !== undefined && { height: data.height }),
        ...(data.bodyFatPercent !== undefined && { bodyFatPercent: data.bodyFatPercent }),
        ...(data.muscleMass !== undefined && { muscleMass: data.muscleMass }),
      },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
    })
  }

  async delete(id: string) {
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw new NotFoundError('Student')

    await prisma.user.update({
      where: { id: student.userId },
      data: { isActive: false },
    })

    return { message: 'Student deactivated successfully' }
  }

  async getProfile(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, role: true, createdAt: true } },
        unit: { select: { id: true, name: true, address: true, phone: true } },
        trainer: { select: { id: true, fullName: true, specialty: true, avatarUrl: true } },
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { plan: true },
          take: 1,
        },
        evaluations: { orderBy: { date: 'desc' }, take: 3 },
        achievements: {
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
          take: 10,
        },
        ranking: true,
      },
    })
    if (!student) throw new NotFoundError('Student profile')
    return student
  }

  async updateBodyStats(id: string, data: UpdateBodyStatsInput) {
    const student = await prisma.student.findUnique({ where: { id } })
    if (!student) throw new NotFoundError('Student')

    return prisma.student.update({
      where: { id },
      data: {
        ...(data.weight !== undefined && { weight: data.weight }),
        ...(data.height !== undefined && { height: data.height }),
        ...(data.bodyFatPercent !== undefined && { bodyFatPercent: data.bodyFatPercent }),
        ...(data.muscleMass !== undefined && { muscleMass: data.muscleMass }),
      },
    })
  }
}
