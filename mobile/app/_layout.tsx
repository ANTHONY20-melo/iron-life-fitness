import React, { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import useAuthStore from '../stores/authStore'
import { colors } from '../constants/theme'

function AuthGate() {
  const { isAuthenticated, isLoading, loadFromStorage } = useAuthStore()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [isAuthenticated, isLoading, segments])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <AuthGate />
    </>
  )
}
