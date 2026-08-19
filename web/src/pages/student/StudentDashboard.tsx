import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell, TrendingUp, Calendar, Weight, Ruler, Star, QrCode,
  ChevronRight, Flame, Target, Clock, Award,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAuthStore } from '@/stores/authStore'
import Card from '@/components/common/Card'
import StatCard from '@/components/common/StatCard'
import ProgressBar from '@/components/common/ProgressBar'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import Badge from '@/components/common/Badge'
import api from '@/services/api'

const mockWeightData = [
  { month: 'Jul', weight: 88 },
  { month: 'Ago', weight: 86.5 },
  { month: 'Set', weight: 85 },
  { month: 'Out', weight: 83.8 },
  { month: 'Nov', weight: 82 },
  { month: 'Dez', weight: 80.5 },
]

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    weeklyFrequency: 4,
    monthlyFrequency: 16,
    currentWeight: 80.5,
    height: 178,
    bmi: 25.4,
    points: 1250,
    level: 5,
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const name = user?.student?.fullName || user?.email?.split('@')[0] || 'Aluno'

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Olá, {name}! 💪
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link to="/student/schedule">
          <Button icon={<QrCode className="w-4 h-4" />}>Check-in</Button>
        </Link>
      </div>

      {/* Today's workout */}
      <Card className="border-primary/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">Treino de Hoje</p>
            <h3 className="text-lg font-semibold text-white">Treino A - Peito e Tríceps</h3>
            <p className="text-sm text-gray-500 mt-1">8 exercícios • ~50 min</p>
          </div>
          <Link to="/student/workouts">
            <Button size="sm" icon={<Dumbbell className="w-4 h-4" />}>Iniciar</Button>
          </Link>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Frequência Semanal" value={`${stats.weeklyFrequency}x`} />
        <StatCard icon={<Target className="w-5 h-5" />} label="Frequência Mensal" value={`${stats.monthlyFrequency}x`} />
        <StatCard icon={<Weight className="w-5 h-5" />} label="Peso Atual" value={`${stats.currentWeight} kg`} />
        <StatCard icon={<Star className="w-5 h-5" />} label="Pontos / Nível" value={`${stats.points} pts`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolution chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Evolução do Peso</h3>
            <Link to="/student/evolution" className="text-xs text-primary hover:text-primary-light transition-colors">
              Ver tudo →
            </Link>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockWeightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#DC2626" strokeWidth={2} dot={{ fill: '#DC2626', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Goal progress + Level */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-3">Meta: Perder 10 kg</h3>
            <ProgressBar value={75} label="Progresso" color="primary" />
            <p className="text-xs text-gray-500 mt-2">Faltam 2,5 kg para atingir sua meta!</p>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nível {stats.level}</p>
                <p className="text-xl font-bold text-white">{stats.points} pontos</p>
                <ProgressBar value={250} max={500} showPercentage={false} size="sm" className="mt-2 w-40" />
                <p className="text-xs text-gray-600 mt-1">250 pts para o próximo nível</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-white mb-2">Próxima Avaliação</h3>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><Calendar className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-sm text-white">20/08/2026 às 10:00</p>
                <p className="text-xs text-gray-500">Com Prof. Rafael Costa</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/student/schedule', icon: QrCode, label: 'Check-in' },
          { to: '/student/workouts', icon: Dumbbell, label: 'Ver Treinos' },
          { to: '/student/evolution', icon: TrendingUp, label: 'Evolução' },
          { to: '/student/achievements', icon: Award, label: 'Conquistas' },
        ].map((action) => (
          <Link key={action.to} to={action.to}>
            <Card hover className="text-center">
              <action.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{action.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
