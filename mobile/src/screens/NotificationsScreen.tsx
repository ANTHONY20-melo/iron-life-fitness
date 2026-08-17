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
import api from '../services/api'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'
import type { Notification } from '../types'

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  info: { icon: 'information-circle', color: colors.info },
  warning: { icon: 'warning', color: colors.warning },
  success: { icon: 'checkmark-circle', color: colors.success },
  achievement: { icon: 'trophy', color: colors.warning },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export default function NotificationsScreen() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const { data } = await api.get<Notification[]>('/notifications')
      setNotifications(data)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadNotifications()
    setRefreshing(false)
  }

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    try {
      await api.post(`/notifications/${id}/read`)
    } catch {
      // silent
    }
  }

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await api.post('/notifications/read-all')
    } catch {
      // silent
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const renderNotification = ({ item }: { item: Notification }) => {
    const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.info
    return (
      <TouchableOpacity
        style={[styles.notifCard, !item.read && styles.notifCardUnread]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.notifIcon, { backgroundColor: config.color + '22' }]}>
          <Ionicons name={config.icon as any} size={22} color={config.color} />
        </View>
        <View style={styles.notifBody}>
          <View style={styles.notifHeader}>
            <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.notifTime}>{timeAgo(item.createdAt)}</Text>
          </View>
          <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Notificacoes</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Marcar lidas</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="notifications-off-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Sem notificacoes</Text>
          <Text style={styles.emptySub}>Quando voce receber algo, aparecera aqui</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          ListHeaderComponent={
            unreadCount > 0 ? (
              <Text style={styles.unreadLabel}>{unreadCount} nao lida{unreadCount > 1 ? 's' : ''}</Text>
            ) : null
          }
        />
      )}
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
  markAllBtn: { width: 80, alignItems: 'flex-end' },
  markAllText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '600' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textSecondary, marginTop: spacing.sm },
  emptySub: { fontSize: fontSize.sm, color: colors.textMuted },
  list: {
    padding: spacing.md,
  },
  unreadLabel: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifCardUnread: {
    borderColor: colors.primary + '44',
    backgroundColor: colors.surfaceLight,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  notifBody: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, flex: 1 },
  notifTitleUnread: { fontWeight: '800' },
  notifTime: { fontSize: fontSize.xs, color: colors.textMuted, marginLeft: spacing.sm },
  notifMessage: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
})
