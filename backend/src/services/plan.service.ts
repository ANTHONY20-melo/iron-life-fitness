import prisma from '../config/database'
import { NotFoundError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { Prisma } from '@prisma/client'

interface CreatePlanInput {
  name: string
  description?: string
  price: number
  duration: number
  features?: string[]
  unitId?: string
}

interface UpdatePlanInput {
  name?: string
  description?: string
  price?: number
  duration?: number
  features?: string[]
  isActive?: boolean
}

export class PlanService {
  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(query)

    const where: Prisma.PlanWhereInput = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (query.unitId) where.unitId = query.unitId
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true'

    const [data, total] = await Promise.all([
      prisma.plan.findMany({
        where,
        include: {
          _count: { select: { subscriptions: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.plan.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getById(id: string) {
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        unit: { select: { id: true, name: true } },
        _count: { select: { subscriptions: true } },
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { student: { select: { id: true, fullName: true } } },
          take: 20,
        },
      },
    })
    if (!plan) throw new NotFoundError('Plan')
    return plan
  }

  async create(data: CreatePlanInput) {
    return prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        features: data.features || [],
        unitId: data.unitId,
      },
    })
  }

  async update(id: string, data: UpdatePlanInput) {
    const plan = await prisma.plan.findUnique({ where: { id } })
    if (!plan) throw new NotFoundError('Plan')

    return prisma.plan.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.features && { features: data.features }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })
  }

  async delete(id: string) {
    const plan = await prisma.plan.findUnique({ where: { id } })
    if (!plan) throw new NotFoundError('Plan')

    await prisma.plan.delete({ where: { id } })
    return { message: 'Plan deleted successfully' }
  }
}
