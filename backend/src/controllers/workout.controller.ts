import { Request, Response, NextFunction } from 'express'
import { WorkoutService } from '../services/workout.service'
import { param } from '../utils/param'

export class WorkoutController {
  private service = new WorkoutService()

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

  assignToStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.assignToStudent(param(req, 'id'), param(req, 'studentId'), req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getStudentWorkouts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getStudentWorkouts(param(req, 'studentId'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  createSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createSession(param(req, 'assignmentId'))
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  completeExercise = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.completeExercise(param(req, 'sessionId'), param(req, 'exerciseId'), req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  completeSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.completeSession(param(req, 'sessionId'), req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}
