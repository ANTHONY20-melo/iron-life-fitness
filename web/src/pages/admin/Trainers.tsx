import { useState, useEffect } from 'react'
import { GraduationCap, Plus, Search, Edit, Trash2 } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Input from '@/components/common/Input'
import Avatar from '@/components/common/Avatar'
import Skeleton from '@/components/common/Skeleton'
import Modal from '@/components/common/Modal'
import toast from 'react-hot-toast'

const mockTrainers = [
  { id: '1', name: 'Rafael Costa', email: 'rafael@ironlife.com', cref: 'CREF 12345-G/SP', specialty: 'Musculação & Força', status: 'active' },
  { id: '2', name: 'Ana Martins', email: 'ana@ironlife.com', cref: 'CREF 12346-G/SP', specialty: 'Funcional & HIIT', status: 'active' },
  { id: '3', name: 'Lucas Ferreira', email: 'lucas@ironlife.com', cref: 'CREF 12347-G/SP', specialty: 'Reabilitação', status: 'active' },
]

export default function Trainers() {
  const [loading, setLoading] = useState(true)
  const [trainers, setTrainers] = useState(mockTrainers)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', cref: '', specialty: '' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = trainers.filter(
    (t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.specialty.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    if (!form.name || !form.cref) { toast.error('Preencha nome e CREF'); return }
    setTrainers((prev) => [{ id: String(Date.now()), ...form, status: 'active' as const }, ...prev])
    setModalOpen(false)
    setForm({ name: '', email: '', cref: '', specialty: '' })
    toast.success('Professor cadastrado!')
  }

  const handleDelete = (id: string) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id))
    toast.success('Professor removido')
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
          <h1 className="text-2xl font-bold text-white">Professores</h1>
          <p className="text-sm text-gray-500 mt-1">{trainers.length} professores</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Novo Professor
        </Button>
      </div>

      <Input
        placeholder="Buscar professor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      <div className="space-y-3">
        {filtered.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={t.name} size="md" />
                <div>
                  <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                  <p className="text-xs text-gray-500">{t.specialty}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{t.cref}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Ativo</Badge>
                <button className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#222] transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-[#222] transition-colors">
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
        title="Novo Professor"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Cadastrar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Nome completo" />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="email@exemplo.com" />
          <Input label="CREF" value={form.cref} onChange={(e) => setForm((p) => ({ ...p, cref: e.target.value }))} placeholder="CREF 00000-G/UF" />
          <Input label="Especialidade" value={form.specialty} onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))} placeholder="Ex: Musculação" />
        </div>
      </Modal>
    </div>
  )
}
