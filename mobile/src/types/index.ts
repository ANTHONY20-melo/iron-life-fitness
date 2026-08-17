export interface User {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  role: 'client' | 'trainer' | 'admin'
  avatarUrl?: string
  points: number
  level: number
  createdAt: string
}

export interface Workout {
  id: string
  name: string
  description: string
  dayOfWeek: string
  exercises: Exercise[]
  assignedTo: string
  createdBy: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  restSeconds: number
  weight?: number
  notes?: string
  muscleGroup: string
}

export interface WorkoutSession {
  id: string
  workoutId: string
  userId: string
  date: string
  completed: boolean
  completedExercises: string[]
  duration?: number
}

export interface Measurement {
  id: string
  userId: string
  date: string
  weight?: number
  height?: number
  bodyFat?: number
  muscleMass?: number
  chest?: number
  waist?: number
  hips?: number
  arms?: number
  thighs?: number
}

export interface Appointment {
  id: string
  userId: string
  trainerId: string
  trainerName: string
  date: string
  time: string
  type: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface Payment {
  id: string
  userId: string
  amount: number
  date: string
  dueDate: string
  status: 'paid' | 'pending' | 'overdue'
  plan: string
  method?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  requirement: number
  progress: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'achievement'
  read: boolean
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  cpf: string
  phone: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
