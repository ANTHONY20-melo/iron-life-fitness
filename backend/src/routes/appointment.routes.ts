import { Router } from 'express'
import { AppointmentController } from '../controllers/appointment.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new AppointmentController()

router.get('/', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.getAll)
router.get('/:id', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.getById)
router.post('/', auth, authorize('ADMIN', 'TRAINER'), controller.create)
router.put('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.update)
router.delete('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.delete)

export default router
