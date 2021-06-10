import { Request, Response } from 'express'

export function notFoundCatcher(_req: Request, res: Response): void {
  res.status(404).json({ error: true, message: 'Error 404: Resource not found' })
}