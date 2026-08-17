import { Request, Response, NextFunction } from 'express'
import { PaymentService } from '../services/payment.service'
import prisma from '../config/database'
import { NotFoundError } from '../utils/errors'
import { param } from '../utils/param'

export class PaymentController {
  private service = new PaymentService()

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body)
      res.status(201).json({ success: true, data: result })
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

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: param(req, 'id') },
        include: {
          subscription: {
            include: {
              student: { select: { id: true, fullName: true } },
              plan: true,
            },
          },
        },
      })
      if (!payment) throw new NotFoundError('Payment')
      res.json({ success: true, data: payment })
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

  markPaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.markPaid(param(req, 'id'), req.body.method)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  getOverdue = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getOverdue()
      res.json({ success: true, data: result })
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
}
