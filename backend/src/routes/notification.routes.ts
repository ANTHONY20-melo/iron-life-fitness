import { Router } from 'express'
import { NotificationController } from '../controllers/notification.controller'
import { auth } from '../middlewares/auth'
import { authorize } from '../middlewares/authorize'

const router = Router()
const controller = new NotificationController()

router.get('/unread-count', auth, controller.getUnreadCount)
router.get('/', auth, controller.getByUser)
router.post('/:id/read', auth, controller.markAsRead)
router.post('/read-all', auth, controller.markAllAsRead)
router.post('/', auth, authorize('ADMIN'), controller.create)
router.delete('/:id', auth, authorize('ADMIN'), controller.delete)

export default router
