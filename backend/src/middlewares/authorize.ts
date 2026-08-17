import { Request, Response, NextFunction } from 'express'
import { UserRole } from '@prisma/client'
import { ForbiddenError } from '../utils/errors'

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required'))
      return
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError(`Role ${req.user.role} is not authorized for this resource`))
      return
    }

    next()
  }
}
