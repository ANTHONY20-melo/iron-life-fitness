import { Request, Response, NextFunction } from 'express'
import { RankingService } from '../services/ranking.service'
import { param } from '../utils/param'

export class RankingController {
  private service = new RankingService()

  updateRanking = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.updateRanking()
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined
      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined
      const result = await this.service.getLeaderboard(month, year)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getStudentRank = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined
      const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined
      const result = await this.service.getStudentRank(param(req, 'studentId'), month, year)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}
