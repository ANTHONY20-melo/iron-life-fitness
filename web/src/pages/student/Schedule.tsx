import { useState, useEffect } from 'react'
import { Calendar, Clock, Plus } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import toast from 'react-hot-toast'

const mockSchedule = [
  { id: '1', title: 'Avaliação Física', date: '2026-08-20', time: '10:00', type: 'evaluation', status: 'scheduled' },
  { id: '2', title: 'Treino Personal', date: '2026-08-18', time: '08:00', type: 'personal', status: 'scheduled' },
  { id: '3', title: 'Treino Personal', date: '2026-08-16', time: '08:00', type: 'personal', status: 'completed' },
  { id: '4', title: 'Avaliação Física', date: '2026-08-01', time: '10:00', type: 'evaluation', status: 'completed' },
]

export default function Schedule() {
  const [loading, setLoading] = useState(true)
  const [schedule, setSchedule] = useState(mockSchedule)
  const [modalOpen, setModalOpen] = useState(false)
  const [newAppt, setNewAppt] = useState({ date: '', time: '08:00', type: 'personal' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleSchedule = () => {
    if (!newAppt.date) { toast.error('Selecione uma data'); return }
    const entry = {
      id: String(Date.now()),
      title: newAppt.type === 'personal' ? 'Treino Personal' : 'Avaliação Física',
      date: newAppt.date,
      time: newAppt.time,
      type: newAppt.type,
      status: 'scheduled' as const,
    }
    setSchedule((prev) => [entry, ...prev])
    setModalOpen(false)
    setNewAppt({ date: '', time: '08:00', type: 'personal' })
    toast.success('Agendamento realizado!')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <p className="text-sm text-gray-500 mt-1">Seus agendamentos</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Agendar
        </Button>
      </div>

      {schedule.length === 0 ? (
        <EmptyState icon={<Calendar className="w-10 h-10" />} title="Nenhum agendamento" description="Agende um treino ou avaliação." />
      ) : (
        <div className="space-y-3">
          {schedule.map((s) => (
            <Card key={s.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(s.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {s.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={s.status === 'scheduled' ? 'info' : 'success'}>
                  {s.status === 'scheduled' ? 'Agendado' : 'Realizado'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Agendamento"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSchedule}>Agendar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Data"
            type="date"
            value={newAppt.date}
            onChange={(e) => setNewAppt((p) => ({ ...p, date: e.target.value }))}
          />
          <Input
            label="Horário"
            type="time"
            value={newAppt.time}
            onChange={(e) => setNewAppt((p) => ({ ...p, time: e.target.value }))}
          />
          <Select
            label="Tipo"
            value={newAppt.type}
            onChange={(e) => setNewAppt((p) => ({ ...p, type: e.target.value }))}
            options={[
              { value: 'personal', label: 'Treino Personal' },
              { value: 'evaluation', label: 'Avaliação Física' },
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}
