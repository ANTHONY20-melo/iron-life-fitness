import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'
import type { User, LoginPayload, RegisterPayload, AuthResponse } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  loadFromStorage: () => Promise<void>
  updateUser: (user: User) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (payload) => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    await AsyncStorage.setItem('ironlife_token', data.token)
    await AsyncStorage.setItem('ironlife_user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, isAuthenticated: true })
  },

  register: async (payload) => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    await AsyncStorage.setItem('ironlife_token', data.token)
    await AsyncStorage.setItem('ironlife_user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, isAuthenticated: true })
  },

  logout: async () => {
    await AsyncStorage.removeItem('ironlife_token')
    await AsyncStorage.removeItem('ironlife_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  loadFromStorage: async () => {
    try {
      const token = await AsyncStorage.getItem('ironlife_token')
      const userJson = await AsyncStorage.getItem('ironlife_user')
      if (token && userJson) {
        const user = JSON.parse(userJson) as User
        set({ user, token, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch {
      set({ isLoading: false })
    }
  },

  updateUser: (user) => set({ user }),
}))

export default useAuthStore
