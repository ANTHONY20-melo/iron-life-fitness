import { Router } from 'express'
import { StudentController } from '../controllers/student.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import { createStudentSchema, updateStudentSchema } from '../validators/student'

const router = Router()
const controller = new StudentController()

router.get('/profile', auth, authorize('STUDENT'), controller.getProfile)
router.get('/', auth, authorize('ADMIN', 'TRAINER'), controller.getAll)
router.get('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.getById)
router.post('/', auth, authorize('ADMIN'), validate(createStudentSchema), controller.create)
router.put('/:id', auth, authorize('ADMIN'), validate(updateStudentSchema), controller.update)
router.delete('/:id', auth, authorize('ADMIN'), controller.delete)
router.put('/:id/body-stats', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.updateBodyStats)

export default router
