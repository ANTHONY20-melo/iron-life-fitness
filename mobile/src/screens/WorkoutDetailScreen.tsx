import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle } from 'react-native-svg'
import useWorkoutStore from '../stores/workoutStore'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Exercise } from '../types'

interface Props {
  workoutId: string
}

const REST_STATES = [30, 45, 60, 90, 120]

export default function WorkoutDetailScreen({ workoutId }: Props) {
  const router = useRouter()
  const { currentWorkout, fetchWorkoutById, isLoading } = useWorkoutStore()

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [activeTimer, setActiveTimer] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerTotal, setTimerTotal] = useState(60)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetchWorkoutById(workoutId)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [workoutId])

  const progress = currentWorkout
    ? completedIds.size / currentWorkout.exercises.length
    : 0

  const toggleExercise = useCallback((exerciseId: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(exerciseId)) {
        next.delete(exerciseId)
      } else {
        next.add(exerciseId)
      }
      return next
    })
  }, [])

  const startRestTimer = useCallback((seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimerTotal(seconds)
    setTimerSeconds(seconds)
    setActiveTimer(seconds)

    intervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setActiveTimer(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const cancelTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActiveTimer(null)
    setTimerSeconds(0)
  }, [])

  const finishWorkout = useCallback(() => {
    if (completedIds.size === 0) {
      Alert.alert('Atencao', 'Voce ainda nao completou nenhum exercicio.')
      return
    }
    Alert.alert(
      'Finalizar Treino',
      `Voce completou ${completedIds.size}/${currentWorkout?.exercises.length} exercicios. Confirma?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: () => {
            Alert.alert('Treino Finalizado! 🎉', 'Parabens! Seu treino foi registrado.')
            router.back()
          },
        },
      ]
    )
  }, [completedIds, currentWorkout, router])

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
    const sec = s % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const renderTimer = () => {
    if (activeTimer === null) return null

    const radius = 50
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference * (1 - timerSeconds / timerTotal)

    return (
      <View style={styles.timerOverlay}>
        <View style={styles.timerContainer}>
          <Svg width={120} height={120}>
            <Circle cx={60} cy={60} r={radius} stroke={colors.surfaceLight} strokeWidth={6} fill="none" />
            <Circle
              cx={60}
              cy={60}
              r={radius}
              stroke={colors.primary}
              strokeWidth={6}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="60, 60"
            />
          </Svg>
          <View style={styles.timerTextWrap}>
            <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
            <Text style={styles.timerLabel}>Descanso</Text>
          </View>
          <TouchableOpacity style={styles.timerCancel} onPress={cancelTimer}>
            <Text style={styles.timerCancelText}>Pular</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (isLoading || !currentWorkout) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>{currentWorkout.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedIds.size}/{currentWorkout.exercises.length} completos
        </Text>
      </View>

      {/* Rest timer presets */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.restRow} contentContainerStyle={styles.restRowContent}>
        {REST_STATES.map((s) => (
          <TouchableOpacity
            key={s}
            style={styles.restPill}
            onPress={() => startRestTimer(s)}
          >
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.restPillText}>{s}s</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise list */}
      <ScrollView style={styles.exerciseList} contentContainerStyle={styles.exerciseListContent}>
        {currentWorkout.exercises.map((ex, idx) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            index={idx}
            completed={completedIds.has(ex.id)}
            onToggle={() => toggleExercise(ex.id)}
            onRest={() => startRestTimer(ex.restSeconds || 60)}
          />
        ))}
      </ScrollView>

      {/* Finish button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.finishBtn, progress < 0.5 && styles.finishBtnDisabled]}
          onPress={finishWorkout}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.finishBtnText}>Finalizar Treino</Text>
        </TouchableOpacity>
      </View>

      {renderTimer()}
    </SafeAreaView>
  )
}

function ExerciseCard({
  exercise,
  index,
  completed,
  onToggle,
  onRest,
}: {
  exercise: Exercise
  index: number
  completed: boolean
  onToggle: () => void
  onRest: () => void
}) {
  return (
    <View style={[styles.exCard, completed && styles.exCardCompleted]}>
      <View style={styles.exLeft}>
        <TouchableOpacity style={[styles.exCheck, completed && styles.exCheckDone]} onPress={onToggle}>
          {completed && <Ionicons name="checkmark" size={16} color="#fff" />}
        </TouchableOpacity>
      </View>
      <View style={styles.exBody}>
        <View style={styles.exHeader}>
          <Text style={styles.exIndex}>#{index + 1}</Text>
          <Text style={[styles.exName, completed && styles.exNameDone]}>{exercise.name}</Text>
        </View>
        <View style={styles.exSpecs}>
          <View style={styles.exSpec}>
            <Text style={styles.exSpecLabel}>Series</Text>
            <Text style={styles.exSpecValue}>{exercise.sets}x{exercise.reps}</Text>
          </View>
          {exercise.weight ? (
            <View style={styles.exSpec}>
              <Text style={styles.exSpecLabel}>Carga</Text>
              <Text style={styles.exSpecValue}>{exercise.weight}kg</Text>
            </View>
          ) : null}
          <View style={styles.exSpec}>
            <Text style={styles.exSpecLabel}>Descanso</Text>
            <Text style={styles.exSpecValue}>{exercise.restSeconds}s</Text>
          </View>
        </View>
        {exercise.notes ? <Text style={styles.exNotes}>{exercise.notes}</Text> : null}
        <TouchableOpacity style={styles.restBtn} onPress={onRest}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={styles.restBtnText}>Iniciar descanso ({exercise.restSeconds}s)</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  progressWrap: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  restRow: {
    maxHeight: 44,
    marginBottom: spacing.sm,
  },
  restRowContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  restPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  restPillText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseListContent: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: 100,
  },
  exCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  exCardCompleted: {
    opacity: 0.6,
    borderColor: colors.success,
  },
  exLeft: {
    marginRight: spacing.md,
    paddingTop: 2,
  },
  exCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exCheckDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  exBody: {
    flex: 1,
  },
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  exIndex: {
    fontSize: fontSize.xs,
    fontWeight: '800',
    color: colors.primary,
  },
  exName: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  exNameDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  exSpecs: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  exSpec: {
    gap: 2,
  },
  exSpecLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  exSpecValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  exNotes: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  restBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  restBtnText: {
    fontSize: fontSize.xs,
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  finishBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  finishBtnText: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: '#fff',
  },
  timerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  timerContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  timerTextWrap: {
    position: 'absolute',
    top: 35,
    alignItems: 'center',
  },
  timerText: {
    fontSize: fontSize['3xl'],
    fontWeight: '800',
    color: colors.text,
  },
  timerLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  timerCancel: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerCancelText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text,
  },
})
