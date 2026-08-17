import { useState, useEffect } from 'react'
import {
  Users, UserCheck, AlertTriangle, DollarSign, UserPlus, Dumbbell,
  TrendingUp, TrendingDown, Clock,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import StatCard from '@/components/common/StatCard'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import Button from '@/components/common/Button'

const revenueData = [
  { month: 'Set', revenue: 12500 },
  { month: 'Out', revenue: 14200 },
  { month: 'Nov', revenue: 13800 },
  { month: 'Dez', revenue: 15600 },
  { month: 'Jan', revenue: 16200 },
  { month: 'Fev', revenue: 14900 },
  { month: 'Mar', revenue: 17100 },
  { month: 'Abr', revenue: 16800 },
  { month: 'Mai', revenue: 18200 },
  { month: 'Jun', revenue: 19500 },
  { month: 'Jul', revenue: 20100 },
  { month: 'Ago', revenue: 18900 },
]

const recentCheckins = [
  { name: 'Marcos Silva', time: '08:15', date: '2026-08-15' },
  { name: 'Juliana Santos', time: '07:42', date: '2026-08-15' },
  { name: 'Pedro Almeida', time: '07:30', date: '2026-08-15' },
  { name: 'Ana Lima', time: '18:20', date: '2026-08-15' },
]

const pendingEvaluations = [
  { name: 'Carlos Souza', date: '2026-08-18', time: '10:00' },
  { name: 'Fernanda Costa', date: '2026-08-19', time: '14:00' },
]

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da academia</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Alunos" value={156} trend={{ value: 8, isPositive: true }} />
        <StatCard icon={<UserCheck className="w-5 h-5" />} label="Ativos" value={142} trend={{ value: 5, isPositive: true }} />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Inadimplentes" value={14} trend={{ value: 12, isPositive: false }} />
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Receita Mensal" value="R$ 18.900" trend={{ value: 3, isPositive: true }} />
        <StatCard icon={<UserPlus className="w-5 h-5" />} label="Novos no Mês" value={12} trend={{ value: 20, isPositive: true }} />
        <StatCard icon={<Dumbbell className="w-5 h-5" />} label="Treinos Realizados" value={487} trend={{ value: 15, isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Receita Mensal</h3>
            <span className="text-xs text-gray-500">Últimos 12 meses</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Receita']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={2} dot={{ fill: '#DC2626', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent check-ins */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Check-ins Recentes</h3>
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-3">
            {recentCheckins.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">
                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-sm text-white">{c.name}</span>
                </div>
                <span className="text-xs text-gray-500">{c.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pending evaluations */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Avaliações Pendentes</h3>
          <Button variant="ghost" size="sm">Ver todas</Button>
        </div>
        {pendingEvaluations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhuma avaliação pendente</p>
        ) : (
          <div className="space-y-3">
            {pendingEvaluations.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl">
                <span className="text-sm text-white">{e.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR')} às {e.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
