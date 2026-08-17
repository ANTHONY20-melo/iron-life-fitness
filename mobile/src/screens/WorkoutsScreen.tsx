import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useWorkoutStore from '../stores/workoutStore'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Workout } from '../types'

const DAY_LABELS: Record<string, string> = {
  segunda: 'Segunda-feira',
  terca: 'Terca-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sabado',
  domingo: 'Domingo',
}

export default function WorkoutsScreen() {
  const router = useRouter()
  const { workouts, isLoading, fetchWorkouts } = useWorkoutStore()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchWorkouts()
    setRefreshing(false)
  }

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const renderWorkout = ({ item }: { item: Workout }) => {
    const isToday = item.dayOfWeek.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') === today

    return (
      <TouchableOpacity
        style={[styles.card, isToday && styles.cardToday]}
        onPress={() => router.push(`/workout/${item.id}`)}
        activeOpacity={0.7}
      >
        {isToday && <View style={styles.todayBadge}><Text style={styles.todayBadgeText}>HOJE</Text></View>}
        <View style={styles.cardLeft}>
          <View style={[styles.iconCircle, isToday && styles.iconCircleActive]}>
            <Ionicons name="barbell" size={22} color={isToday ? '#fff' : colors.primary} />
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardMeta}>
            {DAY_LABELS[item.dayOfWeek] || item.dayOfWeek} · {item.exercises.length} exercicios
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Meus Treinos</Text>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : workouts.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="barbell-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum treino ainda</Text>
          <Text style={styles.emptySub}>Seu personal vai atribuir seus treinos em breve</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(w) => w.id}
          renderItem={renderWorkout}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    color: colors.text,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptySub: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardToday: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardLeft: {
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleActive: {
    backgroundColor: colors.primary,
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.text,
  },
  cardMeta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  todayBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
})
