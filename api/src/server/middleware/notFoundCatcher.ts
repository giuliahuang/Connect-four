import { Request, Response } from 'express'

export function notFoundCatcher(req: Request, res: Response) {
  res.status(404).json({ error: true, message: 'Error 404: Resource not found' })
}