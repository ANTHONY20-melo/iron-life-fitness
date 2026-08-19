import { useState, useEffect, useCallback } from 'react'
import { WORKOUTS } from '@/data/workoutData'

const NOTIFICATION_KEY = 'ironlife_notifications_enabled'
const DAILY_HOUR = 7 // Horário da notificação diária (7h da manhã)

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem(NOTIFICATION_KEY) === 'true'
  })

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === 'granted') {
      setEnabled(true)
      localStorage.setItem(NOTIFICATION_KEY, 'true')
      scheduleDailyReminder()
      return true
    }

    return false
  }, [])

  const disable = useCallback(() => {
    setEnabled(false)
    localStorage.removeItem(NOTIFICATION_KEY)
  }, [])

  const scheduleDailyReminder = useCallback(() => {
    if (!enabled || permission !== 'granted') return

    // Calcula quanto tempo falta para as DAILY_HOUR
    const now = new Date()
    const target = new Date()
    target.setHours(DAILY_HOUR, 0, 0, 0)

    // Se já passou das DAILY_HOUR, agenda para amanhã
    if (now >= target) {
      target.setDate(target.getDate() + 1)
    }

    const delay = target.getTime() - now.getTime()

    const timer = setTimeout(() => {
      sendWorkoutReminder()
      // Reagenda para o dia seguinte
      scheduleDailyReminder()
    }, delay)

    return () => clearTimeout(timer)
  }, [enabled, permission])

  const sendWorkoutReminder = useCallback(() => {
    if (permission !== 'granted') return

    const today = new Date().getDay()
    // Mapeia dia da semana para treino
    const dayMap: Record<number, typeof WORKOUTS[0]> = {
      1: WORKOUTS[0], // Segunda - Treino A
      2: WORKOUTS[1], // Terça - Treino B
      3: WORKOUTS[2], // Quarta - Treino C
      4: WORKOUTS[3], // Quinta - Treino D
      5: WORKOUTS[4], // Sexta - Treino E
    }

    const workout = dayMap[today]
    const title = workout
      ? `Hora de treinar! ${workout.name}`
      : 'Hora de treinar! 💪'
    const body = workout
      ? `${workout.description} — ${workout.exercises.length} exercícios`
      : 'Não esqueça do seu treino de hoje!'

    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'ironlife-daily-workout',
      requireInteraction: true,
    })
  }, [permission])

  // Envia lembrete imediato (para teste)
  const sendTestNotification = useCallback(() => {
    if (permission !== 'granted') {
      requestPermission()
      return
    }
    sendWorkoutReminder()
  }, [permission, requestPermission, sendWorkoutReminder])

  useEffect(() => {
    if (enabled && permission === 'granted') {
      scheduleDailyReminder()
    }
  }, [enabled, permission, scheduleDailyReminder])

  return {
    permission,
    enabled,
    requestPermission,
    disable,
    sendTestNotification,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
  }
}
