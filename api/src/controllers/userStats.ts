import { Request, Response } from 'express'
import { userStats } from '../mongo/userMethods'
import extractTokenPayload from "../utils/extractTokenPayload"

/**
 * Sends a response contaning the user's game stats
 * @param req 
 * @param res 
 */
export async function getUserStats(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const stats = await userStats(token.sub)
    if (stats) res.status(200).json(JSON.parse(stats))
    else res.status(500).json({ error: true, message: 'An error has occurred' })
  } else
    res.status(401).json({ error: true, message: 'Unauthorized' })
}