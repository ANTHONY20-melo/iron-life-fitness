import { Router } from 'express'
import { PlanController } from '../controllers/plan.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new PlanController()

router.get('/', auth, controller.getAll)
router.get('/:id', auth, controller.getById)
router.post('/', auth, authorize('ADMIN'), controller.create)
router.put('/:id', auth, authorize('ADMIN'), controller.update)
router.delete('/:id', auth, authorize('ADMIN'), controller.delete)

export default router
