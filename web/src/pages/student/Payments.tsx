import { useState, useEffect } from 'react'
import { CreditCard, Receipt, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

const mockPayments = [
  { id: '1', date: '2026-08-01', amount: 149.90, status: 'paid', method: 'PIX', plan: 'Premium' },
  { id: '2', date: '2026-07-01', amount: 149.90, status: 'paid', method: 'Cartão', plan: 'Premium' },
  { id: '3', date: '2026-06-01', amount: 149.90, status: 'paid', method: 'PIX', plan: 'Premium' },
  { id: '4', date: '2026-05-01', amount: 149.90, status: 'paid', method: 'Boleto', plan: 'Premium' },
]

export default function StudentPayments() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-36" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Pagamentos</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie sua assinatura</p>
      </div>

      {/* Current plan */}
      <Card className="border-primary/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-primary font-medium uppercase tracking-wider">Plano Atual</p>
            <h3 className="text-xl font-bold text-white mt-1">Premium</h3>
            <p className="text-sm text-gray-500">R$ 149,90/mês • Próximo vencimento: 01/09/2026</p>
          </div>
          <Button icon={<CreditCard className="w-4 h-4" />} onClick={() => toast.success('Redirecionando para pagamento...')}>
            Pagar Agora
          </Button>
        </div>
      </Card>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">4</p>
          <p className="text-xs text-gray-500">Pagamentos em dia</p>
        </Card>
        <Card className="text-center">
          <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Pendentes</p>
        </Card>
        <Card className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-white">0</p>
          <p className="text-xs text-gray-500">Atrasados</p>
        </Card>
      </div>

      {/* Payment history */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Histórico de Pagamentos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Plano</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Método</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Valor</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {mockPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(p.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{p.plan}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{p.method}</td>
                  <td className="px-4 py-3 text-sm text-white text-right font-medium">R$ {p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant="success">Pago</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
