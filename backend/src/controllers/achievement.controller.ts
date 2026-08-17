import { Request, Response, NextFunction } from 'express'
import { AchievementService } from '../services/achievement.service'
import { param } from '../utils/param'

export class AchievementController {
  private service = new AchievementService()

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll()
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getById(param(req, 'id'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getByStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getByStudent(param(req, 'studentId'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  checkAndUnlock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.checkAndUnlock(param(req, 'studentId'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getLeaderboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getLeaderboard()
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}
