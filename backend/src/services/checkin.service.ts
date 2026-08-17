import prisma from '../config/database'
import { NotFoundError, AppError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { Prisma, CheckInMethod } from '@prisma/client'

export class CheckInService {
  async checkIn(studentId: string, unitId: string, method: CheckInMethod = 'APP') {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    const unit = await prisma.unit.findUnique({ where: { id: unitId } })
    if (!unit) throw new NotFoundError('Unit')

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.checkIn.findFirst({
      where: {
        studentId,
        unitId,
        date: { gte: today },
      },
    })

    if (existing) {
      throw new AppError('Already checked in today at this unit', 409)
    }

    return prisma.checkIn.create({
      data: { studentId, unitId, method },
      include: {
        student: { select: { id: true, fullName: true } },
        unit: { select: { id: true, name: true } },
      },
    })
  }

  async getByQRCode(qrCode: string, unitId: string) {
    const student = await prisma.student.findFirst({
      where: { OR: [{ qrCode }, { studentCode: qrCode }] },
    })
    if (!student) throw new NotFoundError('Student with this QR code')

    return this.checkIn(student.id, unitId, 'QR_CODE')
  }

  async getHistory(studentId: string, query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query)

    const where: Prisma.CheckInWhereInput = { studentId }
    if (query.startDate || query.endDate) {
      where.date = {}
      if (query.startDate) where.date.gte = new Date(query.startDate)
      if (query.endDate) where.date.lte = new Date(query.endDate)
    }

    const [data, total] = await Promise.all([
      prisma.checkIn.findMany({
        where,
        include: { unit: { select: { id: true, name: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.checkIn.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getStats(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    const now = new Date()

    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [weeklyCount, monthlyCount, totalCount, recentCheckins] = await Promise.all([
      prisma.checkIn.count({
        where: { studentId, date: { gte: startOfWeek } },
      }),
      prisma.checkIn.count({
        where: { studentId, date: { gte: startOfMonth } },
      }),
      prisma.checkIn.count({ where: { studentId } }),
      prisma.checkIn.findMany({
        where: { studentId },
        orderBy: { date: 'desc' },
        take: 30,
        select: { date: true, method: true, unit: { select: { name: true } } },
      }),
    ])

    return {
      weekly: weeklyCount,
      monthly: monthlyCount,
      total: totalCount,
      recentCheckins,
      streak: this.calculateStreak(recentCheckins),
    }
  }

  private calculateStreak(checkins: { date: Date }[]): number {
    if (checkins.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dates = checkins.map((c) => {
      const d = new Date(c.date)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })

    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a)

    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(today)
      expected.setDate(today.getDate() - i)
      expected.setHours(0, 0, 0, 0)

      if (uniqueDates[i] === expected.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query)

    const where: Prisma.CheckInWhereInput = {}
    if (query.studentId) where.studentId = query.studentId
    if (query.unitId) where.unitId = query.unitId
    if (query.method) where.method = query.method as CheckInMethod

    const [data, total] = await Promise.all([
      prisma.checkIn.findMany({
        where,
        include: {
          student: { select: { id: true, fullName: true } },
          unit: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.checkIn.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }
}
