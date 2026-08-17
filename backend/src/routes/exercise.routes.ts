import { Router } from 'express'
import { ExerciseController } from '../controllers/exercise.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new ExerciseController()

router.get('/', auth, controller.getAll)
router.get('/:id', auth, controller.getById)
router.post('/', auth, authorize('ADMIN', 'TRAINER'), controller.create)
router.put('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.update)
router.delete('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.delete)

export default router
