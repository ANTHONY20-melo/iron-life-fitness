import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Plus, Search, Eye, Ban, Trash2 } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Input from '@/components/common/Input'
import Avatar from '@/components/common/Avatar'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import Modal from '@/components/common/Modal'
import Select from '@/components/common/Select'
import toast from 'react-hot-toast'

const mockStudents = [
  { id: '1', name: 'Marcos Silva', email: 'marcos@email.com', cpf: '123.456.789-00', plan: 'Premium', status: 'active', joinDate: '2026-01-15' },
  { id: '2', name: 'Juliana Santos', email: 'juliana@email.com', cpf: '987.654.321-00', plan: 'Black', status: 'active', joinDate: '2025-11-20' },
  { id: '3', name: 'Pedro Almeida', email: 'pedro@email.com', cpf: '456.789.123-00', plan: 'Básico', status: 'active', joinDate: '2026-03-10' },
  { id: '4', name: 'Ana Lima', email: 'ana@email.com', cpf: '321.654.987-00', plan: 'Premium', status: 'overdue', joinDate: '2025-08-05' },
  { id: '5', name: 'Carlos Souza', email: 'carlos@email.com', cpf: '789.123.456-00', plan: 'Premium', status: 'active', joinDate: '2026-06-01' },
  { id: '6', name: 'Fernanda Costa', email: 'fernanda@email.com', cpf: '654.321.789-00', plan: 'Básico', status: 'inactive', joinDate: '2026-02-14' },
]

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  active: { label: 'Ativo', variant: 'success' },
  overdue: { label: 'Inadimplente', variant: 'danger' },
  inactive: { label: 'Inativo', variant: 'warning' },
}

export default function Students() {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState(mockStudents)
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', email: '', cpf: '', phone: '', plan: 'basic' })
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = students.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = !filterPlan || s.plan.toLowerCase() === filterPlan
    const matchStatus = !filterStatus || s.status === filterStatus
    return matchSearch && matchPlan && matchStatus
  })

  const handleCreate = () => {
    if (!newStudent.name || !newStudent.email) { toast.error('Preencha nome e e-mail'); return }
    const student = {
      id: String(Date.now()),
      name: newStudent.name,
      email: newStudent.email,
      cpf: newStudent.cpf,
      plan: newStudent.plan === 'premium' ? 'Premium' : newStudent.plan === 'black' ? 'Black' : 'Básico',
      status: 'active' as const,
      joinDate: new Date().toISOString().split('T')[0],
    }
    setStudents((prev) => [student, ...prev])
    setModalOpen(false)
    setNewStudent({ name: '', email: '', cpf: '', phone: '', plan: 'basic' })
    toast.success('Aluno criado com sucesso!')
  }

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    toast.success('Aluno removido')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alunos</h1>
          <p className="text-sm text-gray-500 mt-1">{students.length} alunos cadastrados</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Novo Aluno
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          options={[
            { value: '', label: 'Todos os planos' },
            { value: 'básico', label: 'Básico' },
            { value: 'premium', label: 'Premium' },
            { value: 'black', label: 'Black' },
          ]}
          className="w-full sm:w-40"
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'active', label: 'Ativo' },
            { value: 'overdue', label: 'Inadimplente' },
            { value: 'inactive', label: 'Inativo' },
          ]}
          className="w-full sm:w-40"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="w-10 h-10" />} title="Nenhum aluno encontrado" />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Aluno</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">CPF</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Plano</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-white">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{s.cpf}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{s.plan}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusMap[s.status]?.variant || 'default'}>
                        {statusMap[s.status]?.label || s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/students/${s.id}`)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#222] transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setStudents((prev) => prev.filter((x) => x.id !== s.id)); toast.success('Aluno bloqueado') }} className="p-1.5 text-gray-400 hover:text-amber-400 rounded-lg hover:bg-[#222] transition-colors">
                          <Ban className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-[#222] transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((s) => (
              <Card key={s.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-white">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.plan}</p>
                    </div>
                  </div>
                  <Badge variant={statusMap[s.status]?.variant || 'default'}>
                    {statusMap[s.status]?.label || s.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Create modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Aluno"
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Criar Aluno</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome" value={newStudent.name} onChange={(e) => setNewStudent((p) => ({ ...p, name: e.target.value }))} placeholder="Nome completo" />
          <Input label="E-mail" type="email" value={newStudent.email} onChange={(e) => setNewStudent((p) => ({ ...p, email: e.target.value }))} placeholder="email@exemplo.com" />
          <Input label="CPF" value={newStudent.cpf} onChange={(e) => setNewStudent((p) => ({ ...p, cpf: e.target.value }))} placeholder="000.000.000-00" />
          <Input label="Telefone" value={newStudent.phone} onChange={(e) => setNewStudent((p) => ({ ...p, phone: e.target.value }))} placeholder="(11) 99999-9999" />
          <Select
            label="Plano"
            value={newStudent.plan}
            onChange={(e) => setNewStudent((p) => ({ ...p, plan: e.target.value }))}
            options={[
              { value: 'basic', label: 'Básico - R$ 89,90' },
              { value: 'premium', label: 'Premium - R$ 149,90' },
              { value: 'black', label: 'Black - R$ 249,90' },
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}
