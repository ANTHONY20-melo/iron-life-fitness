import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Mail, Lock, User, Phone, CreditCard, Eye, EyeOff, Calendar, Male, Female } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', email: '', cpf: '', phone: '', birthDate: '', gender: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    if (form.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        cpf: form.cpf || undefined,
        phone: form.phone,
        birthDate: form.birthDate || undefined,
        gender: form.gender || undefined,
        password: form.password,
      })
      toast.success('Conta criada com sucesso!')
      navigate('/student')
    } catch {
      // Error handled by interceptor
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-3 bg-primary rounded-xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
          <p className="text-sm text-gray-500 mt-2">Comece sua jornada no Iron Life</p>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="CPF (opcional)"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => update('cpf', e.target.value)}
                icon={<CreditCard className="w-4 h-4" />}
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-9999"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data de nascimento (opcional)"
                type="date"
                value={form.birthDate}
                onChange={(e) => update('birthDate', e.target.value)}
                icon={<Calendar className="w-4 h-4" />}
              />
              <Select
                label="Gênero (opcional)"
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                options={[
                  { value: '', label: 'Selecione' },
                  { value: 'MALE', label: 'Masculino' },
                  { value: 'FEMALE', label: 'Feminino' },
                  { value: 'OTHER', label: 'Outro' },
                ]}
                icon={<Male className="w-4 h-4" />}
              />
            </div>
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
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
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <Button type="submit" loading={isLoading} className="w-full" size="lg">
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-medium">
                Entrar
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
