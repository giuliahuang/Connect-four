import { Logger } from 'tslog'
import { Request, Response, NextFunction } from 'express'

const logger = new Logger()

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`[METHOD]: ${req.method} - [ENDPOINT]: ${req.path}`)
  next()
}