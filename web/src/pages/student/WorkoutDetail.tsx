import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Minus, Check, Dumbbell } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ProgressBar from '@/components/common/ProgressBar'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

const mockExercises = [
  { id: '1', name: 'Supino Reto', sets: 4, reps: '10-12', rest: 90, weight: 60, notes: 'Controlar a descida' },
  { id: '2', name: 'Supino Inclinado Halteres', sets: 3, reps: '10-12', rest: 90, weight: 24, notes: '' },
  { id: '3', name: 'Crucifixo Máquina', sets: 3, reps: '12-15', rest: 60, weight: 30, notes: '' },
  { id: '4', name: 'Crossover', sets: 3, reps: '12-15', rest: 60, weight: 15, notes: 'Contração no final' },
  { id: '5', name: 'Tríceps Pulley', sets: 4, reps: '10-12', rest: 60, weight: 25, notes: '' },
  { id: '6', name: 'Tríceps Testa', sets: 3, reps: '10-12', rest: 60, weight: 20, notes: '' },
  { id: '7', name: 'Mergulho entre Bancos', sets: 3, reps: 'Até falha', rest: 60, weight: 0, notes: '' },
  { id: '8', name: 'Extensão Corda', sets: 3, reps: '12-15', rest: 60, weight: 15, notes: '' },
]

export default function WorkoutDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState(mockExercises)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [timerRunning, setTimerRunning] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [restTarget, setRestTarget] = useState(90)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!timerRunning || restTime <= 0) return
    const interval = setInterval(() => {
      setRestTime((t) => {
        if (t <= 1) {
          setTimerRunning(false)
          toast('Hora de treinar! 💪', { icon: '🔥' })
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerRunning, restTime])

  const startRest = useCallback((seconds: number) => {
    setRestTarget(seconds)
    setRestTime(seconds)
    setTimerRunning(true)
  }, [])

  const toggleExercise = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        const exercise = exercises.find((e) => e.id === id)
        if (exercise?.rest) startRest(exercise.rest)
      }
      return next
    })
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const pct = exercises.length > 0 ? Math.round((completed.size / exercises.length) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div className="flex items-center gap-3">
        <Link to="/student/workouts" className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1a1a1a]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Treino A - Peito e Tríceps</h1>
          <p className="text-sm text-gray-500">8 exercícios • Prof. Rafael Costa</p>
        </div>
      </div>

      <ProgressBar value={completed.size} max={exercises.length} label="Progresso" />

      {/* Rest timer */}
      {restTime > 0 && (
        <Card className="border-primary/30 text-center">
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">Descanso</p>
          <p className="text-5xl font-black text-white font-mono">{formatTime(restTime)}</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Button size="sm" variant="secondary" onClick={() => setRestTime((t) => Math.max(0, t - 15))} icon={<Minus className="w-4 h-4" />}>-15s</Button>
            <Button
              size="sm"
              variant={timerRunning ? 'secondary' : 'primary'}
              onClick={() => setTimerRunning(!timerRunning)}
              icon={timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {timerRunning ? 'Pausar' : 'Continuar'}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setRestTime((t) => t + 15)} icon={<Plus className="w-4 h-4" />}>+15s</Button>
            <Button size="sm" variant="ghost" onClick={() => { setRestTime(0); setTimerRunning(false) }} icon={<RotateCcw className="w-4 h-4" />}>Resetar</Button>
          </div>
        </Card>
      )}

      {/* Exercises */}
      <div className="space-y-3">
        {exercises.map((ex, i) => {
          const done = completed.has(ex.id)
          return (
            <Card
              key={ex.id}
              className={`transition-all duration-300 ${done ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    done ? 'bg-emerald-500 text-white' : 'bg-[#1a1a1a] text-gray-500'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${done ? 'text-emerald-400' : 'text-white'}`}>{ex.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">{ex.sets}x{ex.reps}</span>
                      {ex.weight > 0 && <span className="text-xs text-gray-600">{ex.weight}kg</span>}
                      <span className="text-xs text-gray-600">Descanso: {ex.rest}s</span>
                    </div>
                    {ex.notes && <p className="text-xs text-gray-600 mt-0.5 italic">{ex.notes}</p>}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={done ? 'secondary' : 'primary'}
                  onClick={() => toggleExercise(ex.id)}
                >
                  {done ? 'Desfazer' : 'Concluir'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {pct === 100 && (
        <Card className="border-emerald-500/30 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-white">Treino Concluído!</h3>
          <p className="text-sm text-gray-500 mt-1">Parabéns! Você completou todos os exercícios.</p>
          <Link to="/student/history">
            <Button className="mt-4" variant="outline">Ver Histórico</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
