import prisma from '../config/database'
import { NotFoundError, AppError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { Prisma, PaymentStatus, PaymentMethod } from '@prisma/client'

interface CreatePaymentInput {
  subscriptionId: string
  amount: number
  dueDate: string
  notes?: string
}

interface UpdatePaymentInput {
  status?: PaymentStatus
  method?: PaymentMethod
  paidDate?: string
  transactionId?: string
  notes?: string
}

export class PaymentService {
  async create(data: CreatePaymentInput) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: data.subscriptionId },
    })
    if (!subscription) throw new NotFoundError('Subscription')

    return prisma.payment.create({
      data: {
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        notes: data.notes,
      },
      include: {
        subscription: {
          include: { student: { select: { id: true, fullName: true } }, plan: true },
        },
      },
    })
  }

  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query)

    const where: Prisma.PaymentWhereInput = {}
    if (query.status) where.status = query.status as PaymentStatus
    if (query.method) where.method = query.method as PaymentMethod
    if (query.studentId) {
      where.subscription = { studentId: query.studentId }
    }
    if (query.startDate || query.endDate) {
      where.dueDate = {}
      if (query.startDate) where.dueDate.gte = new Date(query.startDate)
      if (query.endDate) where.dueDate.lte = new Date(query.endDate)
    }

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          subscription: {
            include: {
              student: { select: { id: true, fullName: true } },
              plan: { select: { id: true, name: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.payment.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getByStudent(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    return prisma.payment.findMany({
      where: { subscription: { studentId } },
      include: {
        subscription: { include: { plan: { select: { id: true, name: true } } } },
      },
      orderBy: { dueDate: 'desc' },
    })
  }

  async markPaid(id: string, method: PaymentMethod) {
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) throw new NotFoundError('Payment')

    if (payment.status === 'PAID') throw new AppError('Payment already marked as paid', 409)

    return prisma.payment.update({
      where: { id },
      data: {
        status: 'PAID',
        method,
        paidDate: new Date(),
      },
      include: {
        subscription: {
          include: { student: { select: { id: true, fullName: true } }, plan: true },
        },
      },
    })
  }

  async getOverdue() {
    const now = new Date()

    const overduePayments = await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lt: now },
      },
      include: {
        subscription: {
          include: {
            student: { select: { id: true, fullName: true, phone: true, userId: true } },
            plan: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    return overduePayments
  }

  async update(id: string, data: UpdatePaymentInput) {
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) throw new NotFoundError('Payment')

    return prisma.payment.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.method && { method: data.method }),
        ...(data.paidDate && { paidDate: new Date(data.paidDate) }),
        ...(data.transactionId !== undefined && { transactionId: data.transactionId }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: {
        subscription: {
          include: { student: { select: { id: true, fullName: true } }, plan: true },
        },
      },
    })
  }

  async delete(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) throw new NotFoundError('Payment')

    await prisma.payment.delete({ where: { id } })
    return { message: 'Payment deleted successfully' }
  }
}
