import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }
    try {
      await login(email, password)
      toast.success('Bem-vindo de volta!')
      const user = useAuthStore.getState().user
      navigate(user?.role === 'admin' || user?.role === 'trainer' ? '/admin' : '/student')
    } catch {
      // Error handled by interceptor
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-3 bg-primary rounded-xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-500 mt-2">Entre na sua conta Iron Life</p>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Ainda não tem conta?{' '}
              <Link to="/register" className="text-primary hover:text-primary-light transition-colors font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  )
}
