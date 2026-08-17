import prisma from '../config/database'
import { NotFoundError } from '../utils/errors'
import { AchievementCategory } from '@prisma/client'

export class AchievementService {
  async getAll() {
    return prisma.achievement.findMany({
      where: { isActive: true },
      include: { _count: { select: { studentAchievements: true } } },
      orderBy: { points: 'desc' },
    })
  }

  async getById(id: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { id },
      include: { studentAchievements: true },
    })
    if (!achievement) throw new NotFoundError('Achievement')
    return achievement
  }

  async getByStudent(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    return prisma.studentAchievement.findMany({
      where: { studentId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    })
  }

  async checkAndUnlock(studentId: string) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        checkins: true,
        workouts: {
          include: { sessions: { where: { completed: true } } },
        },
        achievements: { select: { achievementId: true } },
      },
    })
    if (!student) throw new NotFoundError('Student')

    const allAchievements = await prisma.achievement.findMany({ where: { isActive: true } })
    const unlockedIds = new Set(student.achievements.map((a) => a.achievementId))
    const totalCheckins = student.checkins.length
    const totalCompletedSessions = student.workouts.reduce(
      (sum, assignment) => sum + assignment.sessions.filter((s) => s.completed).length,
      0
    )

    const newlyUnlocked: { achievementId: string; name: string; points: number }[] = []

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue
      if (!achievement.requirement) continue

      let qualified = false

      switch (achievement.category) {
        case 'WORKOUT':
          qualified = totalCompletedSessions >= achievement.requirement
          break
        case 'FREQUENCY':
          qualified = totalCheckins >= achievement.requirement
          break
        case 'STREAK': {
          const streak = this.calculateStreak(student.checkins.map((c) => c.date))
          qualified = streak >= achievement.requirement
          break
        }
        case 'MILESTONE':
          qualified = student.points >= achievement.requirement
          break
        case 'SPECIAL':
          qualified = totalCheckins >= achievement.requirement
          break
        default:
          break
      }

      if (qualified) {
        await prisma.studentAchievement.create({
          data: {
            studentId,
            achievementId: achievement.id,
          },
        })

        await prisma.student.update({
          where: { id: studentId },
          data: { points: { increment: achievement.points } },
        })

        newlyUnlocked.push({
          achievementId: achievement.id,
          name: achievement.name,
          points: achievement.points,
        })
      }
    }

    return {
      totalUnlocked: unlockedIds.size + newlyUnlocked.length,
      newlyUnlocked,
    }
  }

  async getLeaderboard() {
    return prisma.student.findMany({
      select: {
        id: true,
        fullName: true,
        points: true,
        level: true,
        avatarUrl: true,
      },
      orderBy: { points: 'desc' },
      take: 50,
    })
  }

  private calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const normalized = dates.map((d) => {
      const nd = new Date(d)
      nd.setHours(0, 0, 0, 0)
      return nd.getTime()
    })

    const uniqueDates = [...new Set(normalized)].sort((a, b) => b - a)

    let streak = 0
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
}
