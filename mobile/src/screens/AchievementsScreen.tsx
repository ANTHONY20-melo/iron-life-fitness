import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import api from '../services/api'
import useAuthStore from '../stores/authStore'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Achievement } from '../types'

export default function AchievementsScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      const { data } = await api.get<Achievement[]>('/achievements')
      setAchievements(data)
    } catch {
      setAchievements([])
    } finally {
      setLoading(false)
    }
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalPoints = user?.points || 0
  const level = user?.level || 1

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Conquistas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Level badge */}
        <View style={styles.levelCard}>
          <View style={styles.levelCircle}>
            <Text style={styles.levelNumber}>{level}</Text>
          </View>
          <Text style={styles.levelTitle}>Nivel {level}</Text>
          <Text style={styles.levelSub}>{totalPoints} pontos acumulados</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min((totalPoints % 1000) / 10, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{totalPoints % 1000}/1000 para o proximo nivel</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
            <Text style={styles.statValue}>{unlockedCount}</Text>
            <Text style={styles.statLabel}>Desbloqueadas</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="lock-closed" size={24} color={colors.textMuted} />
            <Text style={styles.statValue}>{achievements.length - unlockedCount}</Text>
            <Text style={styles.statLabel}>Bloqueadas</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{achievements.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Achievement grid */}
        <Text style={styles.sectionTitle}>Todas as Conquistas</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : achievements.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="trophy-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma conquista disponivel</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {achievements.map((a) => (
              <View key={a.id} style={[styles.achCard, a.unlocked && styles.achCardUnlocked]}>
                <View style={[styles.achIcon, a.unlocked && styles.achIconUnlocked]}>
                  <Text style={styles.achEmoji}>{a.icon}</Text>
                </View>
                <Text style={[styles.achName, !a.unlocked && styles.achNameLocked]} numberOfLines={2}>
                  {a.name}
                </Text>
                <Text style={styles.achDesc} numberOfLines={2}>{a.description}</Text>
                {a.unlocked ? (
                  <View style={styles.achUnlockedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                    <Text style={styles.achUnlockedText}>Desbloqueada</Text>
                  </View>
                ) : (
                  <View style={styles.achProgressWrap}>
                    <View style={styles.achProgressBar}>
                      <View style={[styles.achProgressFill, { width: `${(a.progress / a.requirement) * 100}%` }]} />
                    </View>
                    <Text style={styles.achProgressText}>{a.progress}/{a.requirement}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { flex: 1, fontSize: fontSize.lg, fontWeight: '700', color: colors.text, textAlign: 'center' },
  container: { flex: 1 },
  content: { padding: spacing.md },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  levelCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelNumber: { fontSize: fontSize['4xl'], fontWeight: '900', color: '#fff' },
  levelTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  levelSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  progressText: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.xs },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  statValue: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  achCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.6,
  },
  achCardUnlocked: { opacity: 1, borderColor: colors.success },
  achIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  achIconUnlocked: { backgroundColor: colors.primary + '22' },
  achEmoji: { fontSize: 24 },
  achName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text, marginBottom: 4 },
  achNameLocked: { color: colors.textMuted },
  achDesc: { fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: spacing.sm },
  achUnlockedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  achUnlockedText: { fontSize: fontSize.xs, color: colors.success, fontWeight: '600' },
  achProgressWrap: { gap: 4 },
  achProgressBar: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  achProgressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  achProgressText: { fontSize: 10, color: colors.textMuted },
})
