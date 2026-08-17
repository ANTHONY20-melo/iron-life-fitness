import { useState, useEffect } from 'react'
import { Dumbbell, Plus, Edit, Trash2, Copy } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import toast from 'react-hot-toast'

const mockWorkouts = [
  { id: '1', name: 'Treino A - Peito e Tríceps', trainer: 'Rafael Costa', exercises: 8, students: 45, createdAt: '2026-01-10' },
  { id: '2', name: 'Treino B - Costas e Bíceps', trainer: 'Rafael Costa', exercises: 7, students: 42, createdAt: '2026-01-10' },
  { id: '3', name: 'Treino C - Pernas', trainer: 'Ana Martins', exercises: 9, students: 38, createdAt: '2026-01-15' },
  { id: '4', name: 'Treino D - Ombros e Abdômen', trainer: 'Rafael Costa', exercises: 6, students: 40, createdAt: '2026-02-01' },
  { id: '5', name: 'Treino E - Full Body', trainer: 'Ana Martins', exercises: 10, students: 30, createdAt: '2026-03-01' },
]

export default function Workouts() {
  const [loading, setLoading] = useState(true)
  const [workouts] = useState(mockWorkouts)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', trainer: '' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleCreate = () => {
    if (!form.name) { toast.error('Nome do treino obrigatório'); return }
    setModalOpen(false)
    toast.success('Treino criado!')
    setForm({ name: '', trainer: '' })
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
          <h1 className="text-2xl font-bold text-white">Treinos</h1>
          <p className="text-sm text-gray-500 mt-1">{workouts.length} treinos cadastrados</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Novo Treino
        </Button>
      </div>

      <div className="space-y-3">
        {workouts.map((w) => (
          <Card key={w.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{w.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">Prof. {w.trainer}</span>
                    <span className="text-xs text-gray-600">{w.exercises} exercícios</span>
                    <span className="text-xs text-gray-600">{w.students} alunos</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#222] transition-colors" title="Duplicar">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#222] transition-colors" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-[#222] transition-colors" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Treino"
        size="lg"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar Treino</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome do Treino" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Treino A - Peito e Tríceps" />
          <Select
            label="Professor Responsável"
            value={form.trainer}
            onChange={(e) => setForm((p) => ({ ...p, trainer: e.target.value }))}
            options={[
              { value: '', label: 'Selecionar...' },
              { value: 'rafael', label: 'Rafael Costa' },
              { value: 'ana', label: 'Ana Martins' },
              { value: 'lucas', label: 'Lucas Ferreira' },
            ]}
          />
          <div className="bg-[#0a0a0a] rounded-xl p-4 border border-dashed border-[#2a2a2a]">
            <p className="text-sm text-gray-500 text-center">
              Adicione exercícios ao treino após a criação.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
