import { Request, Response } from 'express'
import { userStats } from '../mongo/user'
import extractTokenPayload from "../utils/extractTokenPayload"

export async function getUserStats(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const stats = await userStats(token.sub)
    if (stats) res.status(200).json(JSON.parse(stats))
  }
  res.status(500).json({ error: true, message: 'Internal server error' })
}