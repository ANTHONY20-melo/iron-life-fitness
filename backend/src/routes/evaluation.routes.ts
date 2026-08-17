import { Router } from 'express'
import { EvaluationController } from '../controllers/evaluation.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new EvaluationController()

router.get('/student/:studentId', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.getByStudent)
router.get('/student/:studentId/latest', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.getLatest)
router.get('/student/:studentId/compare', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.compare)
router.get('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.getById)
router.post('/', auth, authorize('ADMIN', 'TRAINER'), controller.create)

export default router
