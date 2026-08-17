import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import useScheduleStore from '../stores/scheduleStore'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Appointment } from '../types'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

function getWeekDays(baseDate: Date): Date[] {
  const start = new Date(baseDate)
  start.setDate(start.getDate() - start.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function ScheduleScreen() {
  const { appointments, isLoading, fetchAppointments, cancelAppointment } = useScheduleStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekOffset, setWeekOffset] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchAppointments()
    setRefreshing(false)
  }

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + weekOffset * 7)
  const weekDays = getWeekDays(baseDate)

  const todayAppointments = appointments.filter(
    (a) => isSameDay(new Date(a.date), selectedDate) && a.status !== 'cancelled'
  )

  const upcomingAppointments = appointments
    .filter((a) => new Date(a.date) >= new Date() && a.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const handleCancel = (id: string) => {
    cancelAppointment(id)
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', weekday: 'short' })
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Agenda</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Week selector */}
        <View style={styles.weekNav}>
          <TouchableOpacity onPress={() => setWeekOffset(weekOffset - 1)} style={styles.weekNavBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.weekLabel}>
            {weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            {' - '}
            {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => setWeekOffset(weekOffset + 1)} style={styles.weekNavBtn}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Day grid */}
        <View style={styles.dayRow}>
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())
            const hasAppointment = appointments.some(
              (a) => isSameDay(new Date(a.date), day) && a.status !== 'cancelled'
            )
            return (
              <TouchableOpacity
                key={i}
                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                  {WEEKDAYS[day.getDay()]}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.dayNumSelected, isToday && styles.dayNumToday]}>
                  {day.getDate()}
                </Text>
                {hasAppointment && <View style={[styles.dayDot, isSelected && styles.dayDotSelected]} />}
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Today's appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isSameDay(selectedDate, new Date()) ? 'Hoje' : formatDate(selectedDate.toISOString())}
          </Text>
          {todayAppointments.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>Nenhum agendamento</Text>
            </View>
          ) : (
            todayAppointments.map((a) => (
              <AppointmentCard key={a.id} appointment={a} onCancel={() => handleCancel(a.id)} />
            ))
          )}
        </View>

        {/* Upcoming */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proximos Agendamentos</Text>
            {upcomingAppointments.map((a) => (
              <AppointmentCard key={a.id} appointment={a} onCancel={() => handleCancel(a.id)} compact />
            ))}
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

function AppointmentCard({
  appointment,
  onCancel,
  compact,
}: {
  appointment: Appointment
  onCancel: () => void
  compact?: boolean
}) {
  const statusColors: Record<string, string> = {
    scheduled: colors.info,
    completed: colors.success,
    cancelled: colors.textMuted,
  }

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={[styles.cardIndicator, { backgroundColor: statusColors[appointment.status] || colors.info }]} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{appointment.type}</Text>
        <Text style={styles.cardMeta}>com {appointment.trainerName}</Text>
        {!compact && (
          <View style={styles.cardDetails}>
            <View style={styles.cardDetail}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.cardDetailText}>{formatDate(appointment.date)}</Text>
            </View>
            <View style={styles.cardDetail}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.cardDetailText}>{appointment.time}</Text>
            </View>
          </View>
        )}
      </View>
      {appointment.status === 'scheduled' && (
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Ionicons name="close-circle-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      )}
    </View>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', weekday: 'short' })
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerBar: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  headerTitle: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.text },
  container: { flex: 1 },
  content: { padding: spacing.md },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  weekNavBtn: { padding: spacing.sm },
  weekLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600' },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  dayCell: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    width: 44,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayName: { fontSize: 10, color: colors.textMuted, fontWeight: '600', marginBottom: 4 },
  dayNameSelected: { color: '#fff' },
  dayNum: { fontSize: fontSize.base, fontWeight: '700', color: colors.text },
  dayNumSelected: { color: '#fff' },
  dayNumToday: { color: colors.primary },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  dayDotSelected: { backgroundColor: '#fff' },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardCompact: { padding: spacing.sm },
  cardIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: fontSize.base, fontWeight: '700', color: colors.text },
  cardMeta: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  cardDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDetailText: { fontSize: fontSize.sm, color: colors.textSecondary },
  cancelBtn: { justifyContent: 'center', paddingLeft: spacing.sm },
})
