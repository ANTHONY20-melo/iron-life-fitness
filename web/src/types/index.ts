export interface User {
  id: string
  email: string
  role: 'student' | 'trainer' | 'admin'
  student?: Student
  trainer?: Trainer
  createdAt: string
}

export interface Student {
  id: string
  userId: string
  name: string
  cpf: string
  phone: string
  photo?: string
  birthDate?: string
  gender?: string
  planId?: string
  plan?: Plan
  status: 'active' | 'inactive' | 'overdue'
  points: number
  level: number
  joinDate: string
}

export interface Trainer {
  id: string
  userId: string
  name: string
  cref: string
  specialty: string
  bio?: string
  photo?: string
  status: 'active' | 'inactive'
}

export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  status: 'active' | 'inactive'
}

export interface Workout {
  id: string
  name: string
  trainerId: string
  trainer?: Trainer
  dayOfWeek?: string
  exercises: WorkoutExercise[]
  assignedStudents?: string[]
  createdAt: string
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  exercise?: Exercise
  sets: number
  reps: string
  rest: number
  weight?: number
  order: number
  notes?: string
}

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructions?: string
  imageUrl?: string
}

export interface WorkoutSession {
  id: string
  studentId: string
  workoutId: string
  workout?: Workout
  date: string
  duration?: number
  calories?: number
  exercisesCompleted: number
  totalExercises: number
  status: 'in_progress' | 'completed'
}

export interface BodyMeasurement {
  id: string
  studentId: string
  date: string
  weight?: number
  height?: number
  bodyFat?: number
  muscleMass?: number
  arm?: number
  chest?: number
  waist?: number
  hip?: number
  thigh?: number
  photoFront?: string
  photoBack?: string
  photoSide?: string
}

export interface Assessment {
  id: string
  studentId: string
  trainerId: string
  trainer?: Trainer
  date: string
  weight?: number
  height?: number
  bodyFat?: number
  muscleMass?: number
  imc?: number
  cardio?: string
  flexibility?: string
  strength?: string
  notes?: string
}

export interface Payment {
  id: string
  studentId: string
  student?: Student
  planId?: string
  plan?: Plan
  amount: number
  date: string
  dueDate?: string
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  method?: string
  description?: string
}

export interface CheckIn {
  id: string
  studentId: string
  student?: Student
  date: string
  time: string
  type: 'qr_code' | 'manual'
}

export interface Schedule {
  id: string
  studentId?: string
  trainerId?: string
  title: string
  date: string
  time: string
  duration: number
  type: 'personal' | 'evaluation' | 'class'
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  points: number
  unlocked: boolean
  unlockedAt?: string
}

export interface DashboardStats {
  totalStudents: number
  activeStudents: number
  overdueStudents: number
  monthlyRevenue: number
  newStudentsMonth: number
  workoutsDone: number
}
