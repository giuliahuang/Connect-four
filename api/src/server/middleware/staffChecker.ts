import { Request, Response, NextFunction } from "express"
import User from "../../models/User"

export default function staffChecker(req: Request, res: Response, next: NextFunction): void {
  const user: User = req.body['user']
  if (user.roles.includes('ADMIN') || user.roles.includes('MODERATOR')) next()
  else res.status(401).json({ error: true, message: 'Unauthorized' })
}