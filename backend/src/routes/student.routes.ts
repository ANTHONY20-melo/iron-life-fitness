import { Router } from 'express'
import { StudentController } from '../controllers/student.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import { createStudentSchema, updateStudentSchema, updateBodyStatsSchema } from '../validators/student'

const router = Router()
const controller = new StudentController()

router.get('/profile', auth, authorize('STUDENT'), controller.getProfile)
router.put('/profile', auth, authorize('STUDENT'), controller.updateMyProfile)
router.post('/profile/body-stats', auth, authorize('STUDENT'), validate(updateBodyStatsSchema), controller.updateMyBodyStats)

// Medical exams
router.get('/profile/exams', auth, authorize('STUDENT'), controller.getMyExams)
router.post('/profile/exams', auth, authorize('STUDENT'), controller.uploadMyExam)
router.delete('/profile/exams/:examId', auth, authorize('STUDENT'), controller.deleteMyExam)

router.get('/', auth, authorize('ADMIN', 'TRAINER'), controller.getAll)
router.get('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.getById)
router.post('/', auth, authorize('ADMIN'), validate(createStudentSchema), controller.create)
router.put('/:id', auth, authorize('ADMIN'), validate(updateStudentSchema), controller.update)
router.delete('/:id', auth, authorize('ADMIN'), controller.delete)
router.put('/:id/body-stats', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.updateBodyStats)

export default router
