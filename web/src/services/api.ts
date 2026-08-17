import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ironlife_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const msg = err.response?.data?.error || err.message || 'Erro desconhecido'

    if (status === 401) {
      localStorage.removeItem('ironlife_token')
      localStorage.removeItem('ironlife_user')
      window.location.href = '/login'
      return Promise.reject(err)
    }

    if (status === 403) {
      toast.error('Acesso negado')
    } else if (status === 404) {
      toast.error('Recurso não encontrado')
    } else if (status === 422) {
      toast.error(msg)
    } else if (status && status >= 500) {
      toast.error('Erro no servidor. Tente novamente.')
    } else {
      toast.error(msg)
    }

    return Promise.reject(err)
  }
)

export default api
