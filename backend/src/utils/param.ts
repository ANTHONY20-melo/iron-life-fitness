import { Request } from 'express'

/** Safely extract a string param from Express 5 where params can be string | string[] */
export function param(req: Request, name: string): string {
  const val = req.params[name]
  return Array.isArray(val) ? val[0] : val
}
