import { create } from 'zustand'
import api from '../services/api'
import type { Appointment } from '../types'

interface ScheduleState {
  appointments: Appointment[]
  isLoading: boolean
  fetchAppointments: () => Promise<void>
  createAppointment: (data: {
    trainerId: string
    date: string
    time: string
    type: string
  }) => Promise<void>
  cancelAppointment: (id: string) => Promise<void>
}

const useScheduleStore = create<ScheduleState>((set) => ({
  appointments: [],
  isLoading: false,

  fetchAppointments: async () => {
    set({ isLoading: true })
    try {
      const { data } = await api.get<Appointment[]>('/appointments')
      set({ appointments: data })
    } finally {
      set({ isLoading: false })
    }
  },

  createAppointment: async (payload) => {
    const { data } = await api.post<Appointment>('/appointments', payload)
    set((state) => ({ appointments: [data, ...state.appointments] }))
  },

  cancelAppointment: async (id) => {
    await api.delete(`/appointments/${id}`)
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      ),
    }))
  },
}))

export default useScheduleStore
