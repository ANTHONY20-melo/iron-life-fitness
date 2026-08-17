import { create } from 'zustand'
import api from '@/services/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loadFromStorage: () => void
  updateUser: (user: User) => void
}

interface RegisterData {
  name: string
  email: string
  cpf: string
  phone: string
  password: string
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('ironlife_token', data.token)
      localStorage.setItem('ironlife_user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  register: async (formData: RegisterData) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/register', formData)
      localStorage.setItem('ironlife_token', data.token)
      localStorage.setItem('ironlife_user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('ironlife_token')
    localStorage.removeItem('ironlife_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('ironlife_token')
    const userStr = localStorage.getItem('ironlife_user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        set({ user, token, isAuthenticated: true })
      } catch {
        localStorage.removeItem('ironlife_token')
        localStorage.removeItem('ironlife_user')
      }
    }
  },

  updateUser: (user: User) => {
    localStorage.setItem('ironlife_user', JSON.stringify(user))
    set({ user })
  },
}))
