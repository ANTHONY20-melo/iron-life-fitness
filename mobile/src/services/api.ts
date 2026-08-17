import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://localhost:3340/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('ironlife_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('ironlife_token')
      await AsyncStorage.removeItem('ironlife_user')
    }
    return Promise.reject(error)
  }
)

export default api
