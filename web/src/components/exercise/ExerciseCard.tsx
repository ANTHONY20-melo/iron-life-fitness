import { useState, useEffect } from 'react'
import { Eye, ExternalLink, Dumbbell, Zap, Shield, Users, Info, Plus } from 'lucide-react'
import { ExerciseLibraryItem } from '@/services/exerciseLibrary'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Modal from '@/components/common/Modal'

const difficultyLabels: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado'
}

const difficultyColors: Record<string, 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger'
}

interface ExerciseCardProps {
  exercise: ExerciseLibraryItem
  onView?: (exercise: ExerciseLibraryItem) => void
  onAddToWorkout?: (exercise: ExerciseLibraryItem) => void
  showActions?: boolean
  onClick?: (exercise: ExerciseLibraryItem) => void
}

interface ExerciseCardState {
  gifLoaded: boolean
  gifError: boolean
  hovered: boolean
}

/**
 * ComponenteCard de exercício com GIF animado demonstrativo.
 * Clique para ver a demonstração completa.
 */
export default function ExerciseCard({
  exercise,
  onView,
  onAddToWorkout,
  showActions = true,
  onClick
}: ExerciseCardProps) {
  const [gifLoaded, setGifLoaded] = useState(false)
  const [gifError, setGifError] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Preload GIF on mount and hover
  useEffect(() => {
    // Always try to preload on mount if GIF URL exists
    if (exercise.gifUrl && !gifLoaded && !gifError) {
      const img = new Image()
      img.onload = () => setGifLoaded(true)
      img.onerror = () => setGifError(true)
      img.src = exercise.gifUrl
    }
  }, [exercise.gifUrl, gifLoaded, gifError])

  // Preload on hover
  useEffect(() => {
    if (hovered && exercise.gifUrl && !gifLoaded && !gifError) {
      const img = new Image()
      img.onload = () => setGifLoaded(true)
      img.onerror = () => setGifError(true)
      img.src = exercise.gifUrl
    }
  }, [hovered, exercise.gifUrl, gifLoaded, gifError])

  if (!exercise.name) return null

  // Handle click - either custom handler or open view modal
  return (
    <>
<Card 
  onClick={() => { if (onClick) onClick(exercise) }}
  className="group relative overflow-hidden"
>
        {/* GIF Preview Area */}
        <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden rounded-lg mb-3">
          {/* GIF Image */}
          {exercise.gifUrl && !gifError && (
            <img
              src={exercise.gifUrl}
              alt={`${exercise.namePt} demonstração`}
              className={`w-full h-full object-cover transition-all duration-500 ${
                gifLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-105 group-hover:opacity-100`}
              loading="lazy"
              onLoad={() => setGifLoaded(true)}
              onError={() => setGifError(true)}
            />
          )}
          
          {/* Fallback quando GIF falha ou não existe */}
          {gifError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="text-center p-4">
                <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">GIF indisponível</p>
                <p className="text-xs text-gray-600 mt-1">{exercise.namePt}</p>
              </div>
            </div>
          )}

          {/* Sem GIF definido */}
          {!exercise.gifUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
              <Dumbbell className="w-16 h-16 text-gray-700" />
            </div>
          )}

          {/* Difficulty Badge Overlay */}
          <div className="absolute top-2 right-2">
            <Badge variant={difficultyColors[exercise.difficulty]} className="text-xs">
              {difficultyLabels[exercise.difficulty]}
            </Badge>
          </div>

          {/* Quick Actions on Hover */}
          {showActions && hovered && (
            <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0">
              {onView && (
                <button
                  onClick={(e) => { e.stopPropagation(); onView(exercise) }}
                  className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" /> Ver Detalhes
                </button>
              )}
              {onAddToWorkout && (
                <button
                  onClick={(e) => { e.stopPropagation(); onAddToWorkout(exercise) }}
                  className="flex-1 bg-primary hover-bg-primary/90 text-white text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Exercise Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                {exercise.namePt}
              </h3>
              <p className="text-xs text-gray-500 truncate">{exercise.muscleGroup}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons on Hover */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t border-[#2a2a2a]">
            {onView && (
              <button
                onClick={() => onView(exercise)}
                className="flex-1 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" /> Ver
              </button>
            )}
            {onAddToWorkout && (
              <button
                onClick={() => onAddToWorkout(exercise)}
                className="flex-1 py-1.5 text-xs bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            )}
          </div>
        )}
      </Card>

      {/* Detail Modal - shown on click or onView */}
      {onView && (
        <Modal
          open={true}
          onClose={() => {}}
          title={exercise.namePt}
          size="lg"
        >
          <div className="space-y-6">
            {/* GIF Full Size */}
            <div className="relative aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden">
              {exercise.gifUrl ? (
                <img
                  src={exercise.gifUrl}
                  alt={`${exercise.namePt} demonstração completa`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Dumbbell className="w-20 h-20 text-gray-700" />
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-xs text-gray-500">Grupo Muscular</p>
                <p className="text-sm font-medium text-white">{exercise.muscleGroup}</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-xs text-gray-500">Equipamento</p>
                <p className="text-sm font-medium text-white">{exercise.equipment}</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-xs text-gray-500">Categoria</p>
                <p className="text-sm font-medium text-white">{exercise.category}</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <p className="text-xs text-gray-500">Dificuldade</p>
                <Badge variant={difficultyColors[exercise.difficulty]}>
                  {difficultyLabels[exercise.difficulty]}
                </Badge>
              </div>
            </div>

            {/* Instructions */}
            {exercise.instructions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" /> Instruções
                </h4>
                <ol className="space-y-2">
                  {exercise.instructions.map((instruction, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <span className="w-5 h-5 flex items-center justify-center bg-primary/20 text-primary rounded-full text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Target Muscles */}
            {exercise.targetMuscles.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Músculos Trabalhados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.targetMuscles.map((muscle, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}