import { z } from 'zod'

export const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  muscleGroup: z.string().min(1, 'Muscle group is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  equipment: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).default(1),
})

export const workoutExerciseSchema = z.object({
  exerciseId: z.string().uuid('Invalid exercise ID'),
  order: z.number().int().min(1),
  sets: z.number().int().min(1).default(3),
  reps: z.string().min(1, 'Reps are required'),
  restSeconds: z.number().int().min(0).default(90),
  weight: z.number().positive().optional(),
  notes: z.string().optional(),
})

export const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  description: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  exercises: z.array(workoutExerciseSchema).min(1, 'At least one exercise is required'),
})

export const updateWorkoutSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional().nullable(),
  isActive: z.boolean().optional(),
})

export const assignWorkoutSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const completeExerciseSchema = z.object({
  completed: z.boolean().default(true),
  setsDone: z.number().int().min(0).optional(),
  repsDone: z.string().optional(),
  weightUsed: z.number().positive().optional(),
  notes: z.string().optional(),
})

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>
export type AssignWorkoutInput = z.infer<typeof assignWorkoutSchema>
export type CompleteExerciseInput = z.infer<typeof completeExerciseSchema>
