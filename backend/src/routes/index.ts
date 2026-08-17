import { Router } from 'express'
import authRoutes from './auth.routes'
import studentRoutes from './student.routes'
import trainerRoutes from './trainer.routes'
import workoutRoutes from './workout.routes'
import exerciseRoutes from './exercise.routes'
import evaluationRoutes from './evaluation.routes'
import checkinRoutes from './checkin.routes'
import paymentRoutes from './payment.routes'
import appointmentRoutes from './appointment.routes'
import notificationRoutes from './notification.routes'
import achievementRoutes from './achievement.routes'
import rankingRoutes from './ranking.routes'
import dashboardRoutes from './dashboard.routes'
import planRoutes from './plan.routes'
import unitRoutes from './unit.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/students', studentRoutes)
router.use('/trainers', trainerRoutes)
router.use('/workouts', workoutRoutes)
router.use('/exercises', exerciseRoutes)
router.use('/evaluations', evaluationRoutes)
router.use('/checkins', checkinRoutes)
router.use('/payments', paymentRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/notifications', notificationRoutes)
router.use('/achievements', achievementRoutes)
router.use('/rankings', rankingRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/plans', planRoutes)
router.use('/units', unitRoutes)

export default router
