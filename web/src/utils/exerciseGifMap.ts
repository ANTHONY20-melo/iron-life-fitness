/**
 * Mapeamento de nomes de exercícios (PT-BR) para IDs do CDN ExerciseGymGifsDB.
 * CDN: https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0
 *
 * O lookup é feito por match parcial normalizado (lowercase, sem acentos, sem pontuação).
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'

/** Tabela de mapeamento: slug do exercício → ID completo do CDN */
const EXERCISE_ID_MAP: Record<string, string> = {
  // Peito
  'supino-reto': 'pectorals/barbell-bench-press',
  'supino reto': 'pectorals/barbell-bench-press',
  'bench press': 'pectorals/barbell-bench-press',
  'supino-inclinado-halteres': 'pectorals/incline-dumbbell-press',
  'supino inclinado halteres': 'pectorals/incline-dumbbell-press',
  'incline dumbbell press': 'pectorals/incline-dumbbell-press',
  'supino inclinado': 'pectorals/incline-barbell-bench-press',
  'crucifixo-maquina': 'pectorals/lever-pec-deck-fly',
  'crucifixo maquina': 'pectorals/lever-pec-deck-fly',
  'pec deck': 'pectorals/lever-pec-deck-fly',
  'crossover': 'pectorals/cable-crossover',
  'supino-declinado': 'pectorals/decline-bench-press',
  'supino com halteres': 'pectorals/dumbbell-bench-press',
  'flexao': 'pectorals/push-up',
  'flexão': 'pectorals/push-up',

  // Costas
  'puxada-frontal': 'lats/pull-up',
  'puxada frontal': 'lats/pull-up',
  'pull up': 'lats/pull-up',
  'pull-up': 'lats/pull-up',
  'remada-curvada': 'lats/bent-over-barbell-row',
  'remada curvada': 'lats/bent-over-barbell-row',
  'remada': 'lats/seated-cable-row',
  'pull down': 'lats/lever-pulldown',
  'puxada': 'lats/lever-pulldown',
  'barra-fixa': 'lats/pull-up',
  'barra fixa': 'lats/pull-up',

  // Pernas
  'agachamento-livre': 'quads/barbell-squat',
  'agachamento livre': 'quads/barbell-squat',
  'squat': 'quads/barbell-squat',
  'leg press': 'quads/lever-leg-press',
  'cadeira-extensora': 'quads/lever-knee-extension',
  'cadeira extensora': 'quads/lever-knee-extension',
  'leg curl': 'hamstrings/lying-leg-curl',
  'stiff': 'hamstrings/romanian-deadlift',
  'agachamento': 'quads/barbell-squat',
  'calf raise': 'calves/standing-calf-raise',
  'elevacao-de-panturrilha': 'calves/standing-calf-raise',
  'elevação de panturrilha': 'calves/standing-calf-raise',

  // Ombros
  'desenvolvimento': 'delts/seated-dumbbell-press',
  'desenvolvimento militar': 'delts/military-press',
  'elevacao-lateral': 'delts/dumbbell-lateral-raise',
  'elevação lateral': 'delts/dumbbell-lateral-raise',
  'lateral raise': 'delts/dumbbell-lateral-raise',
  'face pull': 'delts/cable-face-pull',

  // Bíceps
  'rosca-direta': 'biceps/barbell-curl',
  'rosca direta': 'biceps/barbell-curl',
  'barbell curl': 'biceps/barbell-curl',
  'rosca alternada': 'biceps/alternating-dumbbell-curl',
  'rosca martelo': 'biceps/hammer-curl',

  // Tríceps
  'triceps-pulley': 'triceps/triceps-pushdown',
  'tríceps pulley': 'triceps/triceps-pushdown',
  'triceps pulley': 'triceps/triceps-pushdown',
  'triceps-testa': 'triceps/barbell-skull-crusher',
  'tríceps testa': 'triceps/barbell-skull-crusher',
  'triceps testa': 'triceps/barbell-skull-crusher',
  'mergulho-entre-bancos': 'triceps/bench-dip',
  'mergulho entre bancos': 'triceps/bench-dip',
  'mergulho': 'triceps/bench-dip',
  'extensao-corda': 'triceps/cable-rope-tricep-extension',
  'extensão corda': 'triceps/cable-rope-tricep-extension',
  'extensao corda': 'triceps/cable-rope-tricep-extension',
  'skull crusher': 'triceps/barbell-skull-crusher',
  'dips': 'triceps/bench-dip',

  // Abdômen
  'prancha': 'abs/plank',
  'abdominal': 'abs/3-4-sit-up',
  'crunch': 'abs/crunch',
}

/**
 * Normaliza um nome de exercício para lookup no mapa.
 * Remove acentos, pontuação, converte para lowercase.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^\w\s]/g, ' ')        // pontuação → espaço
    .replace(/\s+/g, ' ')            // espaços múltiplos → um
    .trim()
}

/**
 * Busca o ID do CDN para um nome de exercício.
 * Tenta match exato primeiro, depois parcial.
 * Retorna null se não encontrar.
 */
export function getExerciseGifId(exerciseName: string): string | null {
  const key = normalize(exerciseName)

  // 1. Match exato
  if (EXERCISE_ID_MAP[key]) {
    return EXERCISE_ID_MAP[key]
  }

  // 2. Match parcial: verifica se algum key do mapa está contido no nome
  for (const [mapKey, id] of Object.entries(EXERCISE_ID_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return id
    }
  }

  return null
}

/**
 * Retorna a URL completa do GIF para um exercício.
 */
export function getExerciseGifUrl(exerciseName: string): string | null {
  const id = getExerciseGifId(exerciseName)
  if (!id) return null
  return `${CDN_BASE}/${id}.gif`
}

export { CDN_BASE }
