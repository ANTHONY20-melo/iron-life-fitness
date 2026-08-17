import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useAuthStore from '../stores/authStore'
import { colors, spacing, fontSize, borderRadius } from '../constants/theme'

export default function RegisterScreen() {
  const router = useRouter()
  const { register } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const formatCpf = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !cpf.trim() || !phone.trim() || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas nao conferem.')
      return
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        cpf: cpf.replace(/\D/g, ''),
        phone: phone.replace(/\D/g, ''),
        password,
      })
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar conta.'
      Alert.alert('Erro', msg)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Nome completo', value: name, onChange: setName, icon: 'person-outline' as const, autoCapitalize: 'words' as const },
    { label: 'E-mail', value: email, onChange: setEmail, icon: 'mail-outline' as const, keyboardType: 'email-address' as const, autoCapitalize: 'none' as const },
    { label: 'CPF', value: cpf, onChange: (t: string) => setCpf(formatCpf(t)), icon: 'card-outline' as const, keyboardType: 'numeric' as const },
    { label: 'Telefone', value: phone, onChange: (t: string) => setPhone(formatPhone(t)), icon: 'call-outline' as const, keyboardType: 'numeric' as const },
  ]

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Comece sua jornada fitness</Text>
        </View>

        <View style={styles.form}>
          {fields.map((f) => (
            <View key={f.label}>
              <Text style={styles.label}>{f.label}</Text>
              <View style={styles.inputWrap}>
                <Ionicons name={f.icon} size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={f.label}
                  placeholderTextColor={colors.textMuted}
                  value={f.value}
                  onChangeText={f.onChange}
                  keyboardType={f.keyboardType}
                  autoCapitalize={f.autoCapitalize}
                />
              </View>
            </View>
          ))}

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Minimo 6 caracteres"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Repita a senha"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerBtnText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Ja tem conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.base,
    color: colors.text,
  },
  eyeBtn: {
    paddingHorizontal: spacing.md,
  },
  registerBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerBtnDisabled: {
    opacity: 0.6,
  },
  registerBtnText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#fff',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  loginText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.primary,
  },
})
