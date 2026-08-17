import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useAuthStore from '../stores/authStore'
import useWorkoutStore from '../stores/workoutStore'
import api from '../services/api'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Appointment } from '../types'

export default function HomeScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { todayWorkout, fetchTodayWorkout } = useWorkoutStore()
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null)
  const [weekFrequency, setWeekFrequency] = useState(0)
  const [monthFrequency, setMonthFrequency] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    fetchTodayWorkout()
    try {
      const [apptRes, statsRes] = await Promise.all([
        api.get<Appointment[]>('/appointments?status=scheduled&limit=1'),
        api.get<{ week: number; month: number }>('/stats/frequency'),
      ])
      setNextAppointment(apptRes.data[0] || null)
      setWeekFrequency(statsRes.data.week)
      setMonthFrequency(statsRes.data.month)
    } catch {
      // stats endpoint may not exist yet
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const firstName = user?.name?.split(' ')[0] || 'Atleta'

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Ola, {firstName}! 💪</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Level badge */}
        <View style={styles.levelBadge}>
          <Ionicons name="trophy" size={20} color={colors.warning} />
          <Text style={styles.levelText}>Nivel {user?.level || 1}</Text>
          <View style={styles.levelDivider} />
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={styles.pointsText}>{user?.points || 0} pts</Text>
        </View>

        {/* Today's workout */}
        {todayWorkout ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="barbell" size={22} color={colors.primary} />
              <Text style={styles.cardTitle}>Treino de Hoje</Text>
            </View>
            <Text style={styles.workoutName}>{todayWorkout.name}</Text>
            <Text style={styles.workoutMeta}>
              {todayWorkout.exercises.length} exercicios · {todayWorkout.dayOfWeek}
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push(`/workout/${todayWorkout.id}`)}
            >
              <Ionicons name="play" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Iniciar Treino</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="barbell" size={22} color={colors.textMuted} />
              <Text style={styles.cardTitle}>Treino de Hoje</Text>
            </View>
            <Text style={styles.emptyText}>Nenhum treino atribuido para hoje</Text>
          </View>
        )}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={22} color={colors.primary} />
            <Text style={styles.statValue}>{weekFrequency}</Text>
            <Text style={styles.statLabel}>Esta semana</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={22} color={colors.info} />
            <Text style={styles.statValue}>{monthFrequency}</Text>
            <Text style={styles.statLabel}>Este mes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={22} color={colors.warning} />
            <Text style={styles.statValue}>{user?.points || 0}</Text>
            <Text style={styles.statLabel}>Pontos</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acoes Rapidas</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="location" size={20} color="#fff" />
              </View>
              <Text style={styles.actionText}>Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/workouts')}>
              <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
                <Ionicons name="list" size={20} color="#fff" />
              </View>
              <Text style={styles.actionText}>Ver Treinos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/evolution')}>
              <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
                <Ionicons name="trending-up" size={20} color="#fff" />
              </View>
              <Text style={styles.actionText}>Evolucao</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/schedule')}>
              <View style={[styles.actionIcon, { backgroundColor: colors.warning }]}>
                <Ionicons name="calendar" size={20} color="#fff" />
              </View>
              <Text style={styles.actionText}>Agendar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Next appointment */}
        {nextAppointment && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time" size={22} color={colors.success} />
              <Text style={styles.cardTitle}>Proximo Agendamento</Text>
            </View>
            <View style={styles.appointmentRow}>
              <View>
                <Text style={styles.appointmentTitle}>{nextAppointment.type}</Text>
                <Text style={styles.appointmentMeta}>
                  com {nextAppointment.trainerName}
                </Text>
              </View>
              <View style={styles.appointmentTime}>
                <Text style={styles.appointmentDateText}>
                  {new Date(nextAppointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </Text>
                <Text style={styles.appointmentHour}>{nextAppointment.time}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    color: colors.text,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  notifBtn: {
    padding: spacing.sm,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.warning,
  },
  levelDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },
  pointsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.text,
  },
  workoutName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  workoutMeta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    paddingVertical: spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  primaryBtnText: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionBtn: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text,
  },
  appointmentMeta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  appointmentDateText: {
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: '600',
  },
  appointmentHour: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
})
