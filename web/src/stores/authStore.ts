import { create } from 'zustand'
import api from '@/services/api'
import type { User } from '@/types'

// Version to force clear old cached data with lowercase roles
const STORAGE_VERSION = '2.0'

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
  fullName: string
  email: string
  cpf?: string
  phone?: string
  birthDate?: string
  gender?: string
  password: string
}

function clearOldStorage() {
  const storedVersion = localStorage.getItem('ironlife_version')
  if (storedVersion !== STORAGE_VERSION) {
    localStorage.removeItem('ironlife_token')
    localStorage.removeItem('ironlife_user')
    localStorage.setItem('ironlife_version', STORAGE_VERSION)
  }
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
      localStorage.setItem('ironlife_version', STORAGE_VERSION)
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
      localStorage.setItem('ironlife_version', STORAGE_VERSION)
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
    clearOldStorage()
    const token = localStorage.getItem('ironlife_token')
    const userStr = localStorage.getItem('ironlife_user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        // Validate role is uppercase (new format)
        if (user.role && !['STUDENT', 'TRAINER', 'ADMIN'].includes(user.role)) {
          throw new Error('Old role format')
        }
        set({ user, token, isAuthenticated: true })
      } catch {
        localStorage.removeItem('ironlife_token')
        localStorage.removeItem('ironlife_user')
      }
    }
  },

  updateUser: (user: User) => {
    localStorage.setItem('ironlife_user', JSON.stringify(user))
    localStorage.setItem('ironlife_version', STORAGE_VERSION)
    set({ user })
  },
}))