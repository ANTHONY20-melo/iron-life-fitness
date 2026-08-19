/**
 * Dados mock dos treinos com exercícios reais e GIFs do CDN.
 * Cada treino tem um grupo muscular principal.
 */

export interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: number
  weight: number
  notes: string
}

export interface Workout {
  id: string
  name: string
  day: string
  icon: string
  color: string
  description: string
  exercises: WorkoutExercise[]
}

export const WORKOUTS: Workout[] = [
  // ── Treino A: Peito e Tríceps ──
  {
    id: 'a',
    name: 'Treino A — Peito e Tríceps',
    day: 'Segunda',
    icon: '💪',
    color: 'from-blue-600 to-blue-800',
    description: 'Foco em peito e tríceps com exercícios compostos e isolados',
    exercises: [
      { id: 'a1', name: 'Supino Reto', sets: 4, reps: '10-12', rest: 90, weight: 60, notes: 'Controlar a descida, pausa de 1s no peito' },
      { id: 'a2', name: 'Supino Inclinado Halteres', sets: 3, reps: '10-12', rest: 90, weight: 24, notes: 'Ângulo de 30-45°' },
      { id: 'a3', name: 'Crucifixo Máquina', sets: 3, reps: '12-15', rest: 60, weight: 30, notes: '' },
      { id: 'a4', name: 'Crossover', sets: 3, reps: '12-15', rest: 60, weight: 15, notes: 'Contração no final por 2s' },
      { id: 'a5', name: 'Tríceps Pulley', sets: 4, reps: '10-12', rest: 60, weight: 25, notes: 'Cotovelo fixo ao lado do corpo' },
      { id: 'a6', name: 'Tríceps Testa', sets: 3, reps: '10-12', rest: 60, weight: 20, notes: 'Barra reta ou W' },
      { id: 'a7', name: 'Mergulho entre Bancos', sets: 3, reps: 'Até falha', rest: 60, weight: 0, notes: '' },
      { id: 'a8', name: 'Extensão Corda', sets: 3, reps: '12-15', rest: 60, weight: 15, notes: 'Abrir a corda no final' },
    ],
  },

  // ── Treino B: Costas e Bíceps ──
  {
    id: 'b',
    name: 'Treino B — Costas e Bíceps',
    day: 'Terça',
    icon: '🏋️',
    color: 'from-emerald-600 to-emerald-800',
    description: 'Trabalho de costas com puxadas e remadas, finalizando com bíceps',
    exercises: [
      { id: 'b1', name: 'Puxada Frontal', sets: 4, reps: '10-12', rest: 90, weight: 40, notes: 'Puxar até o queixo, lombar levemente inclinada' },
      { id: 'b2', name: 'Remada Curvada', sets: 4, reps: '10-12', rest: 90, weight: 40, notes: 'Costas retas, ângulo de 45°' },
      { id: 'b3', name: 'Barra Fixa', sets: 3, reps: 'Até falha', rest: 90, weight: 0, notes: 'Pegada pronada, amplitude total' },
      { id: 'b4', name: 'Remada Cable', sets: 3, reps: '12-15', rest: 60, weight: 30, notes: 'Sentado, puxar para o abdômen' },
      { id: 'b5', name: 'Rosca Direta', sets: 3, reps: '10-12', rest: 60, weight: 20, notes: 'Barra reta, cotovelos fixos' },
      { id: 'b6', name: 'Rosca Alternada', sets: 3, reps: '10-12', rest: 60, weight: 12, notes: 'Rotação do punho no topo' },
      { id: 'b7', name: 'Rosca Martelo', sets: 3, reps: '12-15', rest: 60, weight: 12, notes: 'Halteres neutros' },
    ],
  },

  // ── Treino C: Pernas ──
  {
    id: 'c',
    name: 'Treino C — Pernas',
    day: 'Quarta',
    icon: '🦵',
    color: 'from-orange-600 to-red-700',
    description: 'Pernas completas: quadríceps, posteriores e panturrilha',
    exercises: [
      { id: 'c1', name: 'Agachamento Livre', sets: 4, reps: '8-10', rest: 120, weight: 60, notes: 'Até paralelo, joelhos alinhados com os pés' },
      { id: 'c2', name: 'Leg Press', sets: 4, reps: '10-12', rest: 90, weight: 120, notes: 'Pés na largura dos ombros' },
      { id: 'c3', name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: 60, weight: 30, notes: 'Contração no topo por 1s' },
      { id: 'c4', name: 'Leg Curl', sets: 3, reps: '12-15', rest: 60, weight: 25, notes: 'Controle a fase excêntrica' },
      { id: 'c5', name: 'Stiff', sets: 3, reps: '10-12', rest: 90, weight: 40, notes: 'Joelhos levemente flexionados, costas retas' },
      { id: 'c6', name: 'Elevação de Panturrilha', sets: 4, reps: '15-20', rest: 45, weight: 40, notes: 'Amplitude total, pausa no topo' },
      { id: 'c7', name: 'Panturrilha no Leg Press', sets: 3, reps: '15-20', rest: 45, weight: 60, notes: 'Só a ponta dos pés na plataforma' },
    ],
  },

  // ── Treino D: Ombros e Abdômen ──
  {
    id: 'd',
    name: 'Treino D — Ombros e Abdômen',
    day: 'Quinta',
    icon: '🎯',
    color: 'from-purple-600 to-purple-800',
    description: 'Ombros completos (frontal, lateral, posterior) + core',
    exercises: [
      { id: 'd1', name: 'Desenvolvimento', sets: 4, reps: '10-12', rest: 90, weight: 16, notes: 'Halteres ou barra, amplitude completa' },
      { id: 'd2', name: 'Elevação Lateral', sets: 4, reps: '12-15', rest: 60, weight: 8, notes: 'Cotovelos levemente flexionados' },
      { id: 'd3', name: 'Face Pull', sets: 3, reps: '15-20', rest: 60, weight: 15, notes: 'Puxar até a testa, rotação externa' },
      { id: 'd4', name: 'Elevação Frontal', sets: 3, reps: '12-15', rest: 60, weight: 8, notes: '' },
      { id: 'd5', name: 'Abdominal', sets: 3, reps: '20', rest: 45, weight: 0, notes: 'Contrair o abdômen no topo' },
      { id: 'd6', name: 'Prancha', sets: 3, reps: '45s', rest: 30, weight: 0, notes: 'Corpo reto, não deixar o quadril cair' },
      { id: 'd7', name: 'Crunch', sets: 3, reps: '20', rest: 45, weight: 0, notes: '' },
    ],
  },

  // ── Treino E: Full Body ──
  {
    id: 'e',
    name: 'Treino E — Full Body',
    day: 'Sexta',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-600',
    description: 'Treino completo do corpo para iniciantes ou manutenção',
    exercises: [
      { id: 'e1', name: 'Agachamento Livre', sets: 3, reps: '10-12', rest: 90, weight: 40, notes: '' },
      { id: 'e2', name: 'Supino Reto', sets: 3, reps: '10-12', rest: 90, weight: 40, notes: '' },
      { id: 'e3', name: 'Remada Curvada', sets: 3, reps: '10-12', rest: 90, weight: 30, notes: '' },
      { id: 'e4', name: 'Desenvolvimento', sets: 3, reps: '10-12', rest: 60, weight: 12, notes: '' },
      { id: 'e5', name: 'Leg Press', sets: 3, reps: '12-15', rest: 60, weight: 80, notes: '' },
      { id: 'e6', name: 'Puxada Frontal', sets: 3, reps: '12-15', rest: 60, weight: 30, notes: '' },
      { id: 'e7', name: 'Rosca Direta', sets: 2, reps: '12-15', rest: 45, weight: 15, notes: '' },
      { id: 'e8', name: 'Tríceps Pulley', sets: 2, reps: '12-15', rest: 45, weight: 20, notes: '' },
      { id: 'e9', name: 'Elevação Lateral', sets: 2, reps: '15', rest: 45, weight: 6, notes: '' },
      { id: 'e10', name: 'Prancha', sets: 3, reps: '30s', rest: 30, weight: 0, notes: '' },
    ],
  },
]

/** Busca treino por ID */
export function getWorkout(id: string): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id)
}
