import { Request, Response } from 'express'
import { globalRanking } from '../mongo/userMethods'

/**
 * Send a response containing the top ten players stored in the database
 * @param req Request
 * @param res Response
 */
export async function getRanking(req: Request, res: Response) {
  const topTen = await globalRanking()
  if (topTen)
    res.status(200).json(JSON.parse(JSON.stringify(topTen)))
  else
    res.status(500).json({ error: true, message: 'Internal server error' })
}