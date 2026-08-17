import prisma from '../config/database'
import { NotFoundError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { Prisma } from '@prisma/client'

interface CreateUnitInput {
  name: string
  address?: string
  phone?: string
  email?: string
}

interface UpdateUnitInput {
  name?: string
  address?: string
  phone?: string
  email?: string
  isActive?: boolean
}

export class UnitService {
  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(query)

    const where: Prisma.UnitWhereInput = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true'

    const [data, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: {
          _count: {
            select: { students: true, trainers: true, subscriptions: true },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.unit.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getById(id: string) {
    const unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        students: {
          select: { id: true, fullName: true, phone: true, level: true },
          orderBy: { fullName: 'asc' },
          take: 50,
        },
        trainers: {
          select: { id: true, fullName: true, specialty: true, isActive: true },
          orderBy: { fullName: 'asc' },
        },
        plans: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        _count: {
          select: { students: true, trainers: true, subscriptions: true, checkins: true },
        },
      },
    })
    if (!unit) throw new NotFoundError('Unit')
    return unit
  }

  async create(data: CreateUnitInput) {
    return prisma.unit.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
      },
    })
  }

  async update(id: string, data: UpdateUnitInput) {
    const unit = await prisma.unit.findUnique({ where: { id } })
    if (!unit) throw new NotFoundError('Unit')

    return prisma.unit.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    })
  }

  async delete(id: string) {
    const unit = await prisma.unit.findUnique({ where: { id } })
    if (!unit) throw new NotFoundError('Unit')

    await prisma.unit.update({
      where: { id },
      data: { isActive: false },
    })

    return { message: 'Unit deactivated successfully' }
  }
}
