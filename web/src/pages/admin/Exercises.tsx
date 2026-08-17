import { useState, useEffect } from 'react'
import { ListChecks, Plus, Edit, Trash2, Search } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Skeleton from '@/components/common/Skeleton'
import Modal from '@/components/common/Modal'
import toast from 'react-hot-toast'

const muscleGroups = ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 'Pernas', 'Glúteos', 'Abdômen', 'Full Body']
const difficulties = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' }
const difficultyVariant: Record<string, 'success' | 'warning' | 'danger'> = { beginner: 'success', intermediate: 'warning', advanced: 'danger' }

const mockExercises = [
  { id: '1', name: 'Supino Reto', muscleGroup: 'Peito', difficulty: 'intermediate', equipment: 'Barra' },
  { id: '2', name: 'Supino Inclinado Halteres', muscleGroup: 'Peito', difficulty: 'intermediate', equipment: 'Halteres' },
  { id: '3', name: 'Puxada Frontal', muscleGroup: 'Costas', difficulty: 'beginner', equipment: 'Máquina' },
  { id: '4', name: 'Remada Curvada', muscleGroup: 'Costas', difficulty: 'intermediate', equipment: 'Barra' },
  { id: '5', name: 'Agachamento Livre', muscleGroup: 'Pernas', difficulty: 'advanced', equipment: 'Barra' },
  { id: '6', name: 'Leg Press', muscleGroup: 'Pernas', difficulty: 'beginner', equipment: 'Máquina' },
  { id: '7', name: 'Desenvolvimento', muscleGroup: 'Ombros', difficulty: 'intermediate', equipment: 'Halteres' },
  { id: '8', name: 'Rosca Direta', muscleGroup: 'Bíceps', difficulty: 'beginner', equipment: 'Barra' },
  { id: '9', name: 'Tríceps Pulley', muscleGroup: 'Tríceps', difficulty: 'beginner', equipment: 'Máquina' },
  { id: '10', name: 'Prancha', muscleGroup: 'Abdômen', difficulty: 'beginner', equipment: 'Peso Corporal' },
]

export default function Exercises() {
  const [loading, setLoading] = useState(true)
  const [exercises] = useState(mockExercises)
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', muscleGroup: '', difficulty: 'beginner', equipment: '' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = exercises.filter((e) => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase())
    const matchGroup = !filterGroup || e.muscleGroup === filterGroup
    return matchSearch && matchGroup
  })

  const handleCreate = () => {
    if (!form.name || !form.muscleGroup) { toast.error('Nome e grupo muscular obrigatórios'); return }
    setModalOpen(false)
    toast.success('Exercício cadastrado!')
    setForm({ name: '', muscleGroup: '', difficulty: 'beginner', equipment: '' })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Biblioteca de Exercícios</h1>
          <p className="text-sm text-gray-500 mt-1">{exercises.length} exercícios</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Novo Exercício
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar exercício..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          options={[{ value: '', label: 'Todos os grupos' }, ...muscleGroups.map((g) => ({ value: g, label: g }))]}
          className="w-full sm:w-48"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Card key={e.id} hover>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{e.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{e.muscleGroup}</p>
                {e.equipment && <p className="text-xs text-gray-600 mt-0.5">{e.equipment}</p>}
              </div>
              <Badge variant={difficultyVariant[e.difficulty]}>
                {difficulties[e.difficulty as keyof typeof difficulties]}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#2a2a2a]">
              <button className="flex-1 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors flex items-center justify-center gap-1">
                <Edit className="w-3 h-3" /> Editar
              </button>
              <button className="flex-1 py-1.5 text-xs text-gray-400 hover:text-red-400 hover:bg-[#1a1a1a] rounded-lg transition-colors flex items-center justify-center gap-1">
                <Trash2 className="w-3 h-3" /> Excluir
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Exercício"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Cadastrar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Supino Reto" />
          <Select
            label="Grupo Muscular"
            value={form.muscleGroup}
            onChange={(e) => setForm((p) => ({ ...p, muscleGroup: e.target.value }))}
            options={[{ value: '', label: 'Selecionar...' }, ...muscleGroups.map((g) => ({ value: g, label: g }))]}
          />
          <Select
            label="Dificuldade"
            value={form.difficulty}
            onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
            options={Object.entries(difficulties).map(([k, v]) => ({ value: k, label: v }))}
          />
          <Input label="Equipamento" value={form.equipment} onChange={(e) => setForm((p) => ({ ...p, equipment: e.target.value }))} placeholder="Ex: Barra, Halteres..." />
        </div>
      </Modal>
    </div>
  )
}
