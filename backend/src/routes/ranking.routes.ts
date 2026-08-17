import { Router } from 'express'
import { RankingController } from '../controllers/ranking.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new RankingController()

router.get('/leaderboard', auth, controller.getLeaderboard)
router.get('/student/:studentId', auth, controller.getStudentRank)
router.post('/update', auth, authorize('ADMIN'), controller.updateRanking)

export default router
