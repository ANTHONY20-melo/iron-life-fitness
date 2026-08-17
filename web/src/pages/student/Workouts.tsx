import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Clock, ChevronRight } from 'lucide-react'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'

const mockWorkouts = [
  { id: '1', name: 'Treino A - Peito e Tríceps', day: 'Segunda', exercises: 8, status: 'assigned' },
  { id: '2', name: 'Treino B - Costas e Bíceps', day: 'Terça', exercises: 7, status: 'assigned' },
  { id: '3', name: 'Treino C - Pernas', day: 'Quarta', exercises: 9, status: 'assigned' },
  { id: '4', name: 'Treino D - Ombros e Abdômen', day: 'Quinta', exercises: 6, status: 'assigned' },
  { id: '5', name: 'Treino E - Full Body', day: 'Sexta', exercises: 10, status: 'completed' },
]

export default function Workouts() {
  const [loading, setLoading] = useState(true)
  const [workouts, setWorkouts] = useState(mockWorkouts)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Meus Treinos</h1>
        <p className="text-sm text-gray-500 mt-1">Treinos atribuídos pelo seu professor</p>
      </div>

      {workouts.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="w-10 h-10" />}
          title="Nenhum treino atribuído"
          description="Seu professor ainda não atribuiu treinos para você."
        />
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => (
            <Link key={w.id} to={`/student/workouts/${w.id}`}>
              <Card hover className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{w.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {w.day}
                      </span>
                      <span className="text-xs text-gray-500">{w.exercises} exercícios</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={w.status === 'completed' ? 'success' : 'default'}>
                    {w.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
