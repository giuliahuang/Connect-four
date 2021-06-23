import { Request, Response } from 'express'
import { getUserByUsername } from '../mongo/userMethods'

/**
 * Searches for the user through the property username set into
 * the request's body. It assumes that the username is typed
 * exactly right
 * @param req Request
 * @param res Response
 */
export async function search(req: Request, res: Response): Promise<void> {
  const username = req.query.username
  if (username) {
    const user = await getUserByUsername(username as string)
    if (user) res.status(200).json(JSON.parse(JSON.stringify(user)))
    else res.status(404).json({ error: true, message: 'User not found' })
  } else {
    res.status(404).json({ error: true, message: 'User not found' })
  }
}