import { useState, useEffect } from 'react'
import { ClipboardCheck, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'

const mockAssessments = [
  {
    id: '1', date: '2026-08-01', trainer: 'Rafael Costa',
    weight: 82, height: 178, bodyFat: 16, muscleMass: 38, imc: 25.8,
    cardio: 'Boa', flexibility: 'Regular', strength: 'Boa',
    notes: 'Boa evolução nos últimos 3 meses.',
  },
  {
    id: '2', date: '2026-06-01', trainer: 'Rafael Costa',
    weight: 85, height: 178, bodyFat: 19, muscleMass: 36.5, imc: 26.8,
    cardio: 'Regular', flexibility: 'Fraca', strength: 'Regular',
    notes: 'Iniciar work de mobilidade.',
  },
]

const chartData = mockAssessments.reverse().map((a) => ({
  date: new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short' }),
  weight: a.weight,
  fat: a.bodyFat,
  muscle: a.muscleMass,
}))

export default function Assessments() {
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState(mockAssessments)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48" />
        {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Avaliações Físicas</h1>
        <p className="text-sm text-gray-500 mt-1">Resultados das suas avaliações</p>
      </div>

      {assessments.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="w-10 h-10" />}
          title="Nenhuma avaliação registrada"
          description="Agende uma avaliação com seu professor."
        />
      ) : (
        <>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-4">Evolução</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="weight" name="Peso" stroke="#DC2626" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="fat" name="% Gordura" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="muscle" name="Massa" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {assessments.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </h3>
                  <p className="text-xs text-gray-500">Prof. {a.trainer}</p>
                </div>
                <Badge variant="info">Avaliação</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">Peso</p>
                  <p className="text-lg font-bold text-white">{a.weight} kg</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">% Gordura</p>
                  <p className="text-lg font-bold text-white">{a.bodyFat}%</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">Massa Muscular</p>
                  <p className="text-lg font-bold text-white">{a.muscleMass} kg</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">IMC</p>
                  <p className="text-lg font-bold text-white">{a.imc}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Cardio</p>
                  <Badge variant={a.cardio === 'Boa' ? 'success' : 'warning'}>{a.cardio}</Badge>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Flexibilidade</p>
                  <Badge variant={a.flexibility === 'Boa' ? 'success' : a.flexibility === 'Regular' ? 'warning' : 'danger'}>{a.flexibility}</Badge>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Força</p>
                  <Badge variant={a.strength === 'Boa' ? 'success' : 'warning'}>{a.strength}</Badge>
                </div>
              </div>
              {a.notes && <p className="text-xs text-gray-500 italic">{a.notes}</p>}
            </Card>
          ))}
        </>
      )}
    </div>
  )
}
