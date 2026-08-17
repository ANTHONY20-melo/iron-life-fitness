import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useAuthStore from '../stores/authStore'
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme'

interface MenuItem {
  icon: string
  label: string
  route?: string
  color?: string
  onPress?: () => void
}

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'IL'

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ])
  }

  const menuItems: MenuItem[] = [
    { icon: 'person-outline', label: 'Editar Perfil', route: 'edit-profile' },
    { icon: 'card-outline', label: 'Meus Pagamentos', route: 'payments' },
    { icon: 'trophy-outline', label: 'Conquistas', route: 'achievements' },
    { icon: 'notifications-outline', label: 'Notificacoes', route: 'notifications' },
    { icon: 'settings-outline', label: 'Configuracoes', route: 'settings' },
  ]

  const handleMenuPress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress()
      return
    }
    if (item.route === 'payments') router.push('/payments')
    else if (item.route === 'achievements') router.push('/achievements')
    else if (item.route === 'notifications') router.push('/notifications')
    else Alert.alert('Em breve', 'Esta funcionalidade estara disponivel em breve.')
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Atleta'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === 'admin' ? 'Admin' : user?.role === 'trainer' ? 'Personal' : 'Atleta'}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color={colors.warning} />
            <Text style={styles.statValue}>{user?.points || 0}</Text>
            <Text style={styles.statLabel}>Pontos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={20} color={colors.primary} />
            <Text style={styles.statValue}>{user?.level || 1}</Text>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={22} color={item.color || colors.textSecondary} />
                <Text style={[styles.menuLabel, item.color && { color: item.color }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Iron Life Fitness v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  content: { padding: spacing.md },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.primaryDark,
  },
  avatarText: {
    fontSize: fontSize['3xl'],
    fontWeight: '800',
    color: '#fff',
  },
  name: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: -spacing.sm,
  },
  statValue: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuLabel: {
    fontSize: fontSize.base,
    color: colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.danger,
    marginBottom: spacing.md,
  },
  logoutText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.danger,
  },
  version: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
})
