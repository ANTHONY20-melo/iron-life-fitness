import { Request, Response, NextFunction } from 'express'
import { NotificationService } from '../services/notification.service'
import { param } from '../utils/param'

export class NotificationController {
  private service = new NotificationService()

  getByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getByUser(req.user!.id, req.query as Record<string, string>)
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.markAsRead(param(req, 'id'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.markAllAsRead(req.user!.id)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getUnreadCount(req.user!.id)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, title, message, type, data } = req.body
      const result = await this.service.create(userId, title, message, type, data)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.delete(param(req, 'id'))
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
