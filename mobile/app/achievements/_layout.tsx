import React from 'react'
import { Stack } from 'expo-router'
import { colors } from '../src/constants/theme'
import AchievementsScreen from '../src/screens/AchievementsScreen'

export default function AchievementsRoute() {
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
