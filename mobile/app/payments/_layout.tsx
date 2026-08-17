import React from 'react'
import { Stack } from 'expo-router'
import { colors } from '../src/constants/theme'

export default function PaymentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  )
}
