import { Router } from 'express'
import { CheckInController } from '../controllers/checkin.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new CheckInController()

router.post('/', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.checkIn)
router.post('/qr', auth, authorize('ADMIN', 'TRAINER'), controller.checkInByQR)
router.get('/history', auth, authorize('STUDENT'), controller.getHistory)
router.get('/stats', auth, authorize('STUDENT'), controller.getStats)
router.get('/student/:studentId/history', auth, authorize('ADMIN', 'TRAINER'), controller.getHistory)
router.get('/student/:studentId/stats', auth, authorize('ADMIN', 'TRAINER'), controller.getStats)
router.get('/', auth, authorize('ADMIN', 'TRAINER'), controller.getAll)

export default router
