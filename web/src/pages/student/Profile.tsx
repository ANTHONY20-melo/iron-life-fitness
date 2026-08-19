import { useState, useEffect, useRef } from 'react'
import { User, Mail, Phone, Camera, Lock, Save, Weight, Ruler, Target, FileText, Upload, Trash2, Bell, BellOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Avatar from '@/components/common/Avatar'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'
import { useNotifications } from '@/hooks/useNotifications'
import type { MedicalExam } from '@/types'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exams, setExams] = useState<MedicalExam[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const notifications = useNotifications()

  const student = user?.student
  const [form, setForm] = useState({
    name: student?.fullName || '',
    email: user?.email || '',
    phone: student?.phone || '',
    weight: student?.weight?.toString() || '',
    height: student?.height?.toString() || '',
    goal: student?.goal || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setForm({
        name: student?.fullName || '',
        email: user?.email || '',
        phone: student?.phone || '',
        weight: student?.weight?.toString() || '',
        height: student?.height?.toString() || '',
        goal: student?.goal || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [user, student])

  // Carrega exames ao montar
  useEffect(() => {
    if (!loading) loadExams()
  }, [loading])

  const loadExams = async () => {
    try {
      const token = localStorage.getItem('ironlife_token')
      const res = await fetch('/api/student/profile/exams', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setExams(data.data)
    } catch {
      // Silently fail — exams are optional
    }
  }

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('ironlife_token')
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          weight: form.weight ? parseFloat(form.weight) : undefined,
          height: form.height ? parseFloat(form.height) : undefined,
          goal: form.goal || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        // Atualiza o user no store
        if (user?.student) {
          const updatedStudent = {
            ...user.student,
            fullName: form.name || user.student.fullName,
            phone: form.phone || user.student.phone,
            weight: form.weight ? parseFloat(form.weight) : user.student.weight,
            height: form.height ? parseFloat(form.height) : user.student.height,
            goal: form.goal || user.student.goal,
          }
          updateUser({ ...user, student: updatedStudent })
        }
        toast.success('Perfil atualizado!')
      } else {
        toast.error(data.error || 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro ao conectar com o servidor')
    } finally {
      setSaving(false)
    }
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

  // Upload de exame
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB.')
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use PDF, JPEG ou PNG.')
      return
    }

    setUploading(true)
    try {
      const base64 = await fileToBase64(file)
      const token = localStorage.getItem('ironlife_token')
      const res = await fetch('/api/student/profile/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
          fileName: file.name,
          fileBase64: base64,
          mimeType: file.type,
          fileSize: file.size,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setExams((prev) => [data.data, ...prev])
        toast.success('Exame anexado com sucesso!')
      } else {
        toast.error(data.error || 'Erro ao enviar arquivo')
      }
    } catch {
      toast.error('Erro ao enviar arquivo')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Deseja excluir este exame?')) return
    try {
      const token = localStorage.getItem('ironlife_token')
      const res = await fetch(`/api/student/profile/exams/${examId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setExams((prev) => prev.filter((e) => e.id !== examId))
        toast.success('Exame excluído')
      }
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  const handleViewExam = async (exam: MedicalExam) => {
    try {
      const token = localStorage.getItem('ironlife_token')
      const res = await fetch(`/api/student/profile/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        const full = data.data.find((e: MedicalExam) => e.id === exam.id)
        if (full?.fileBase64) {
          // Abre o arquivo em nova aba
          const byteChars = atob(full.fileBase64)
          const byteArr = new Uint8Array(byteChars.length)
          for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i)
          const blob = new Blob([byteArr], { type: exam.mimeType })
          const url = URL.createObjectURL(blob)
          window.open(url, '_blank')
          setTimeout(() => URL.revokeObjectURL(url), 30000)
        }
      }
    } catch {
      toast.error('Erro ao abrir exame')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const bmi = form.weight && form.height
    ? (parseFloat(form.weight) / (parseFloat(form.height) / 100) ** 2).toFixed(1)
    : null

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

      {/* Photo + Name */}
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
            {bmi && (
              <p className="text-xs text-primary mt-1">IMC: {bmi}</p>
            )}
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
            disabled
          />
          <Input
            label="Telefone"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveProfile} loading={saving} icon={<Save className="w-4 h-4" />}>
            Salvar
          </Button>
        </div>
      </Card>

      {/* Body stats */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Weight className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Dados Corporais</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              min="20"
              max="300"
              value={form.weight}
              onChange={(e) => update('weight', e.target.value)}
              icon={<Weight className="w-4 h-4" />}
              placeholder="Ex: 80.5"
            />
            <Input
              label="Altura (cm)"
              type="number"
              step="0.1"
              min="100"
              max="250"
              value={form.height}
              onChange={(e) => update('height', e.target.value)}
              icon={<Ruler className="w-4 h-4" />}
              placeholder="Ex: 178"
            />
          </div>
          {bmi && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-lg">
              <span className="text-xs text-gray-400">IMC:</span>
              <span className={`text-sm font-medium ${
                parseFloat(bmi) < 18.5 ? 'text-yellow-400' :
                parseFloat(bmi) < 25 ? 'text-green-400' :
                parseFloat(bmi) < 30 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {bmi}
              </span>
              <span className="text-xs text-gray-500">
                ({parseFloat(bmi) < 18.5 ? 'Abaixo do peso' :
                  parseFloat(bmi) < 25 ? 'Peso normal' :
                  parseFloat(bmi) < 30 ? 'Sobrepeso' : 'Obesidade'})
              </span>
            </div>
          )}
          <Input
            label="Meta de treino"
            value={form.goal}
            onChange={(e) => update('goal', e.target.value)}
            icon={<Target className="w-4 h-4" />}
            placeholder="Ex: Perder 10 kg, Ganhar massa muscular..."
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveProfile} loading={saving} icon={<Save className="w-4 h-4" />}>
            Salvar Dados
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Notificações de Treino</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Receba uma notificação diária com o treino do dia às 7h da manhã.
        </p>
        {notifications.isSupported ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifications.enabled ? (
                <Bell className="w-5 h-5 text-green-400" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-sm text-white">
                {notifications.enabled ? 'Ativadas' : 'Desativadas'}
              </span>
            </div>
            <div className="flex gap-2">
              {notifications.enabled ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={notifications.sendTestNotification}
                  >
                    Testar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={notifications.disable}
                    icon={<BellOff className="w-4 h-4" />}
                  >
                    Desativar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={notifications.requestPermission}
                  icon={<Bell className="w-4 h-4" />}
                >
                  Ativar
                </Button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Seu navegador não suporta notificações push.
          </p>
        )}
      </Card>

      {/* Medical exams */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-white">Exames Médicos</h3>
          </div>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
            icon={<Upload className="w-4 h-4" />}
          >
            Anexar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Anexe exames, laudos ou documentos médicos (PDF, JPEG, PNG — máx. 10MB).
        </p>
        {exams.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Nenhum exame anexado</p>
            <p className="text-xs text-gray-600 mt-1">Clique em "Anexar" para adicionar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{exam.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(exam.fileSize)} • {exam.fileName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewExam(exam)}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                    title="Visualizar"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:image/...;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
