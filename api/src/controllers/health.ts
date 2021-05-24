import { Request, Response } from 'express'

export function healthCheck(req: Request, res: Response) {
  return res.status(200).json({ message: 'API is up and running' })
}
