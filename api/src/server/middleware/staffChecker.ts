import { Request, Response, NextFunction } from "express"
import User from "../../models/User"

/**
 * This middleware checks whether the user is a member of the staff, if they aren't a 401 is sent instead
 * of calling the next middleware down the chain
 * @param req Request
 * @param res Response
 * @param next Next
 */
export default function staffChecker(req: Request, res: Response, next: NextFunction): void {
  const user: User = req.body['user']
  if (user.roles.includes('ADMIN') || user.roles.includes('MODERATOR')) next()
  else res.status(401).json({ error: true, message: 'Unauthorized' })
}