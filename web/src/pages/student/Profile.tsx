import { useState, useEffect } from 'react'
import { User, Mail, Phone, Camera, Lock, Save } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Avatar from '@/components/common/Avatar'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: user?.student?.name || '',
    email: user?.email || '',
    phone: user?.student?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setForm({
        name: user?.student?.name || '',
        email: user?.email || '',
        phone: user?.student?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [user])

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado!')
  }

  const handleChangePassword = () => {
    if (!form.currentPassword || !form.newPassword) {
      toast.error('Preencha todos os campos')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    if (form.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    toast.success('Senha alterada com sucesso!')
    setForm((p) => ({ ...p, currentPassword: '', newPassword: '', confirmPassword: '' }))
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80" />
        <Skeleton className="h-60" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie suas informações</p>
      </div>

      {/* Photo */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar name={form.name || form.email} size="lg" />
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{form.name || 'Aluno'}</h3>
            <p className="text-sm text-gray-500">{form.email}</p>
            <p className="text-xs text-primary mt-1">Plano Premium</p>
          </div>
        </div>
      </Card>

      {/* Personal info */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Informações Pessoais</h3>
        </div>
        <div className="space-y-4">
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveProfile} icon={<Save className="w-4 h-4" />}>Salvar</Button>
        </div>
      </Card>

      {/* Change password */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Alterar Senha</h3>
        </div>
        <div className="space-y-4">
          <Input
            label="Senha Atual"
            type="password"
            value={form.currentPassword}
            onChange={(e) => update('currentPassword', e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />
          <Input
            label="Nova Senha"
            type="password"
            value={form.newPassword}
            onChange={(e) => update('newPassword', e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />
          <Input
            label="Confirmar Nova Senha"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="secondary" onClick={handleChangePassword} icon={<Lock className="w-4 h-4" />}>
            Alterar Senha
          </Button>
        </div>
      </Card>
    </div>
  )
}
