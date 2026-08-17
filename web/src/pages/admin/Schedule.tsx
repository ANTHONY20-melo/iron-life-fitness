import { useState, useEffect } from 'react'
import { Calendar, Plus, Clock, Check } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import toast from 'react-hot-toast'

const mockSchedule = [
  { id: '1', title: 'Avaliação - Marcos Silva', trainer: 'Rafael Costa', date: '2026-08-18', time: '10:00', type: 'evaluation', status: 'scheduled' },
  { id: '2', title: 'Personal - Juliana Santos', trainer: 'Ana Martins', date: '2026-08-18', time: '08:00', type: 'personal', status: 'scheduled' },
  { id: '3', title: 'Avaliação - Pedro Almeida', trainer: 'Rafael Costa', date: '2026-08-19', time: '14:00', type: 'evaluation', status: 'scheduled' },
  { id: '4', title: 'Personal - Carlos Souza', trainer: 'Lucas Ferreira', date: '2026-08-17', time: '09:00', type: 'personal', status: 'completed' },
]

export default function AdminSchedule() {
  const [loading, setLoading] = useState(true)
  const [schedule] = useState(mockSchedule)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'personal' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleCreate = () => {
    if (!form.title || !form.date) { toast.error('Preencha todos os campos'); return }
    setModalOpen(false)
    toast.success('Agendamento criado!')
    setForm({ title: '', date: '', time: '', type: 'personal' })
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
          <p className="text-sm text-gray-500 mt-1">{schedule.filter((s) => s.status === 'scheduled').length} agendamentos pendentes</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Novo Agendamento
        </Button>
      </div>

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
                    <span className="text-xs text-gray-600">Prof. {s.trainer}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={s.type === 'evaluation' ? 'info' : 'default'}>
                  {s.type === 'evaluation' ? 'Avaliação' : 'Personal'}
                </Badge>
                <Badge variant={s.status === 'scheduled' ? 'warning' : 'success'}>
                  {s.status === 'scheduled' ? 'Agendado' : 'Realizado'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Agendamento"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Ex: Avaliação - João" />
          <Input label="Data" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          <Input label="Horário" type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} />
          <Select
            label="Tipo"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            options={[
              { value: 'personal', label: 'Treino Personal' },
              { value: 'evaluation', label: 'Avaliação Física' },
              { value: 'class', label: 'Aula Coletiva' },
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}
