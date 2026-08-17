import { useState, useEffect } from 'react'
import { QrCode, UserPlus, Clock, Users, Camera } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Input from '@/components/common/Input'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

const mockCheckins = [
  { id: '1', name: 'Marcos Silva', date: '2026-08-15', time: '08:15', type: 'qr_code' },
  { id: '2', name: 'Juliana Santos', date: '2026-08-15', time: '07:42', type: 'qr_code' },
  { id: '3', name: 'Pedro Almeida', date: '2026-08-15', time: '07:30', type: 'manual' },
  { id: '4', name: 'Ana Lima', date: '2026-08-15', time: '18:20', type: 'qr_code' },
  { id: '5', name: 'Carlos Souza', date: '2026-08-14', time: '17:55', type: 'qr_code' },
  { id: '6', name: 'Fernanda Costa', date: '2026-08-14', time: '09:10', type: 'manual' },
]

const frequencyData = [
  { day: 'Seg', count: 48 },
  { day: 'Ter', count: 52 },
  { day: 'Qua', count: 45 },
  { day: 'Qui', count: 55 },
  { day: 'Sex', count: 50 },
  { day: 'Sáb', count: 30 },
  { day: 'Dom', count: 12 },
]

export default function CheckIns() {
  const [loading, setLoading] = useState(true)
  const [manualName, setManualName] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleManualCheckin = () => {
    if (!manualName.trim()) { toast.error('Digite o nome do aluno'); return }
    toast.success(`Check-in registrado para ${manualName}`)
    setManualName('')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Check-in</h1>
        <p className="text-sm text-gray-500 mt-1">Registro de presença</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code scanner */}
        <Card className="text-center">
          <div className="py-8">
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Leitor QR Code</h3>
            <p className="text-sm text-gray-500 mb-4">Posicione o QR Code do aluno na câmera</p>
            <Button icon={<Camera className="w-4 h-4" />}>Abrir Câmera</Button>
          </div>
        </Card>

        {/* Manual check-in */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-white">Check-in Manual</h3>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Nome ou CPF do aluno"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              icon={<Users className="w-4 h-4" />}
            />
            <Button className="w-full" onClick={handleManualCheckin}>
              Registrar Check-in
            </Button>
          </div>
        </Card>
      </div>

      {/* Frequency by day */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-4">Frequência por Dia da Semana</h3>
        <div className="space-y-3">
          {frequencyData.map((d) => (
            <div key={d.day} className="flex items-center gap-4">
              <span className="text-sm text-gray-400 w-8">{d.day}</span>
              <div className="flex-1 bg-[#0a0a0a] rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${(d.count / 60) * 100}%` }}
                >
                  <span className="text-[10px] text-white font-medium">{d.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent check-ins */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Check-ins Recentes</h3>
        </div>
        <div className="divide-y divide-[#2a2a2a]">
          {mockCheckins.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.date + 'T12:00:00').toLocaleDateString('pt-BR')} às {c.time}
                  </p>
                </div>
              </div>
              <Badge variant={c.type === 'qr_code' ? 'info' : 'default'}>
                {c.type === 'qr_code' ? 'QR Code' : 'Manual'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
