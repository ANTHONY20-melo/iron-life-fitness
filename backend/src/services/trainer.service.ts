import prisma from '../config/database'
import { NotFoundError, ConflictError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { Prisma } from '@prisma/client'

interface CreateTrainerInput {
  email: string
  password: string
  fullName: string
  cpf?: string
  cref?: string
  specialty?: string
  phone?: string
  bio?: string
  unitId?: string
}

interface UpdateTrainerInput {
  fullName?: string
  cpf?: string
  cref?: string
  specialty?: string
  phone?: string
  bio?: string
  avatarUrl?: string
  unitId?: string | null
  isActive?: boolean
}

export class TrainerService {
  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(query)

    const where: Prisma.TrainerWhereInput = {}
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { cref: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }
    if (query.unitId) where.unitId = query.unitId
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true'

    const [data, total] = await Promise.all([
      prisma.trainer.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, role: true, isActive: true } },
          unit: { select: { id: true, name: true } },
          _count: { select: { students: true, workouts: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.trainer.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getById(id: string) {
    const trainer = await prisma.trainer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, role: true, isActive: true, createdAt: true } },
        unit: true,
        students: {
          select: { id: true, fullName: true, phone: true, level: true, points: true },
          orderBy: { fullName: 'asc' },
        },
        workouts: {
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { exercises: true, assignments: true } } },
        },
      },
    })
    if (!trainer) throw new NotFoundError('Trainer')
    return trainer
  }

  async create(data: CreateTrainerInput) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) throw new ConflictError('Email already registered')

    const bcrypt = await import('bcryptjs')
    const hashed = await bcrypt.hash(data.password, 10)

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email: data.email, password: hashed, role: 'TRAINER' },
      })

      const trainer = await tx.trainer.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          cpf: data.cpf || null,
          cref: data.cref || null,
          specialty: data.specialty || null,
          phone: data.phone || null,
          bio: data.bio || null,
          unitId: data.unitId || null,
        },
        include: {
          user: { select: { id: true, email: true, role: true } },
        },
      })

      return trainer
    })
  }

  async update(id: string, data: UpdateTrainerInput) {
    const trainer = await prisma.trainer.findUnique({ where: { id } })
    if (!trainer) throw new NotFoundError('Trainer')

    return prisma.trainer.update({
      where: { id },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.cpf !== undefined && { cpf: data.cpf }),
        ...(data.cref !== undefined && { cref: data.cref }),
        ...(data.specialty !== undefined && { specialty: data.specialty }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.unitId !== undefined && { unitId: data.unitId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
    })
  }

  async delete(id: string) {
    const trainer = await prisma.trainer.findUnique({ where: { id } })
    if (!trainer) throw new NotFoundError('Trainer')

    await prisma.user.update({
      where: { id: trainer.userId },
      data: { isActive: false },
    })

    return { message: 'Trainer deactivated successfully' }
  }
}
