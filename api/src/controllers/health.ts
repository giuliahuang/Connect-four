import { Request, Response } from 'express'

/**
 * API health check function, used to verify the running state of the server
 * @param req Request
 * @param res Response
 */
export function healthCheck(_req: Request, res: Response): void {
  res.status(200).json({ message: 'API is up and running' })
}
