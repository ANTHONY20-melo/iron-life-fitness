import { useState, useEffect } from 'react'
import { ClipboardCheck, Plus, Search } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Input from '@/components/common/Input'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import Modal from '@/components/common/Modal'
import Select from '@/components/common/Select'
import toast from 'react-hot-toast'

const mockAssessments = [
  { id: '1', student: 'Marcos Silva', trainer: 'Rafael Costa', date: '2026-08-01', weight: 82, bodyFat: 16, imc: 25.8 },
  { id: '2', student: 'Juliana Santos', trainer: 'Rafael Costa', date: '2026-07-28', weight: 65, bodyFat: 22, imc: 23.5 },
  { id: '3', student: 'Pedro Almeida', trainer: 'Ana Martins', date: '2026-07-20', weight: 90, bodyFat: 18, imc: 27.1 },
]

export default function AdminAssessments() {
  const [loading, setLoading] = useState(true)
  const [assessments] = useState(mockAssessments)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ student: '', trainer: '', date: '' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = assessments.filter(
    (a) => !search || a.student.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    if (!form.student || !form.date) { toast.error('Preencha todos os campos'); return }
    setModalOpen(false)
    toast.success('Avaliação agendada!')
    setForm({ student: '', trainer: '', date: '' })
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
          <h1 className="text-2xl font-bold text-white">Avaliações</h1>
          <p className="text-sm text-gray-500 mt-1">{assessments.length} avaliações registradas</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Nova Avaliação
        </Button>
      </div>

      <Input
        placeholder="Buscar aluno..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<ClipboardCheck className="w-10 h-10" />} title="Nenhuma avaliação encontrada" />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{a.student}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs text-gray-600">Prof. {a.trainer}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500">Peso</p>
                    <p className="text-sm text-white font-medium">{a.weight} kg</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500">% Gordura</p>
                    <p className="text-sm text-white font-medium">{a.bodyFat}%</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500">IMC</p>
                    <p className="text-sm text-white font-medium">{a.imc}</p>
                  </div>
                  <Badge variant="info">Detalhes</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Avaliação"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Agendar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Aluno"
            value={form.student}
            onChange={(e) => setForm((p) => ({ ...p, student: e.target.value }))}
            options={[
              { value: '', label: 'Selecionar...' },
              { value: 'marcos', label: 'Marcos Silva' },
              { value: 'juliana', label: 'Juliana Santos' },
              { value: 'pedro', label: 'Pedro Almeida' },
            ]}
          />
          <Select
            label="Professor"
            value={form.trainer}
            onChange={(e) => setForm((p) => ({ ...p, trainer: e.target.value }))}
            options={[
              { value: '', label: 'Selecionar...' },
              { value: 'rafael', label: 'Rafael Costa' },
              { value: 'ana', label: 'Ana Martins' },
            ]}
          />
          <Input
            label="Data"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  )
}
