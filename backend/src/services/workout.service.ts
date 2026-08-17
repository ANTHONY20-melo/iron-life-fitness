import prisma from '../config/database'
import { NotFoundError, ConflictError, AppError } from '../utils/errors'
import { parsePagination, paginatedResponse } from '../utils/pagination'
import { CreateWorkoutInput, UpdateWorkoutInput, AssignWorkoutInput } from '../validators/workout'
import { Prisma } from '@prisma/client'

export class WorkoutService {
  async getAll(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(query)

    const where: Prisma.WorkoutWhereInput = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (query.trainerId) where.trainerId = query.trainerId
    if (query.dayOfWeek !== undefined) where.dayOfWeek = parseInt(query.dayOfWeek, 10)
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true'

    const [data, total] = await Promise.all([
      prisma.workout.findMany({
        where,
        include: {
          trainer: { select: { id: true, fullName: true } },
          _count: { select: { exercises: true, assignments: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.workout.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getById(id: string) {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        trainer: { select: { id: true, fullName: true, specialty: true } },
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        assignments: {
          include: {
            student: { select: { id: true, fullName: true } },
            sessions: {
              orderBy: { date: 'desc' },
              take: 5,
              include: {
                completions: true,
              },
            },
          },
        },
      },
    })
    if (!workout) throw new NotFoundError('Workout')
    return workout
  }

  async create(data: CreateWorkoutInput) {
    return prisma.$transaction(async (tx) => {
      const workout = await tx.workout.create({
        data: {
          name: data.name,
          description: data.description,
          dayOfWeek: data.dayOfWeek,
          trainerId: null,
        },
      })

      const exercises = await Promise.all(
        data.exercises.map((ex) =>
          tx.workoutExercise.create({
            data: {
              workoutId: workout.id,
              exerciseId: ex.exerciseId,
              order: ex.order,
              sets: ex.sets,
              reps: ex.reps,
              restSeconds: ex.restSeconds,
              weight: ex.weight || null,
              notes: ex.notes || null,
            },
            include: { exercise: true },
          })
        )
      )

      return { ...workout, exercises }
    })
  }

  async update(id: string, data: UpdateWorkoutInput) {
    const workout = await prisma.workout.findUnique({ where: { id } })
    if (!workout) throw new NotFoundError('Workout')

    return prisma.workout.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.dayOfWeek !== undefined && { dayOfWeek: data.dayOfWeek }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: {
        exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
      },
    })
  }

  async delete(id: string) {
    const workout = await prisma.workout.findUnique({ where: { id } })
    if (!workout) throw new NotFoundError('Workout')

    await prisma.workout.delete({ where: { id } })
    return { message: 'Workout deleted successfully' }
  }

  async assignToStudent(workoutId: string, studentId: string, data: AssignWorkoutInput) {
    const workout = await prisma.workout.findUnique({ where: { id: workoutId } })
    if (!workout) throw new NotFoundError('Workout')

    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    const existing = await prisma.workoutAssignment.findUnique({
      where: { studentId_workoutId: { studentId, workoutId } },
    })
    if (existing) throw new ConflictError('Workout already assigned to this student')

    const assignment = await prisma.workoutAssignment.create({
      data: {
        studentId,
        workoutId,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: {
        student: { select: { id: true, fullName: true } },
        workout: { select: { id: true, name: true } },
      },
    })

    return assignment
  }

  async getStudentWorkouts(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundError('Student')

    return prisma.workoutAssignment.findMany({
      where: { studentId, isActive: true },
      include: {
        workout: {
          include: {
            exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
          },
        },
        sessions: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    })
  }

  async createExercise(data: { name: string; muscleGroup: string; description?: string; equipment?: string; difficulty?: number }) {
    return prisma.exercise.create({
      data: {
        name: data.name,
        muscleGroup: data.muscleGroup,
        description: data.description || null,
        equipment: data.equipment || null,
        difficulty: data.difficulty || 1,
      },
    })
  }

  async getExercises(query: Record<string, string>) {
    const { page, limit, skip, sortBy, sortOrder, search } = parsePagination(query)

    const where: Prisma.ExerciseWhereInput = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { muscleGroup: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (query.muscleGroup) where.muscleGroup = query.muscleGroup
    if (query.equipment) where.equipment = query.equipment
    if (query.difficulty) where.difficulty = parseInt(query.difficulty, 10)

    const [data, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.exercise.count({ where }),
    ])

    return paginatedResponse(data, total, page, limit)
  }

  async getExerciseById(id: string) {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: { _count: { select: { workoutExercises: true } } },
    })
    if (!exercise) throw new NotFoundError('Exercise')
    return exercise
  }

  async updateExercise(id: string, data: Record<string, unknown>) {
    const exercise = await prisma.exercise.findUnique({ where: { id } })
    if (!exercise) throw new NotFoundError('Exercise')

    const updateData: {
      name?: string
      muscleGroup?: string
      description?: string | null
      equipment?: string | null
      difficulty?: number
    } = {}

    if (typeof data.name === 'string') updateData.name = data.name
    if (typeof data.muscleGroup === 'string') updateData.muscleGroup = data.muscleGroup
    if (data.description !== undefined) updateData.description = data.description as string | null
    if (data.equipment !== undefined) updateData.equipment = data.equipment as string | null
    if (typeof data.difficulty === 'number') updateData.difficulty = data.difficulty

    return prisma.exercise.update({
      where: { id },
      data: updateData,
    })
  }

  async deleteExercise(id: string) {
    const exercise = await prisma.exercise.findUnique({ where: { id } })
    if (!exercise) throw new NotFoundError('Exercise')

    await prisma.exercise.delete({ where: { id } })
    return { message: 'Exercise deleted successfully' }
  }

  async createSession(assignmentId: string) {
    const assignment = await prisma.workoutAssignment.findUnique({ where: { id: assignmentId } })
    if (!assignment) throw new NotFoundError('Workout assignment')

    return prisma.workoutSession.create({
      data: { assignmentId },
      include: {
        assignment: {
          include: {
            workout: {
              include: {
                exercises: { include: { exercise: true }, orderBy: { order: 'asc' } },
              },
            },
          },
        },
      },
    })
  }

  async completeExercise(sessionId: string, workoutExerciseId: string, data: {
    completed?: boolean
    setsDone?: number
    repsDone?: string
    weightUsed?: number
    notes?: string
  }) {
    const session = await prisma.workoutSession.findUnique({ where: { id: sessionId } })
    if (!session) throw new NotFoundError('Workout session')

    const workoutExercise = await prisma.workoutExercise.findUnique({ where: { id: workoutExerciseId } })
    if (!workoutExercise) throw new NotFoundError('Workout exercise')

    const existing = await prisma.exerciseCompletion.findFirst({
      where: { sessionId, exerciseId: workoutExerciseId },
    })

    if (existing) {
      return prisma.exerciseCompletion.update({
        where: { id: existing.id },
        data: {
          completed: data.completed ?? true,
          setsDone: data.setsDone,
          repsDone: data.repsDone,
          weightUsed: data.weightUsed,
          notes: data.notes,
        },
      })
    }

    return prisma.exerciseCompletion.create({
      data: {
        sessionId,
        exerciseId: workoutExerciseId,
        completed: data.completed ?? true,
        setsDone: data.setsDone,
        repsDone: data.repsDone,
        weightUsed: data.weightUsed,
        notes: data.notes,
      },
    })
  }

  async completeSession(sessionId: string, data?: { duration?: number; calories?: number; notes?: string }) {
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        assignment: {
          include: { workout: { include: { exercises: true } } },
        },
        completions: true,
      },
    })
    if (!session) throw new NotFoundError('Workout session')

    const totalExercises = session.assignment.workout.exercises.length
    const completedExercises = session.completions.filter((c) => c.completed).length

    return prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        duration: data?.duration,
        calories: data?.calories,
        notes: data?.notes,
      },
    })
  }
}
