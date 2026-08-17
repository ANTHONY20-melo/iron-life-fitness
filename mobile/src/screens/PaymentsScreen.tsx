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
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Payment } from '../types'

export default function PaymentsScreen() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const { data } = await api.get<Payment[]>('/payments')
      setPayments(data)
    } catch {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = payments.find((p) => p.status === 'pending')
  const paidPayments = payments.filter((p) => p.status === 'paid')
  const overduePayments = payments.filter((p) => p.status === 'overdue')

  const formatCurrency = (v: number) =>
    `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    paid: { label: 'Pago', color: colors.success, bg: colors.success + '22' },
    pending: { label: 'Pendente', color: colors.warning, bg: colors.warning + '22' },
    overdue: { label: 'Atrasado', color: colors.danger, bg: colors.danger + '22' },
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Pagamentos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Current plan */}
        {currentPlan ? (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="card" size={24} color={colors.primary} />
              <Text style={styles.planTitle}>Plano Atual</Text>
            </View>
            <Text style={styles.planName}>{currentPlan.plan}</Text>
            <Text style={styles.planAmount}>{formatCurrency(currentPlan.amount)}</Text>
            <View style={styles.planDetails}>
              <View style={styles.planDetail}>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.planDetailText}>Vencimento: {formatDate(currentPlan.dueDate)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig[currentPlan.status]?.bg }]}>
                <Text style={[styles.statusText, { color: statusConfig[currentPlan.status]?.color }]}>
                  {statusConfig[currentPlan.status]?.label}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Ionicons name="card-outline" size={24} color={colors.textMuted} />
              <Text style={styles.planTitle}>Plano</Text>
            </View>
            <Text style={styles.emptyPlanText}>Nenhum plano ativo</Text>
          </View>
        )}

        {/* Pay button */}
        {(currentPlan || overduePayments.length > 0) && (
          <TouchableOpacity style={styles.payBtn}>
            <Ionicons name="wallet-outline" size={20} color="#fff" />
            <Text style={styles.payBtnText}>Pagar Agora</Text>
          </TouchableOpacity>
        )}

        {/* History */}
        <Text style={styles.sectionTitle}>Historico de Pagamentos</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : payments.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum pagamento registrado</Text>
          </View>
        ) : (
          payments.map((p) => {
            const status = statusConfig[p.status] || statusConfig.pending
            return (
              <View key={p.id} style={styles.paymentRow}>
                <View style={styles.paymentLeft}>
                  <Ionicons
                    name={p.status === 'paid' ? 'checkmark-circle' : p.status === 'overdue' ? 'alert-circle' : 'time'}
                    size={20}
                    color={status.color}
                  />
                  <View>
                    <Text style={styles.paymentPlan}>{p.plan}</Text>
                    <Text style={styles.paymentDate}>{formatDate(p.date)}</Text>
                  </View>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{formatCurrency(p.amount)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
              </View>
            )
          })
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
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.md,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  planTitle: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600' },
  planName: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  planAmount: {
    fontSize: fontSize['3xl'],
    fontWeight: '900',
    color: colors.primary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  planDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planDetailText: { fontSize: fontSize.sm, color: colors.textSecondary },
  emptyPlanText: { fontSize: fontSize.base, color: colors.textMuted },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  payBtnText: { fontSize: fontSize.base, fontWeight: '700', color: '#fff' },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyText: { fontSize: fontSize.sm, color: colors.textMuted },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  paymentPlan: { fontSize: fontSize.base, fontWeight: '600', color: colors.text },
  paymentDate: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  paymentRight: { alignItems: 'flex-end', gap: 4 },
  paymentAmount: { fontSize: fontSize.base, fontWeight: '700', color: colors.text },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
})
