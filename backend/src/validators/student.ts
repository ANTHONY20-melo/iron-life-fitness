import { z } from 'zod'

export const createStudentSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  unitId: z.string().uuid().optional(),
  trainerId: z.string().uuid().optional(),
  goal: z.string().optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  muscleMass: z.number().positive().optional(),
})

export const updateStudentSchema = z.object({
  fullName: z.string().min(2).optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  unitId: z.string().uuid().optional().nullable(),
  trainerId: z.string().uuid().optional().nullable(),
  goal: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  muscleMass: z.number().positive().optional(),
})

export const updateBodyStatsSchema = z.object({
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  bodyFatPercent: z.number().min(0).max(100).optional(),
  muscleMass: z.number().positive().optional(),
})

export type CreateStudentInput = z.infer<typeof createStudentSchema>
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>
export type UpdateBodyStatsInput = z.infer<typeof updateBodyStatsSchema>
