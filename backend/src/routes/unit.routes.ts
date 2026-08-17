import { Router } from 'express'
import { UnitController } from '../controllers/unit.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new UnitController()

router.get('/', auth, controller.getAll)
router.get('/:id', auth, controller.getById)
router.post('/', auth, authorize('ADMIN'), controller.create)
router.put('/:id', auth, authorize('ADMIN'), controller.update)
router.delete('/:id', auth, authorize('ADMIN'), controller.delete)

export default router
