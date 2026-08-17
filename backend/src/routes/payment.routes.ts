import { Router } from 'express'
import { PaymentController } from '../controllers/payment.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new PaymentController()

router.get('/overdue', auth, authorize('ADMIN'), controller.getOverdue)
router.get('/', auth, authorize('ADMIN', 'TRAINER'), controller.getAll)
router.get('/student/:studentId', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.getByStudent)
router.get('/:id', auth, authorize('ADMIN'), controller.getById)
router.post('/', auth, authorize('ADMIN'), controller.create)
router.put('/:id/mark-paid', auth, authorize('ADMIN'), controller.markPaid)
router.put('/:id', auth, authorize('ADMIN'), controller.update)
router.delete('/:id', auth, authorize('ADMIN'), controller.delete)

export default router
