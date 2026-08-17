import { Router } from 'express'
import { AchievementController } from '../controllers/achievement.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new AchievementController()

router.get('/', auth, controller.getAll)
router.get('/leaderboard', auth, controller.getLeaderboard)
router.get('/:id', auth, controller.getById)
router.get('/student/:studentId', auth, controller.getByStudent)
router.get('/unlock/:studentId', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.checkAndUnlock)

export default router
