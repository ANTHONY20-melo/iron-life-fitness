import prisma from '../config/database'
import { NotFoundError } from '../utils/errors'

interface CreateEvaluationInput {
  studentId: string
  trainerId?: string
  date?: string
  weight?: number
  height?: number
  bodyFatPercent?: number
  muscleMass?: number
  visceralFat?: number
  basalMetabolism?: number
  observations?: string
  measurements?: {
    arm?: number
    chest?: number
    waist?: number
    hip?: number
    thigh?: number
    calf?: number
  }
}

export class EvaluationService {
  async create(data: CreateEvaluationInput) {
    const student = await prisma.student.findUnique({ where: { id: data.studentId } })
    if (!student) throw new NotFoundError('Student')

    const bmi =
      data.weight && data.height
        ? parseFloat((data.weight / Math.pow(data.height / 100, 2)).toFixed(2))
        : null

    return prisma.$transaction(async (tx) => {
      const evaluation = await tx.evaluation.create({
        data: {
          studentId: data.studentId,
          trainerId: data.trainerId || null,
          date: data.date ? new Date(data.date) : new Date(),
          weight: data.weight || null,
          height: data.height || null,
          bodyFatPercent: data.bodyFatPercent || null,
          muscleMass: data.muscleMass || null,
          visceralFat: data.visceralFat || null,
          basalMetabolism: data.basalMetabolism || null,
          bmi,
          observations: data.observations || null,
        },
      })

      if (data.measurements) {
        await tx.bodyMeasurement.create({
          data: {
            evaluationId: evaluation.id,
            arm: data.measurements.arm || null,
            chest: data.measurements.chest || null,
            waist: data.measurements.waist || null,
            hip: data.measurements.hip || null,
            thigh: data.measurements.thigh || null,
            calf: data.measurements.calf || null,
          },
        })
      }

      if (data.weight || data.height || data.bodyFatPercent || data.muscleMass) {
        await tx.student.update({
          where: { id: data.studentId },
          data: {
            ...(data.weight && { weight: data.weight }),
            ...(data.height && { height: data.height }),
            ...(data.bodyFatPercent !== undefined && { bodyFatPercent: data.bodyFatPercent }),
            ...(data.muscleMass !== undefined && { muscleMass: data.muscleMass }),
          },
        })
      }

      return tx.evaluation.findUnique({
        where: { id: evaluation.id },
        include: { measurements: true },
      })
    })
  }

  async getByStudent(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    return prisma.evaluation.findMany({
      where: { studentId },
      include: { measurements: true, trainer: { select: { id: true, fullName: true } } },
      orderBy: { date: 'desc' },
    })
  }

  async getById(id: string) {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      include: {
        measurements: true,
        student: { select: { id: true, fullName: true } },
        trainer: { select: { id: true, fullName: true } },
      },
    })
    if (!evaluation) throw new NotFoundError('Evaluation')
    return evaluation
  }

  async getLatest(studentId: string) {
    const evaluation = await prisma.evaluation.findFirst({
      where: { studentId },
      include: { measurements: true },
      orderBy: { date: 'desc' },
    })
    if (!evaluation) throw new NotFoundError('Evaluation')
    return evaluation
  }

  async compare(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    const evaluations = await prisma.evaluation.findMany({
      where: { studentId },
      include: { measurements: true },
      orderBy: { date: 'asc' },
    })

    if (evaluations.length < 2) {
      return {
        evaluations,
        comparison: null,
        message: 'At least 2 evaluations needed for comparison',
      }
    }

    const first = evaluations[0]
    const latest = evaluations[evaluations.length - 1]

    const comparison = {
      weight: {
        first: first.weight,
        latest: latest.weight,
        change: latest.weight && first.weight ? Number(latest.weight) - Number(first.weight) : null,
      },
      bodyFatPercent: {
        first: first.bodyFatPercent,
        latest: latest.bodyFatPercent,
        change:
          latest.bodyFatPercent && first.bodyFatPercent
            ? Number(latest.bodyFatPercent) - Number(first.bodyFatPercent)
            : null,
      },
      muscleMass: {
        first: first.muscleMass,
        latest: latest.muscleMass,
        change:
          latest.muscleMass && first.muscleMass ? Number(latest.muscleMass) - Number(first.muscleMass) : null,
      },
      bmi: {
        first: first.bmi,
        latest: latest.bmi,
        change: latest.bmi && first.bmi ? Number(latest.bmi) - Number(first.bmi) : null,
      },
    }

    return { evaluations, comparison }
  }
}
