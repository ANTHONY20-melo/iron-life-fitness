import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/environment'
import { UnauthorizedError } from '../utils/errors'
import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function auth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, env.jwtSecret) as AuthUser

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'))
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'))
    } else {
      next(error)
    }
  }
}
