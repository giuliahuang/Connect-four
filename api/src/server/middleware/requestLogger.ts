import { NextFunction, Request, Response } from 'express'
import logger from '../../logger'

/**
 * Middleware that logs all requests
 * @param req Request
 * @param _res Response
 * @param next Next
 */
export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  logger.info(`[METHOD]: ${req.method} - [ENDPOINT]: ${req.path}`)
  next()
}