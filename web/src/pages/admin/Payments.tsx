import { useState, useEffect } from 'react'
import { DollarSign, Search, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

const mockPayments = [
  { id: '1', student: 'Marcos Silva', plan: 'Premium', amount: 149.90, date: '2026-08-01', status: 'paid', method: 'PIX' },
  { id: '2', student: 'Juliana Santos', plan: 'Black', amount: 249.90, date: '2026-08-01', status: 'paid', method: 'Cartão' },
  { id: '3', student: 'Pedro Almeida', plan: 'Básico', amount: 89.90, date: '2026-08-05', status: 'pending', method: '' },
  { id: '4', student: 'Ana Lima', plan: 'Premium', amount: 149.90, date: '2026-07-01', status: 'overdue', method: '' },
  { id: '5', student: 'Carlos Souza', plan: 'Premium', amount: 149.90, date: '2026-08-03', status: 'paid', method: 'Boleto' },
  { id: '6', student: 'Fernanda Costa', plan: 'Básico', amount: 89.90, date: '2026-07-15', status: 'cancelled', method: '' },
]

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default'; icon: React.ReactNode }> = {
  paid: { label: 'Pago', variant: 'success', icon: <CheckCircle className="w-3 h-3" /> },
  pending: { label: 'Pendente', variant: 'warning', icon: <Clock className="w-3 h-3" /> },
  overdue: { label: 'Atrasado', variant: 'danger', icon: <AlertTriangle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelado', variant: 'default', icon: <XCircle className="w-3 h-3" /> },
}

export default function AdminPayments() {
  const [loading, setLoading] = useState(true)
  const [payments] = useState(mockPayments)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = payments.filter((p) => {
    const matchSearch = !search || p.student.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter((p) => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

  const markPaid = (id: string) => {
    toast.success('Pagamento confirmado!')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Pagamentos</h1>
        <p className="text-sm text-gray-500 mt-1">Gestão de cobranças</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
            <div>
              <p className="text-xs text-gray-500">Recebido</p>
              <p className="text-xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl"><AlertTriangle className="w-5 h-5 text-amber-500" /></div>
            <div>
              <p className="text-xs text-gray-500">Pendente</p>
              <p className="text-xl font-bold text-white">R$ {totalPending.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Buscar aluno..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'paid', label: 'Pago' },
            { value: 'pending', label: 'Pendente' },
            { value: 'overdue', label: 'Atrasado' },
            { value: 'cancelled', label: 'Cancelado' },
          ]}
          className="w-full sm:w-44"
        />
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full hidden md:table">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Aluno</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Plano</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Data</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Método</th>
              <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Valor</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="px-4 py-3 text-sm text-white font-medium">{p.student}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.plan}</td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {new Date(p.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.method || '-'}</td>
                <td className="px-4 py-3 text-sm text-white text-right font-medium">R$ {p.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusConfig[p.status]?.variant || 'default'}>
                    {statusConfig[p.status]?.label || p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {(p.status === 'pending' || p.status === 'overdue') && (
                    <Button size="sm" variant="ghost" onClick={() => markPaid(p.id)}>
                      Confirmar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile */}
        <div className="md:hidden divide-y divide-[#2a2a2a]">
          {filtered.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">{p.student}</p>
                  <p className="text-xs text-gray-500">{p.plan} • {p.method || 'Sem método'}</p>
                </div>
                <Badge variant={statusConfig[p.status]?.variant || 'default'}>
                  {statusConfig[p.status]?.label || p.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white font-medium">R$ {p.amount.toFixed(2)}</span>
                {(p.status === 'pending' || p.status === 'overdue') && (
                  <Button size="sm" variant="ghost" onClick={() => markPaid(p.id)}>Confirmar</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
