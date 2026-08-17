import { Router } from 'express'
import { TrainerController } from '../controllers/trainer.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new TrainerController()

router.get('/', auth, authorize('ADMIN'), controller.getAll)
router.get('/:id', auth, authorize('ADMIN'), controller.getById)
router.post('/', auth, authorize('ADMIN'), controller.create)
router.put('/:id', auth, authorize('ADMIN'), controller.update)
router.delete('/:id', auth, authorize('ADMIN'), controller.delete)

export default router
