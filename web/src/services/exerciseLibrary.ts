/**
 * Exercise Service - Integração com ExerciseGymGifsDB (gratuito, sem API key)
 * Fonte: https://github.com/JahelCuadrado/ExerciseGymGifsDB
 * CDN: https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0
 */

export interface ExerciseGif {
  id: string
  name: string
  name_es: string
  muscle_group: string
  equipment: string
  category: string
  gif_url: string
  instructions: string[]
}

export interface ExerciseLibraryItem {
  id: string
  name: string
  namePt: string
  muscleGroup: string
  equipment: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  gifUrl: string
  instructions: string[]
  targetMuscles: string[]
  secondaryMuscles: string[]
}

// Cache local para evitar múltiplas requests
let exercisesCache: ExerciseLibraryItem[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

// Mapeamento de grupos musculares do inglês para PT-BR
const MUSCLE_GROUP_PT: Record<string, string> = {
  'chest': 'Peito',
  'back': 'Costas',
  'shoulders': 'Ombros',
  'biceps': 'Bíceps',
  'triceps': 'Tríceps',
  'forearms': 'Antebraços',
  'quadriceps': 'Quadríceps',
  'hamstrings': 'Posterior de Coxa',
  'glutes': 'Glúteos',
  'calves': 'Panturrilhas',
  'abs': 'Abdômen',
  'obliques': 'Oblíquos',
  'lower_back': 'Lombar',
  'traps': 'Trapézio',
  'neck': 'Pescoço',
  'cardio': 'Cardio',
  'full_body': 'Corpo Inteiro'
}

// Mapeamento de equipamentos
const EQUIPMENT_PT: Record<string, string> = {
  'body_weight': 'Peso Corporal',
  'barbell': 'Barra',
  'dumbbell': 'Halteres',
  'machine': 'Máquina',
  'cable': 'Polia',
  'kettlebell': 'Kettlebell',
  'bands': 'Elásticos/Bandas',
  'medicine_ball': 'Medicine Ball',
  'swiss_ball': 'Swiss Ball',
  'foam_roll': 'Rolo de Espuma',
  'pull_up_bar': 'Barra Fixa',
  'dip_station': 'Paralelas',
  'bench': 'Banco',
  'incline_bench': 'Banco Inclinado',
  'decline_bench': 'Banco Declinado',
  'smith_machine': 'Smith Machine',
  'ez_bar': 'Barra EZ',
  'trap_bar': 'Trap Bar',
  'landmine': 'Landmine',
  'sled': 'Trenó',
  'battle_rope': 'Corda Naval',
  'tire': 'Pneu',
  'wheel_roller': 'Ab Wheel'
}

// Categorias
const CATEGORY_PT: Record<string, string> = {
  'strength': 'Força',
  'stretching': 'Alongamento',
  'cardio': 'Cardio',
  'powerlifting': 'Powerlifting',
  'olympic_weightlifting': 'Levantamento Olímpico',
  'strongman': 'Strongman',
  'plyometrics': 'Pliometria'
}

/**
 * Busca todos os exercícios da API ExerciseGymGifsDB
 */
export async function fetchAllExercises(): Promise<ExerciseLibraryItem[]> {
  // Verifica cache
  if (exercisesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return exercisesCache
  }

  try {
    // URL base da API no jsDelivr (v1.1.0 — tag estável)
    const baseUrl = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'
    
    // Busca o índice de exercícios em espanhol (mais próximo do PT-BR)
    const indexResponse = await fetch(`${baseUrl}/api/es/exercises.json`)
    
    if (!indexResponse.ok) {
      throw new Error('Falha ao buscar índice de exercícios')
    }
    
    const indexData: { count: number; exercises: ExerciseGif[] } = await indexResponse.json()
    const exercisesData = indexData.exercises || indexData as unknown as ExerciseGif[]
    
    // Transforma para nosso formato
    exercisesCache = exercisesData.map((ex, index) => ({
      id: ex.id || `ex_${index}`,
      name: ex.name,
      namePt: ex.name_es || ex.name, // Usa nome em espanhol como base para PT
      muscleGroup: MUSCLE_GROUP_PT[ex.muscle_group?.toLowerCase()] || ex.muscle_group || 'Outros',
      equipment: EQUIPMENT_PT[ex.equipment?.toLowerCase()] || ex.equipment || 'Variado',
      category: CATEGORY_PT[ex.category?.toLowerCase()] || ex.category || 'Força',
      difficulty: mapDifficulty(ex.category),
      gifUrl: (ex as unknown as { gifUrl?: string }).gifUrl || `${baseUrl}/${ex.id}.gif`,
      instructions: ex.instructions || [],
      targetMuscles: [MUSCLE_GROUP_PT[ex.muscle_group?.toLowerCase()] || ex.muscle_group || ''],
      secondaryMuscles: []
    }))
    
    cacheTimestamp = Date.now()
    return exercisesCache
  } catch (error) {
    console.error('Erro ao buscar exercícios da API:', error)
    // Fallback para dados locais se a API falhar
    return getFallbackExercises()
  }
}

/**
 * Busca exercício por ID
 */
export async function fetchExerciseById(id: string): Promise<ExerciseLibraryItem | null> {
  const exercises = await fetchAllExercises()
  return exercises.find(ex => ex.id === id) || null
}

/**
 * Busca exercícios por grupo muscular
 */
export async function fetchExercisesByMuscleGroup(muscleGroup: string): Promise<ExerciseLibraryItem[]> {
  const exercises = await fetchAllExercises()
  return exercises.filter(ex => 
    ex.muscleGroup.toLowerCase() === muscleGroup.toLowerCase()
  )
}

/**
 * Busca exercícios por equipamento
 */
export async function fetchExercisesByEquipment(equipment: string): Promise<ExerciseLibraryItem[]> {
  const exercises = await fetchAllExercises()
  return exercises.filter(ex => 
    ex.equipment.toLowerCase() === equipment.toLowerCase()
  )
}

/**
 * Busca exercícios por nome (busca parcial)
 */
export async function searchExercises(query: string): Promise<ExerciseLibraryItem[]> {
  const exercises = await fetchAllExercises()
  const lowerQuery = query.toLowerCase()
  return exercises.filter(ex => 
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.namePt.toLowerCase().includes(lowerQuery) ||
    ex.muscleGroup.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Busca exercícios por categoria
 */
export async function fetchExercisesByCategory(category: string): Promise<ExerciseLibraryItem[]> {
  const exercises = await fetchAllExercises()
  return exercises.filter(ex => 
    ex.category.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Obtém grupos musculares únicos
 */
export async function getMuscleGroups(): Promise<string[]> {
  const exercises = await fetchAllExercises()
  return [...new Set(exercises.map(ex => ex.muscleGroup))].sort()
}

/**
 * Obtém equipamentos únicos
 */
export async function getEquipments(): Promise<string[]> {
  const exercises = await fetchAllExercises()
  return [...new Set(exercises.map(ex => ex.equipment))].sort()
}

/**
 * Obtém categorias únicas
 */
export async function getCategories(): Promise<string[]> {
  const exercises = await fetchAllExercises()
  return [...new Set(exercises.map(ex => ex.category))].sort()
}

/**
 * Mapeia categoria para dificuldade
 */
function mapDifficulty(category: string): 'beginner' | 'intermediate' | 'advanced' {
  const cat = category?.toLowerCase()
  if (cat === 'stretching' || cat === 'cardio') return 'beginner'
  if (cat === 'powerlifting' || cat === 'olympic_weightlifting' || cat === 'strongman') return 'advanced'
  return 'intermediate'
}

/**
 * Dados de fallback caso a API falhe
 */
function getFallbackExercises(): ExerciseLibraryItem[] {
  const fallbackExercises = [
    { name: 'Supino Reto', muscleGroup: 'Peito', equipment: 'Barra', category: 'Força' },
    { name: 'Supino Inclinado', muscleGroup: 'Peito', equipment: 'Halteres', category: 'Força' },
    { name: 'Puxada Frontal', muscleGroup: 'Costas', equipment: 'Polia', category: 'Força' },
    { name: 'Remada Curvada', muscleGroup: 'Costas', equipment: 'Barra', category: 'Força' },
    { name: 'Agachamento Livre', muscleGroup: 'Pernas', equipment: 'Barra', category: 'Força' },
    { name: 'Leg Press', muscleGroup: 'Pernas', equipment: 'Máquina', category: 'Força' },
    { name: 'Desenvolvimento', muscleGroup: 'Ombros', equipment: 'Halteres', category: 'Força' },
    { name: 'Rosca Direta', muscleGroup: 'Bíceps', equipment: 'Barra', category: 'Força' },
    { name: 'Tríceps Pulley', muscleGroup: 'Tríceps', equipment: 'Polia', category: 'Força' },
    { name: 'Prancha', muscleGroup: 'Abdômen', equipment: 'Peso Corporal', category: 'Força' }
  ]

  return fallbackExercises.map((ex, index) => ({
    id: `fallback_${index}`,
    name: ex.name,
    namePt: ex.name,
    muscleGroup: ex.muscleGroup,
    equipment: ex.equipment,
    category: ex.category,
    difficulty: 'intermediate' as const,
    gifUrl: '',
    instructions: ['Mantenha a postura correta', 'Controle o movimento', 'Respire adequadamente'],
    targetMuscles: [ex.muscleGroup],
    secondaryMuscles: []
  }))
}

/**
 * Gera URL do GIF para um exercício
 */
export function getExerciseGifUrl(exerciseId: string): string {
  return `https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/${exerciseId}.gif`
}

/**
 * Verifica se GIF existe (fazendo request HEAD)
 */
export async function checkGifExists(exerciseId: string): Promise<boolean> {
  try {
    const response = await fetch(getExerciseGifUrl(exerciseId), { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Obtém estatísticas da biblioteca
 */
export async function getLibraryStats() {
  const exercises = await fetchAllExercises()
  return {
    total: exercises.length,
    muscleGroups: [...new Set(exercises.map(e => e.muscleGroup))].length,
    equipments: [...new Set(exercises.map(e => e.equipment))].length,
    categories: [...new Set(exercises.map(e => e.category))].length,
    withGif: exercises.filter(e => e.gifUrl).length
  }
}