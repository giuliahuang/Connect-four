import { Request, Response } from 'express'

/**
 * Middleware that handles all 404 errors
 * @param _req Request
 * @param res Response
 */
export function notFoundCatcher(_req: Request, res: Response): void {
  res.status(404).json({ error: true, message: 'Error 404: Resource not found' })
}