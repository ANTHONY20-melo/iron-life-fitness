import { Request, Response, NextFunction } from 'express'
import { EvaluationService } from '../services/evaluation.service'
import { param } from '../utils/param'

export class EvaluationController {
  private service = new EvaluationService()

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body)
      res.status(201).json({ success: true, data: result })
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

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getById(param(req, 'id'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getLatest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getLatest(param(req, 'studentId'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  compare = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.compare(param(req, 'studentId'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}
