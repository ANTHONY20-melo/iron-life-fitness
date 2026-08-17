import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Building, User, Bell, Save } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [unitForm, setUnitForm] = useState({
    name: 'Iron Life Fitness',
    address: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
    phone: '(11) 99999-9999',
    email: 'contato@ironlifefitness.com.br',
    cnpj: '00.000.000/0001-00',
    openHours: 'Seg-Sex: 06h-22h | Sáb: 08h-18h | Dom: 08h-14h',
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const update = (f: string, v: string) => setUnitForm((p) => ({ ...p, [f]: v }))

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-80" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie as configurações da academia</p>
      </div>

      {/* Unit info */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Dados da Unidade</h3>
        </div>
        <div className="space-y-4">
          <Input label="Nome da Academia" value={unitForm.name} onChange={(e) => update('name', e.target.value)} />
          <Input label="Endereço" value={unitForm.address} onChange={(e) => update('address', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Telefone" value={unitForm.phone} onChange={(e) => update('phone', e.target.value)} />
            <Input label="CNPJ" value={unitForm.cnpj} onChange={(e) => update('cnpj', e.target.value)} />
          </div>
          <Input label="E-mail" type="email" value={unitForm.email} onChange={(e) => update('email', e.target.value)} />
          <Input label="Horário de Funcionamento" value={unitForm.openHours} onChange={(e) => update('openHours', e.target.value)} />
        </div>
        <div className="flex justify-end mt-4">
          <Button icon={<Save className="w-4 h-4" />} onClick={() => toast.success('Configurações salvas!')}>
            Salvar
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Notificações</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Novo aluno cadastrado', desc: 'Receber notificação quando um aluno se cadastrar', enabled: true },
            { label: 'Pagamento atrasado', desc: 'Alertar sobre pagamentos vencidos', enabled: true },
            { label: 'Avaliação agendada', desc: 'Lembrete de avaliações próximas', enabled: true },
            { label: 'Check-in automático', desc: 'Notificar check-ins dos alunos', enabled: false },
          ].map((n, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
              <div>
                <p className="text-sm text-white">{n.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
              </div>
              <button
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  n.enabled ? 'bg-primary' : 'bg-[#2a2a2a]'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    n.enabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
