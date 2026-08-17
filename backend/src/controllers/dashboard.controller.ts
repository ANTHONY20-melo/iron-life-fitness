import { Request, Response, NextFunction } from 'express'
import { DashboardService } from '../services/dashboard.service'
import { param } from '../utils/param'

export class DashboardController {
  private service = new DashboardService()

  getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getStats()
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getStudentDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = param(req, 'studentId') || req.user!.id
      const result = await this.service.getStudentDashboard(studentId)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}
