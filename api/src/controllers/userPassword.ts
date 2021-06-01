import { Request, Response } from 'express'
import logger from '../logger'
import { setPassword } from '../mongo/userMethods'

export async function newPassword(req: Request, res: Response) {
  try {
    await setPassword(req.body.email, req.body.password)
    res.status(200).json({ message: 'Password set correctly' })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: true, message: 'Internal server error' })
  }
}