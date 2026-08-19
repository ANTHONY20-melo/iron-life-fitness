import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Minus, Check, Dumbbell, ChevronDown, ChevronUp, Eye } from 'lucide-react'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import ProgressBar from '@/components/common/ProgressBar'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'
import { getExerciseGifUrl } from '@/utils/exerciseGifMap'
import { getWorkout } from '@/data/workoutData'
import type { WorkoutExercise } from '@/data/workoutData'

export default function WorkoutDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [workout, setWorkout] = useState<ReturnType<typeof getWorkout>>(undefined)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [timerRunning, setTimerRunning] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [gifErrors, setGifErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = getWorkout(id || 'a')
      setWorkout(found || undefined)
      setExercises(found?.exercises || [])
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [id])

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
    setRestTime(seconds)
    setTimerRunning(true)
  }, [])

  const toggleExercise = (exerciseId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(exerciseId)) next.delete(exerciseId)
      else {
        next.add(exerciseId)
        const exercise = exercises.find((e) => e.id === exerciseId)
        if (exercise?.rest) startRest(exercise.rest)
      }
      return next
    })
  }

  const toggleExpand = (exerciseId: string) => {
    setExpandedId((prev) => (prev === exerciseId ? null : exerciseId))
  }

  const handleGifError = (exerciseId: string) => {
    setGifErrors((prev) => new Set(prev).add(exerciseId))
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

  if (!workout) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <Link to="/student/workouts" className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1a1a1a] inline-flex">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Card className="text-center py-12">
          <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Treino não encontrado</h2>
          <p className="text-sm text-gray-500 mt-1">Este treino não existe ou foi removido.</p>
          <Link to="/student/workouts">
            <Button className="mt-4" variant="outline">Voltar para Treinos</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/student/workouts" className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1a1a1a]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{workout.icon}</span>
            <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{exercises.length} exercícios • {workout.day} • Prof. Rafael Costa</p>
        </div>
      </div>

      {/* Progress */}
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
          const expanded = expandedId === ex.id
          const gifUrl = getExerciseGifUrl(ex.name)
          const gifFailed = gifErrors.has(ex.id)

          return (
            <Card
              key={ex.id}
              className={`transition-all duration-300 ${done ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
            >
              {/* Exercise header — click to expand/collapse */}
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => toggleExpand(ex.id)}
              >
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
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {expanded
                    ? <ChevronUp className="w-4 h-4 text-gray-500" />
                    : <ChevronDown className="w-4 h-4 text-gray-500" />
                  }
                </div>
              </div>

              {/* Expanded area — GIF demo + notes + treinar button */}
              {expanded && (
                <div className="mt-4 space-y-3 animate-fadeIn">
                  {/* GIF area */}
                  {gifUrl && !gifFailed ? (
                    <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a] aspect-video">
                      <img
                        src={gifUrl}
                        alt={`${ex.name} - demonstração`}
                        className="w-full h-full object-contain"
                        onError={() => handleGifError(ex.id)}
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="default" className="bg-black/60 backdrop-blur-sm text-[10px]">
                          <Eye className="w-3 h-3 mr-1" /> Demonstração
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#0a0a0a] aspect-video flex items-center justify-center">
                      <div className="text-center p-4">
                        <Dumbbell className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Demonstração indisponível</p>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {ex.notes && (
                    <p className="text-xs text-gray-400 italic bg-[#1a1a1a] rounded-lg px-3 py-2">
                      💡 {ex.notes}
                    </p>
                  )}

                  {/* Treinar button */}
                  <div className="flex justify-center">
                    <Button
                      size="md"
                      variant={done ? 'secondary' : 'primary'}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExercise(ex.id)
                      }}
                      icon={done ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    >
                      {done ? 'Desfazer' : 'Treinar'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Quick Treinar button when collapsed */}
              {!expanded && (
                <div className="flex justify-end mt-2 pt-2 border-t border-[#2a2a2a]">
                  <Button
                    size="sm"
                    variant={done ? 'secondary' : 'primary'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExercise(ex.id)
                    }}
                  >
                    {done ? 'Desfazer' : 'Treinar'}
                  </Button>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Completion */}
      {pct === 100 && (
        <Card className="border-emerald-500/30 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-bold text-white">Treino Concluído!</h3>
          <p className="text-sm text-gray-500 mt-1">Parabéns! Você completou todos os {exercises.length} exercícios.</p>
          <Link to="/student/history">
            <Button className="mt-4" variant="outline">Ver Histórico</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
