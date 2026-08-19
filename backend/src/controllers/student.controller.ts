import { Request, Response, NextFunction } from 'express'
import { StudentService } from '../services/student.service'
import { param } from '../utils/param'

const service = new StudentService()

export class StudentController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getAll(req.query as Record<string, string>)
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getById(param(req, 'id'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.create(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.update(param(req, 'id'), req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.delete(param(req, 'id'))
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getProfile(req.user!.id)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.updateMyProfile(req.user!.id, req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  updateMyBodyStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.updateMyBodyStats(req.user!.id, req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  updateBodyStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.updateBodyStats(param(req, 'id'), req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  // Medical exams
  getMyExams = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.getMyExams(req.user!.id)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  uploadMyExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.uploadMyExam(req.user!.id, req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  deleteMyExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.deleteMyExam(req.user!.id, param(req, 'examId'))
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
