import { NextFunction, Request, Response } from 'express'
import logger from '../../logger'

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  logger.info(`[METHOD]: ${req.method} - [ENDPOINT]: ${req.path}`)
  next()
}