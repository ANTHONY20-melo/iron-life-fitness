import { create } from 'zustand'
import api from '../services/api'
import type { Measurement } from '../types'

interface EvolutionState {
  measurements: Measurement[]
  latest: Measurement | null
  isLoading: boolean
  fetchMeasurements: () => Promise<void>
  addMeasurement: (data: Partial<Measurement>) => Promise<void>
}

const useEvolutionStore = create<EvolutionState>((set) => ({
  measurements: [],
  latest: null,
  isLoading: false,

  fetchMeasurements: async () => {
    set({ isLoading: true })
    try {
      const { data } = await api.get<Measurement[]>('/measurements')
      set({
        measurements: data,
        latest: data.length > 0 ? data[0] : null,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  addMeasurement: async (payload) => {
    const { data } = await api.post<Measurement>('/measurements', payload)
    set((state) => ({
      measurements: [data, ...state.measurements],
      latest: data,
    }))
  },
}))

export default useEvolutionStore
