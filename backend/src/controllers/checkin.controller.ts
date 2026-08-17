import { Request, Response, NextFunction } from 'express'
import { CheckInService } from '../services/checkin.service'
import { param } from '../utils/param'

export class CheckInController {
  private service = new CheckInService()

  checkIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, unitId, method } = req.body
      const result = await this.service.checkIn(studentId, unitId, method)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  checkInByQR = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { qrCode, unitId } = req.body
      const result = await this.service.getByQRCode(qrCode, unitId)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = param(req, 'studentId') || req.user!.id
      const result = await this.service.getHistory(studentId, req.query as Record<string, string>)
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = param(req, 'studentId') || req.user!.id
      const result = await this.service.getStats(studentId)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll(req.query as Record<string, string>)
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
