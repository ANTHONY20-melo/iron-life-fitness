import { useState, useEffect } from 'react'
import { History as HistoryIcon, Clock, Flame, Dumbbell } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'

const mockHistory = [
  { id: '1', date: '2026-08-15', name: 'Treino A - Peito e Tríceps', duration: 52, exercises: 8, calories: 380 },
  { id: '2', date: '2026-08-14', name: 'Treino B - Costas e Bíceps', duration: 48, exercises: 7, calories: 350 },
  { id: '3', date: '2026-08-12', name: 'Treino C - Pernas', duration: 65, exercises: 9, calories: 520 },
  { id: '4', date: '2026-08-11', name: 'Treino D - Ombros e Abdômen', duration: 42, exercises: 6, calories: 290 },
  { id: '5', date: '2026-08-09', name: 'Treino A - Peito e Tríceps', duration: 50, exercises: 8, calories: 370 },
  { id: '6', date: '2026-08-08', name: 'Treino B - Costas e Bíceps', duration: 47, exercises: 7, calories: 340 },
  { id: '7', date: '2026-08-07', name: 'Treino E - Full Body', duration: 72, exercises: 10, calories: 580 },
]

const weekData = [
  { week: 'Sem 1', workouts: 5 },
  { week: 'Sem 2', workouts: 4 },
  { week: 'Sem 3', workouts: 3 },
  { week: 'Sem 4', workouts: 5 },
]

export default function History() {
  const [loading, setLoading] = useState(true)
  const [history] = useState(mockHistory)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Histórico</h1>
        <p className="text-sm text-gray-500 mt-1">Seu histórico de treinos</p>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-white mb-4">Treinos por Semana</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="week" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="workouts" fill="#DC2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {history.length === 0 ? (
        <EmptyState icon={<HistoryIcon className="w-10 h-10" />} title="Nenhum treino registrado" />
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <Card key={h.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{h.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(h.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {h.duration} min
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {h.calories} kcal
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="success">Concluído</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
