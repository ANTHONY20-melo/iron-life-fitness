import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'

export class AuthController {
  private service = new AuthService()

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.register(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.refreshToken(req.body.token)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.logout(req.body.token)
      res.json({ success: true, message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}
