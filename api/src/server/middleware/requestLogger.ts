import { NextFunction, Request, Response } from 'express'
import logger from '../../logger'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`[METHOD]: ${req.method} - [ENDPOINT]: ${req.path}`)
  next()
}