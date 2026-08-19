/**
 * Mapeamento de nomes de exercícios (PT-BR) para IDs do CDN ExerciseGymGifsDB.
 * CDN: https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0
 *
 * IDs verificados contra a API real (1323 exercícios).
 * Lookup por match parcial normalizado (lowercase, sem acentos, sem pontuação).
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'

/** Tabela de mapeamento: slug do exercício → ID completo do CDN */
const EXERCISE_ID_MAP: Record<string, string> = {
  // ── Peito ──
  'supino-reto': 'pectorals/barbell-bench-press',
  'supino reto': 'pectorals/barbell-bench-press',
  'bench press': 'pectorals/barbell-bench-press',
  'barbell bench press': 'pectorals/barbell-bench-press',
  'supino-inclinado-halteres': 'pectorals/dumbbell-incline-bench-press',
  'supino inclinado halteres': 'pectorals/dumbbell-incline-bench-press',
  'supino inclinado': 'pectorals/dumbbell-incline-bench-press',
  'incline dumbbell press': 'pectorals/dumbbell-incline-bench-press',
  'supino com halteres': 'pectorals/dumbbell-bench-press',
  'dumbbell bench press': 'pectorals/dumbbell-bench-press',
  'crucifixo-maquina': 'pectorals/lever-seated-fly',
  'crucifixo maquina': 'pectorals/lever-seated-fly',
  'crucifixo': 'pectorals/lever-seated-fly',
  'pec deck': 'pectorals/lever-seated-fly',
  'peck deck': 'pectorals/lever-seated-fly',
  'fly': 'pectorals/lever-seated-fly',
  'crossover': 'pectorals/cable-standing-up-straight-crossovers',
  'cable crossover': 'pectorals/cable-standing-up-straight-crossovers',
  'supino-declinado': 'pectorals/decline-bench-press',
  'decline bench press': 'pectorals/decline-bench-press',
  'flexao': 'pectorals/push-up',
  'flexão': 'pectorals/push-up',
  'push up': 'pectorals/push-up',
  'push-up': 'pectorals/push-up',

  // ── Costas ──
  'puxada-frontal': 'lats/cable-pulldown',
  'puxada frontal': 'lats/cable-pulldown',
  'puxada': 'lats/cable-pulldown',
  'pulldown': 'lats/cable-pulldown',
  'pull down': 'lats/cable-pulldown',
  'lat pulldown': 'lats/cable-pulldown',
  'barra-fixa': 'lats/pull-up',
  'barra fixa': 'lats/pull-up',
  'pull up': 'lats/pull-up',
  'pull-up': 'lats/pull-up',
  'remada-curvada': 'upper-back/barbell-bent-over-row',
  'remada curvada': 'upper-back/barbell-bent-over-row',
  'remada': 'upper-back/barbell-bent-over-row',
  'bent over row': 'upper-back/barbell-bent-over-row',
  'barbell row': 'upper-back/barbell-bent-over-row',
  'remada-cable': 'upper-back/cable-seated-row',
  'remada cable': 'upper-back/cable-seated-row',
  'seated cable row': 'upper-back/cable-seated-row',

  // ── Pernas — Quadríceps ──
  'agachamento-livre': 'glutes/barbell-high-bar-squat',
  'agachamento livre': 'glutes/barbell-high-bar-squat',
  'agachamento': 'glutes/barbell-high-bar-squat',
  'squat': 'glutes/barbell-high-bar-squat',
  'barbell squat': 'glutes/barbell-high-bar-squat',
  'leg press': 'glutes/sled-45-leg-press',
  'cadeira-extensora': 'quads/lever-leg-extension',
  'cadeira extensora': 'quads/lever-leg-extension',
  'leg extension': 'quads/lever-leg-extension',
  'extensora': 'quads/lever-leg-extension',

  // ── Pernas — Posteriores ──
  'leg-curl': 'hamstrings/lever-lying-leg-curl',
  'leg curl': 'hamstrings/lever-lying-leg-curl',
  'stiff': 'glutes/barbell-romanian-deadlift',
  'romanian deadlift': 'glutes/barbell-romanian-deadlift',
  'deadlift': 'glutes/barbell-romanian-deadlift',

  // ── Panturrilha ──
  'calf-raise': 'calves/barbell-standing-calf-raise',
  'calf raise': 'calves/barbell-standing-calf-raise',
  'elevacao-de-panturrilha': 'calves/barbell-standing-calf-raise',
  'elevação de panturrilha': 'calves/barbell-standing-calf-raise',
  'panturrilha': 'calves/barbell-standing-calf-raise',
  'panturrilha no leg press': 'calves/lever-seated-calf-raise',
  'leg press panturrilha': 'calves/lever-seated-calf-raise',

  // ── Ombros ──
  'desenvolvimento': 'delts/dumbbell-seated-shoulder-press',
  'desenvolvimento militar': 'delts/dumbbell-seated-shoulder-press',
  'shoulder press': 'delts/dumbbell-seated-shoulder-press',
  'military press': 'delts/dumbbell-seated-shoulder-press',
  'elevacao-lateral': 'delts/dumbbell-lateral-raise',
  'elevação lateral': 'delts/dumbbell-lateral-raise',
  'lateral raise': 'delts/dumbbell-lateral-raise',
  'elevação frontal': 'delts/dumbbell-front-raise',
  'front raise': 'delts/dumbbell-front-raise',
  'face pull': 'delts/cable-standing-rear-delt-row-with-rope',
  'rear delt': 'delts/cable-standing-rear-delt-row-with-rope',

  // ── Bíceps ──
  'rosca-direta': 'biceps/barbell-curl',
  'rosca direta': 'biceps/barbell-curl',
  'barbell curl': 'biceps/barbell-curl',
  'rosca alternada': 'biceps/dumbbell-standing-biceps-curl',
  'dumbbell curl': 'biceps/dumbbell-standing-biceps-curl',
  'rosca martelo': 'biceps/dumbbell-hammer-curl',
  'hammer curl': 'biceps/dumbbell-hammer-curl',

  // ── Tríceps ──
  'triceps-pulley': 'triceps/cable-pushdown',
  'tríceps pulley': 'triceps/cable-pushdown',
  'triceps pulley': 'triceps/cable-pushdown',
  'triceps pushdown': 'triceps/cable-pushdown',
  'pushdown': 'triceps/cable-pushdown',
  'triceps-testa': 'triceps/barbell-lying-triceps-extension-skull-crusher',
  'tríceps testa': 'triceps/barbell-lying-triceps-extension-skull-crusher',
  'triceps testa': 'triceps/barbell-lying-triceps-extension-skull-crusher',
  'skull crusher': 'triceps/barbell-lying-triceps-extension-skull-crusher',
  'mergulho-entre-bancos': 'triceps/triceps-dip-between-benches',
  'mergulho entre bancos': 'triceps/triceps-dip-between-benches',
  'mergulho': 'triceps/triceps-dip-between-benches',
  'dips': 'triceps/triceps-dip-between-benches',
  'bench dip': 'triceps/triceps-dip-between-benches',
  'extensao-corda': 'triceps/cable-pushdown-with-rope-attachment',
  'extensão corda': 'triceps/cable-pushdown-with-rope-attachment',
  'extensao corda': 'triceps/cable-pushdown-with-rope-attachment',
  'rope pushdown': 'triceps/cable-pushdown-with-rope-attachment',
  'tricep rope': 'triceps/cable-pushdown-with-rope-attachment',

  // ── Abdômen ──
  'prancha': 'abs/weighted-front-plank',
  'plank': 'abs/weighted-front-plank',
  'abdominal': 'abs/sit-up-v-2',
  'crunch': 'abs/crunch-floor',
  'sit up': 'abs/sit-up-v-2',
  'sit-up': 'abs/sit-up-v-2',
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
