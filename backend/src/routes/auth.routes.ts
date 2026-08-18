import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { auth } from '../middlewares/auth'
import { validate } from '../middlewares/validate'
import { loginSchema, registerSchema, registerAdminSchema, refreshTokenSchema } from '../validators/auth'

const router = Router()
const controller = new AuthController()

router.post('/login', validate(loginSchema), controller.login)
router.post('/register', validate(registerSchema), controller.register)
router.post('/register-admin', validate(registerAdminSchema), controller.registerAdmin)
router.post('/refresh', validate(refreshTokenSchema), controller.refresh)
router.post('/logout', auth, controller.logout)

export default router
