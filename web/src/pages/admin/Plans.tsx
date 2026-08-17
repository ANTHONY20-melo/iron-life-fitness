import { useState, useEffect } from 'react'
import { Package, Plus, Edit, Trash2, Check } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import toast from 'react-hot-toast'

const mockPlans = [
  { id: '1', name: 'Básico', price: 89.90, features: ['Musculação ilimitada', 'Área cardiovascular', 'Vestiários', 'Avaliação inicial'], students: 42, status: 'active' },
  { id: '2', name: 'Premium', price: 149.90, features: ['Tudo do Básico', 'Personal 2x/sem', 'Avaliações mensais', 'Treinos personalizados', 'Área funcional'], students: 85, status: 'active' },
  { id: '3', name: 'Black', price: 249.90, features: ['Tudo do Premium', 'Personal ilimitado', 'Nutricionista', 'Acompanhamento 24/7', 'Aulas exclusivas', 'Área VIP'], students: 29, status: 'active' },
]

export default function Plans() {
  const [loading, setLoading] = useState(true)
  const [plans] = useState(mockPlans)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', features: '' })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleCreate = () => {
    if (!form.name || !form.price) { toast.error('Nome e preço obrigatórios'); return }
    setModalOpen(false)
    toast.success('Plano criado!')
    setForm({ name: '', price: '', features: '' })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Planos</h1>
          <p className="text-sm text-gray-500 mt-1">{plans.length} planos ativos</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <Badge variant="success">{p.students} alunos</Badge>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-sm text-gray-500">R$</span>
              <span className="text-3xl font-black text-white">{p.price.toFixed(2).replace('.', ',')}</span>
              <span className="text-sm text-gray-500">/mês</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-4 border-t border-[#2a2a2a]">
              <Button variant="outline" size="sm" className="flex-1" icon={<Edit className="w-4 h-4" />}>
                Editar
              </Button>
              <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />}>
                Excluir
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Plano"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar Plano</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Gold" />
          <Input label="Preço (R$/mês)" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="99.90" />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Recursos (um por linha)</label>
            <textarea
              value={form.features}
              onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
              placeholder="Musculação ilimitada&#10;Personal trainer&#10;Avaliações"
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
