import { create } from 'zustand'
import api from '../services/api'
import type { Workout, WorkoutSession, Exercise } from '../types'

interface WorkoutState {
  workouts: Workout[]
  currentWorkout: Workout | null
  todayWorkout: Workout | null
  sessions: WorkoutSession[]
  isLoading: boolean
  fetchWorkouts: () => Promise<void>
  fetchWorkoutById: (id: string) => Promise<void>
  fetchTodayWorkout: () => Promise<void>
  fetchSessions: () => Promise<void>
  startSession: (workoutId: string) => Promise<WorkoutSession>
  completeExercise: (sessionId: string, exerciseId: string) => Promise<void>
  finishSession: (sessionId: string) => Promise<void>
}

const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  currentWorkout: null,
  todayWorkout: null,
  sessions: [],
  isLoading: false,

  fetchWorkouts: async () => {
    set({ isLoading: true })
    try {
      const { data } = await api.get<Workout[]>('/workouts')
      set({ workouts: data })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchWorkoutById: async (id) => {
    set({ isLoading: true })
    try {
      const { data } = await api.get<Workout>(`/workouts/${id}`)
      set({ currentWorkout: data })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchTodayWorkout: async () => {
    try {
      const { data } = await api.get<Workout | null>('/workouts/today')
      set({ todayWorkout: data })
    } catch {
      set({ todayWorkout: null })
    }
  },

  fetchSessions: async () => {
    try {
      const { data } = await api.get<WorkoutSession[]>('/sessions')
      set({ sessions: data })
    } catch {
      set({ sessions: [] })
    }
  },

  startSession: async (workoutId) => {
    const { data } = await api.post<WorkoutSession>('/sessions', { workoutId })
    set((state) => ({ sessions: [data, ...state.sessions] }))
    return data
  },

  completeExercise: async (sessionId, exerciseId) => {
    await api.post(`/sessions/${sessionId}/complete-exercise`, { exerciseId })
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, completedExercises: [...s.completedExercises, exerciseId] }
          : s
      ),
    }))
  },

  finishSession: async (sessionId) => {
    await api.post(`/sessions/${sessionId}/finish`)
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId ? { ...s, completed: true } : s
      ),
    }))
  },
}))

export default useWorkoutStore
