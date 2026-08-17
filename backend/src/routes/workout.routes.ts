import { Router } from 'express'
import { WorkoutController } from '../controllers/workout.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'
import { validate } from '../middlewares/validate'
import { createWorkoutSchema, updateWorkoutSchema } from '../validators/workout'

const router = Router()
const controller = new WorkoutController()

router.get('/', auth, authorize('ADMIN', 'TRAINER'), controller.getAll)
router.get('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.getById)
router.post('/', auth, authorize('ADMIN', 'TRAINER'), validate(createWorkoutSchema), controller.create)
router.put('/:id', auth, authorize('ADMIN', 'TRAINER'), validate(updateWorkoutSchema), controller.update)
router.delete('/:id', auth, authorize('ADMIN', 'TRAINER'), controller.delete)

router.post('/:id/assign/:studentId', auth, authorize('ADMIN', 'TRAINER'), controller.assignToStudent)
router.get('/student/:studentId', auth, authorize('ADMIN', 'TRAINER', 'STUDENT'), controller.getStudentWorkouts)

router.post('/assignments/:assignmentId/sessions', auth, authorize('STUDENT', 'TRAINER'), controller.createSession)
router.post('/sessions/:sessionId/complete-exercise/:exerciseId', auth, authorize('STUDENT'), controller.completeExercise)
router.post('/sessions/:sessionId/complete', auth, authorize('STUDENT'), controller.completeSession)

export default router
