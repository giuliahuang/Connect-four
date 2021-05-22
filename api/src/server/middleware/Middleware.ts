import { Request, Response, NextFunction } from 'express'

export interface Middleware {
  <T>(req: Request & T, res: Response, next: NextFunction): void
}