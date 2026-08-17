import { useState, useEffect } from 'react'
import { Trophy, Lock, Star, Medal, Zap, Target, Flame, Award, Crown, Shield } from 'lucide-react'
import Card from '@/components/common/Card'
import ProgressBar from '@/components/common/ProgressBar'
import Badge from '@/components/common/Badge'
import Skeleton from '@/components/common/Skeleton'
import clsx from 'clsx'

const mockAchievements = [
  { id: '1', name: 'Primeiro Treino', desc: 'Complete seu primeiro treino', icon: '🏋️', points: 50, unlocked: true, date: '2026-01-15' },
  { id: '2', name: 'Semana Perfeita', desc: 'Treine 5 vezes em uma semana', icon: '🔥', points: 100, unlocked: true, date: '2026-03-20' },
  { id: '3', name: 'Mês Consistente', desc: '12+ treinos no mês', icon: '📅', points: 200, unlocked: true, date: '2026-05-01' },
  { id: '4', name: 'Perdeu 5kg', desc: 'Perca 5kg desde o início', icon: '⚖️', points: 300, unlocked: true, date: '2026-06-15' },
  { id: '5', name: '100 Treinos', desc: 'Complete 100 treinos', icon: '💯', points: 500, unlocked: false },
  { id: '6', name: '3 Meses Seguidos', desc: '3 meses sem falhar', icon: '🎯', points: 400, unlocked: false },
  { id: '7', name: 'Mestre do Ferro', desc: 'Complete 500 treinos', icon: '👑', points: 2000, unlocked: false },
  { id: '8', name: 'Transformação Total', desc: 'Perca 20kg', icon: '🦁', points: 1000, unlocked: false },
]

const leaderboard = [
  { rank: 1, name: 'Pedro Almeida', points: 3200, level: 8 },
  { rank: 2, name: 'Juliana Santos', points: 2800, level: 7 },
  { rank: 3, name: 'Carlos Souza', points: 2400, level: 7 },
  { rank: 4, name: 'Ana Lima', points: 2100, level: 6 },
  { rank: 5, name: 'Você', points: 1250, level: 5 },
]

export default function Achievements() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Conquistas</h1>
        <p className="text-sm text-gray-500 mt-1">Sua jornada de evolução</p>
      </div>

      {/* Level card */}
      <Card className="border-primary/20">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Crown className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">Nível 5</h3>
              <Badge variant="danger">Avançado</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">1.250 pontos</p>
            <ProgressBar value={250} max={500} label="Próximo nível" className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">250 pontos para Nível 6</p>
          </div>
        </div>
      </Card>

      {/* Achievements grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Medalhas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockAchievements.map((a) => (
            <Card
              key={a.id}
              className={clsx(
                'text-center transition-all duration-300',
                a.unlocked ? 'border-primary/20' : 'opacity-50'
              )}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <h4 className="text-sm font-semibold text-white">{a.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{a.desc}</p>
              <div className="mt-2">
                {a.unlocked ? (
                  <Badge variant="success">+{a.points} pts</Badge>
                ) : (
                  <Badge variant="default">
                    <Lock className="w-3 h-3 mr-1" /> Bloqueado
                  </Badge>
                )}
              </div>
              {a.date && (
                <p className="text-[10px] text-gray-600 mt-2">
                  {new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Medal className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Ranking</h3>
        </div>
        <div className="space-y-3">
          {leaderboard.map((l) => (
            <div
              key={l.rank}
              className={clsx(
                'flex items-center gap-4 p-3 rounded-xl',
                l.name === 'Você' ? 'bg-primary/10 border border-primary/20' : 'bg-[#0a0a0a]'
              )}
            >
              <div className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                l.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                l.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                l.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                'bg-[#1a1a1a] text-gray-500'
              )}>
                {l.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{l.name}</p>
                <p className="text-xs text-gray-500">Nível {l.level}</p>
              </div>
              <p className="text-sm font-bold text-white">{l.points.toLocaleString()} pts</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
