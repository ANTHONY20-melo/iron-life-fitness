import { Request, Response, NextFunction } from 'express'
import { WorkoutService } from '../services/workout.service'
import { param } from '../utils/param'

export class ExerciseController {
  private service = new WorkoutService()

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getExercises(req.query as Record<string, string>)
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getExerciseById(param(req, 'id'))
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createExercise(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.updateExercise(param(req, 'id'), req.body)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.deleteExercise(param(req, 'id'))
      res.json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  }
}
