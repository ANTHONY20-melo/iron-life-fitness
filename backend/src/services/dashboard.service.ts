import prisma from '../config/database'

export class DashboardService {
  async getStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalStudents,
      activeStudents,
      overdueStudents,
      monthlyNewStudents,
      lastMonthNewStudents,
      monthlyRevenue,
      lastMonthRevenue,
      overduePayments,
      activeSubscriptions,
      workoutsDone,
      pendingEvaluations,
      totalTrainers,
      totalCheckins,
      todayCheckins,
    ] = await Promise.all([
      prisma.student.count({ where: { user: { isActive: true } } }),
      prisma.student.count({
        where: {
          user: { isActive: true },
          subscriptions: { some: { status: 'ACTIVE' } },
        },
      }),
      prisma.student.count({
        where: {
          user: { isActive: true },
          subscriptions: { some: { status: 'OVERDUE' } },
        },
      }),
      prisma.student.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.student.count({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      prisma.payment.aggregate({
        where: { status: 'PAID', paidDate: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: 'PAID',
          paidDate: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { amount: true },
      }),
      prisma.payment.count({
        where: {
          status: 'PENDING',
          dueDate: { lt: now },
        },
      }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.workoutSession.count({
        where: { completed: true, date: { gte: startOfMonth } },
      }),
      prisma.appointment.count({
        where: { status: 'SCHEDULED', date: { gte: now } },
      }),
      prisma.trainer.count({ where: { isActive: true } }),
      prisma.checkIn.count({
        where: { date: { gte: startOfMonth } },
      }),
      prisma.checkIn.count({
        where: {
          date: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          },
        },
      }),
    ])

    const monthlyRev = Number(monthlyRevenue._sum.amount || 0)
    const lastMonthRev = Number(lastMonthRevenue._sum.amount || 0)
    const revenueChange = lastMonthRev > 0
      ? Math.round(((monthlyRev - lastMonthRev) / lastMonthRev) * 100)
      : monthlyRev > 0 ? 100 : 0

    const newStudentsChange = lastMonthNewStudents > 0
      ? Math.round(((monthlyNewStudents - lastMonthNewStudents) / lastMonthNewStudents) * 100)
      : monthlyNewStudents > 0 ? 100 : 0

    const averageFrequency = totalStudents > 0
      ? Math.round((totalCheckins / totalStudents) * 10) / 10
      : 0

    const recentCheckins = await prisma.checkIn.findMany({
      orderBy: { date: 'desc' },
      take: 10,
      include: {
        student: { select: { id: true, fullName: true } },
        unit: { select: { id: true, name: true } },
      },
    })

    const recentPayments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        subscription: {
          include: {
            student: { select: { id: true, fullName: true } },
            plan: { select: { name: true } },
          },
        },
      },
    })

    return {
      totalStudents,
      activeStudents,
      overdueStudents,
      totalTrainers,
      monthlyNewStudents,
      newStudentsChange,
      activeSubscriptions,
      monthlyRevenue: monthlyRev,
      revenueChange,
      overduePayments,
      workoutsDone,
      pendingEvaluations,
      totalCheckins,
      todayCheckins,
      averageFrequency,
      recentCheckins,
      recentPayments,
    }
  }

  async getStudentDashboard(studentId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [student, activeSubscriptions, upcomingAppointments, recentCheckins, activeWorkouts, recentEvaluations, achievements] =
      await Promise.all([
        prisma.student.findUnique({
          where: { id: studentId },
          include: { ranking: true },
        }),
        prisma.subscription.findMany({
          where: { studentId, status: 'ACTIVE' },
          include: { plan: true },
        }),
        prisma.appointment.findMany({
          where: {
            studentId,
            status: 'SCHEDULED',
            date: { gte: now },
          },
          orderBy: { date: 'asc' },
          take: 5,
          include: { unit: { select: { name: true } } },
        }),
        prisma.checkIn.findMany({
          where: { studentId, date: { gte: startOfMonth } },
          orderBy: { date: 'desc' },
        }),
        prisma.workoutAssignment.findMany({
          where: { studentId, isActive: true },
          include: {
            workout: { select: { id: true, name: true } },
            sessions: { where: { date: { gte: startOfMonth } } },
          },
        }),
        prisma.evaluation.findMany({
          where: { studentId },
          orderBy: { date: 'desc' },
          take: 3,
          include: { measurements: true },
        }),
        prisma.studentAchievement.findMany({
          where: { studentId },
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
          take: 10,
        }),
      ])

    return {
      student,
      activeSubscriptions,
      upcomingAppointments,
      monthlyCheckins: recentCheckins.length,
      activeWorkouts,
      recentEvaluations,
      achievements,
    }
  }
}
