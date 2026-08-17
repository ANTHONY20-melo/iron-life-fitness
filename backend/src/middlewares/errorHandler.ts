import { Request, Response, NextFunction } from 'express'
import { AppError, ValidationError } from '../utils/errors'
import { Prisma } from '@prisma/client'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = handlePrismaError(err)
    res.status(prismaError.statusCode).json({
      success: false,
      message: prismaError.message,
    })
    return
  }

  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
}

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): { statusCode: number; message: string } {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[]) || ['field']
      return { statusCode: 409, message: `Unique constraint failed on: ${target.join(', ')}` }
    }
    case 'P2025':
      return { statusCode: 404, message: 'Record not found' }
    case 'P2003':
      return { statusCode: 400, message: 'Foreign key constraint failed' }
    case 'P2014':
      return { statusCode: 400, message: 'Required relation violation' }
    default:
      return { statusCode: 400, message: `Database error: ${err.code}` }
  }
}
