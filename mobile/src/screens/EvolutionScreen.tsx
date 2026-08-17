import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg'
import useEvolutionStore from '../stores/evolutionStore'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Measurement } from '../types'

export default function EvolutionScreen() {
  const { measurements, latest, isLoading, fetchMeasurements, addMeasurement } = useEvolutionStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    weight: '',
    height: '',
    bodyFat: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const handleSave = async () => {
    const payload: Partial<Measurement> = {}
    if (form.weight) payload.weight = parseFloat(form.weight)
    if (form.height) payload.height = parseFloat(form.height)
    if (form.bodyFat) payload.bodyFat = parseFloat(form.bodyFat)
    if (form.muscleMass) payload.muscleMass = parseFloat(form.muscleMass)
    if (form.chest) payload.chest = parseFloat(form.chest)
    if (form.waist) payload.waist = parseFloat(form.waist)
    if (form.hips) payload.hips = parseFloat(form.hips)
    if (form.arms) payload.arms = parseFloat(form.arms)
    if (form.thighs) payload.thighs = parseFloat(form.thighs)

    if (!payload.weight && !payload.bodyFat && !payload.muscleMass) {
      Alert.alert('Erro', 'Preencha pelo menos um campo.')
      return
    }

    setSaving(true)
    try {
      await addMeasurement(payload)
      setShowForm(false)
      setForm({ weight: '', height: '', bodyFat: '', muscleMass: '', chest: '', waist: '', hips: '', arms: '', thighs: '' })
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar.')
    } finally {
      setSaving(false)
    }
  }

  const bmi = latest?.weight && latest?.height
    ? (latest.weight / Math.pow(latest.height / 100, 2)).toFixed(1)
    : '--'

  const weightData = [...measurements]
    .filter((m) => m.weight)
    .reverse()
    .slice(-12)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Evolucao</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Current stats */}
        <View style={styles.statsGrid}>
          <StatCard icon="body" label="Peso" value={latest?.weight ? `${latest.weight}kg` : '--'} />
          <StatCard icon="resize" label="Altura" value={latest?.height ? `${latest.height}cm` : '--'} />
          <StatCard icon="fitness" label="IMC" value={bmi} />
          <StatCard icon="water" label="Gordura" value={latest?.bodyFat ? `${latest.bodyFat}%` : '--'} />
          <StatCard icon="body" label="Massa" value={latest?.muscleMass ? `${latest.muscleMass}kg` : '--'} />
          <StatCard icon="analytics" label="Medicoes" value={`${measurements.length}`} />
        </View>

        {/* Weight chart */}
        {weightData.length >= 2 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Evolucao do Peso</Text>
            <WeightChart data={weightData} />
          </View>
        )}

        {/* Measurements history */}
        {measurements.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Historico de Medicoes</Text>
            {measurements.slice(0, 10).map((m) => (
              <View key={m.id} style={styles.historyRow}>
                <View style={styles.historyDate}>
                  <Text style={styles.historyDay}>
                    {new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit' })}
                  </Text>
                  <Text style={styles.historyMonth}>
                    {new Date(m.date).toLocaleDateString('pt-BR', { month: 'short' })}
                  </Text>
                </View>
                <View style={styles.historyValues}>
                  {m.weight ? <Text style={styles.historyVal}>{m.weight}kg</Text> : null}
                  {m.bodyFat ? <Text style={styles.historyVal}>{m.bodyFat}% gord.</Text> : null}
                  {m.muscleMass ? <Text style={styles.historyVal}>{m.muscleMass}kg massa</Text> : null}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Measurement Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Medicao</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <FormField label="Peso (kg)" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} keyboard="decimal-pad" />
              <FormField label="Altura (cm)" value={form.height} onChange={(v) => setForm({ ...form, height: v })} keyboard="decimal-pad" />
              <FormField label="Gordura corporal (%)" value={form.bodyFat} onChange={(v) => setForm({ ...form, bodyFat: v })} keyboard="decimal-pad" />
              <FormField label="Massa muscular (kg)" value={form.muscleMass} onChange={(v) => setForm({ ...form, muscleMass: v })} keyboard="decimal-pad" />

              <Text style={styles.formSection}>Medidas Corporais</Text>
              <FormField label="Peitoral (cm)" value={form.chest} onChange={(v) => setForm({ ...form, chest: v })} keyboard="decimal-pad" />
              <FormField label="Cintura (cm)" value={form.waist} onChange={(v) => setForm({ ...form, waist: v })} keyboard="decimal-pad" />
              <FormField label="Quadril (cm)" value={form.hips} onChange={(v) => setForm({ ...form, hips: v })} keyboard="decimal-pad" />
              <FormField label="Bracos (cm)" value={form.arms} onChange={(v) => setForm({ ...form, arms: v })} keyboard="decimal-pad" />
              <FormField label="Coxas (cm)" value={form.thighs} onChange={(v) => setForm({ ...form, thighs: v })} keyboard="decimal-pad" />
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Salvar Medicao</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={20} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function FormField({
  label,
  value,
  onChange,
  keyboard = 'default',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  keyboard?: any
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        placeholder="0"
        placeholderTextColor={colors.textMuted}
      />
    </View>
  )
}

function WeightChart({ data }: { data: Measurement[] }) {
  const weights = data.map((m) => m.weight!)
  const min = Math.min(...weights) - 2
  const max = Math.max(...weights) + 2
  const range = max - min || 1

  const W = 320
  const H = 150
  const padX = 30
  const padY = 20
  const graphW = W - padX * 2
  const graphH = H - padY * 2

  const points = data.map((m, i) => {
    const x = padX + (i / (data.length - 1)) * graphW
    const y = padY + graphH - ((m.weight! - min) / range) * graphH
    return `${x},${y}`
  }).join(' ')

  const minWeight = weights[weights.length - 1]
  const maxWeight = weights[0]
  const trend = minWeight > maxWeight ? '↓' : minWeight < maxWeight ? '↑' : '→'
  const trendColor = minWeight <= maxWeight ? colors.success : colors.danger

  return (
    <View style={styles.chartWrap}>
      <Text style={[styles.chartTrend, { color: trendColor }]}>
        {trend} {Math.abs(minWeight - maxWeight).toFixed(1)}kg
      </Text>
      <Svg width={W} height={H}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padY + graphH * (1 - pct)
          const val = (min + range * pct).toFixed(0)
          return (
            <React.Fragment key={pct}>
              <Line x1={padX} y1={y} x2={W - padX} y2={y} stroke={colors.border} strokeWidth={0.5} />
              <SvgText x={4} y={y + 4} fontSize={10} fill={colors.textMuted}>{val}</SvgText>
            </React.Fragment>
          )
        })}
        {/* Line */}
        <Polyline points={points} fill="none" stroke={colors.primary} strokeWidth={2} />
        {/* Dots */}
        {data.map((m, i) => {
          const x = padX + (i / (data.length - 1)) * graphW
          const y = padY + graphH - ((m.weight! - min) / range) * graphH
          return <Circle key={i} cx={x} cy={y} r={4} fill={colors.primary} />
        })}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerBar: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  headerTitle: { fontSize: fontSize['2xl'], fontWeight: '800', color: colors.text },
  container: { flex: 1 },
  content: { padding: spacing.md },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
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
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chartWrap: { alignItems: 'center' },
  chartTrend: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyDate: {
    width: 48,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  historyDay: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  historyMonth: { fontSize: fontSize.xs, color: colors.textMuted, textTransform: 'uppercase' },
  historyValues: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  historyVal: { fontSize: fontSize.sm, color: colors.textSecondary },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  modalForm: { padding: spacing.md },
  formSection: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  fieldWrap: { marginBottom: spacing.md },
  fieldLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  fieldInput: {
    height: 48,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.base,
    color: colors.text,
  },
  saveBtn: {
    marginHorizontal: spacing.md,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: fontSize.base, fontWeight: '700', color: '#fff' },
})
