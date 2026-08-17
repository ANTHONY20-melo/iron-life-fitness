import prisma from '../config/database'
import { NotFoundError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { Prisma, AppointmentType } from '@prisma/client'

interface CreateAppointmentInput {
  studentId: string
  unitId: string
  title: string
  type?: AppointmentType
  date: string
  duration?: number
  notes?: string
}

interface UpdateAppointmentInput {
  title?: string
  type?: AppointmentType
  date?: string
  duration?: number
  status?: string
  notes?: string
}

export class AppointmentService {
  async create(data: CreateAppointmentInput) {
    const student = await prisma.student.findUnique({ where: { id: data.studentId } })
    if (!student) throw new NotFoundError('Student')

    const unit = await prisma.unit.findUnique({ where: { id: data.unitId } })
    if (!unit) throw new NotFoundError('Unit')

    return prisma.appointment.create({
      data: {
        studentId: data.studentId,
        unitId: data.unitId,
        title: data.title,
        type: data.type || 'PERSONAL_TRAINING',
        date: new Date(data.date),
        duration: data.duration || 60,
        notes: data.notes,
      },
      include: {
        student: { select: { id: true, fullName: true } },
        unit: { select: { id: true, name: true } },
      },
    })
  }

  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query)

    const where: Prisma.AppointmentWhereInput = {}
    if (query.studentId) where.studentId = query.studentId
    if (query.unitId) where.unitId = query.unitId
    if (query.status) where.status = query.status
    if (query.type) where.type = query.type as AppointmentType

    if (query.date) {
      const targetDate = new Date(query.date)
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)
      where.date = { gte: startOfDay, lte: endOfDay }
    }

    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          student: { select: { id: true, fullName: true } },
          unit: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.appointment.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, fullName: true, phone: true } },
        unit: { select: { id: true, name: true, address: true } },
      },
    })
    if (!appointment) throw new NotFoundError('Appointment')
    return appointment
  }

  async update(id: string, data: UpdateAppointmentInput) {
    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) throw new NotFoundError('Appointment')

    return prisma.appointment.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.type && { type: data.type }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        student: { select: { id: true, fullName: true } },
        unit: { select: { id: true, name: true } },
      },
    })
  }

  async delete(id: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) throw new NotFoundError('Appointment')

    await prisma.appointment.delete({ where: { id } })
    return { message: 'Appointment deleted successfully' }
  }
}
