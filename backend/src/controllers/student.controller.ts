import { Request, Response, NextFunction } from 'express'
import { StudentService } from '../services/student.service'
import { param } from '../utils/param'

export class StudentController {
  private service = new StudentService()

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAll(req.query as Record<string, string>)
      res.json({ success: true, ...result })
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

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(param(req, 'id'), req.body)
      res.json({ success: true, data: result })
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

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getProfile(req.user!.id)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  updateBodyStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.updateBodyStats(param(req, 'id'), req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}
