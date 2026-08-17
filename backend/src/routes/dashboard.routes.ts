import { Router } from 'express'
import { DashboardController } from '../controllers/dashboard.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new DashboardController()

router.get('/stats', auth, authorize('ADMIN'), controller.getStats)
router.get('/student', auth, authorize('STUDENT'), controller.getStudentDashboard)
router.get('/student/:studentId', auth, authorize('ADMIN', 'TRAINER'), controller.getStudentDashboard)

export default router
