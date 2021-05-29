import { Request, Response } from 'express'
import { globalRanking } from '../mongo/user'

export async function getRanking(req: Request, res: Response) {
  const topTen = await globalRanking()
  if (topTen)
    res.status(200).json(JSON.parse(JSON.stringify(topTen)))
  else
    res.status(500).json({ error: true, message: 'Internal server error' })
}