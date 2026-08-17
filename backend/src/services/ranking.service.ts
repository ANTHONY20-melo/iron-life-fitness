import prisma from '../config/database'

export class RankingService {
  async updateRanking() {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    const students = await prisma.student.findMany({
      where: { user: { isActive: true } },
      select: { id: true, points: true },
      orderBy: { points: 'desc' },
    })

    const levelMap: Record<string, string> = {
      0: 'INICIANTE',
      100: 'INTERMEDIARIO',
      300: 'AVANCADO',
      600: 'EXPERT',
      1000: 'LENDA',
    }

    for (let i = 0; i < students.length; i++) {
      const student = students[i]
      const position = i + 1

      let currentLevel = 'INICIANTE'
      for (const [threshold, level] of Object.entries(levelMap).sort(
        (a, b) => Number(b[0]) - Number(a[0])
      )) {
        if (student.points >= Number(threshold)) {
          currentLevel = level
          break
        }
      }

      await prisma.ranking.upsert({
        where: {
          studentId_month_year: { studentId: student.id, month, year },
        },
        update: {
          totalPoints: student.points,
          currentLevel,
          position,
        },
        create: {
          studentId: student.id,
          totalPoints: student.points,
          currentLevel,
          month,
          year,
          position,
        },
      })

      await prisma.student.update({
        where: { id: student.id },
        data: { level: currentLevel },
      })
    }

    return { updated: students.length, month, year }
  }

  async getLeaderboard(month?: number, year?: number) {
    const now = new Date()
    const m = month || now.getMonth() + 1
    const y = year || now.getFullYear()

    const rankings = await prisma.ranking.findMany({
      where: { month: m, year: y },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            points: true,
            level: true,
          },
        },
      },
      orderBy: { position: 'asc' },
    })

    return rankings
  }

  async getStudentRank(studentId: string, month?: number, year?: number) {
    const now = new Date()
    const m = month || now.getMonth() + 1
    const y = year || now.getFullYear()

    const ranking = await prisma.ranking.findUnique({
      where: {
        studentId_month_year: { studentId, month: m, year: y },
      },
      include: {
        student: { select: { id: true, fullName: true, points: true, level: true } },
      },
    })

    if (!ranking) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { id: true, fullName: true, points: true, level: true },
      })
      return { ranking: null, student, position: null }
    }

    return { ranking, position: ranking.position }
  }
}
