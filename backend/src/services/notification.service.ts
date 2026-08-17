import prisma from '../config/database'
import { NotFoundError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { Prisma, NotificationType } from '@prisma/client'

export class NotificationService {
  async create(userId: string, title: string, message: string, type: NotificationType = 'GENERAL', data?: Record<string, unknown>) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        ...(data && { data: data as unknown as Record<string, string> }),
      },
    })
  }

  async getByUser(userId: string, query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query)

    const where: Prisma.NotificationWhereInput = { userId }
    if (query.isRead !== undefined) where.isRead = query.isRead === 'true'
    if (query.type) where.type = query.type as NotificationType

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.notification.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async markAsRead(id: string) {
    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification) throw new NotFoundError('Notification')

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  }

  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })

    return { updated: result.count }
  }

  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    })
    return { count }
  }

  async delete(id: string) {
    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification) throw new NotFoundError('Notification')

    await prisma.notification.delete({ where: { id } })
    return { message: 'Notification deleted successfully' }
  }
}
