import { Request, Response } from 'express'
import { getUsersByUsername } from '../mongo/userMethods'

/**
 * Searches for the user through the property username set into
 * the request's body. It assumes that the username is typed
 * exactly right
 * @param req Request
 * @param res Response
 */
export async function search(req: Request, res: Response) {
  const uname = req.body.username
  const user = await getUsersByUsername(uname)
  if (user) {
    const jsonObj = JSON.parse(JSON.stringify(user))
    res.status(200).json(jsonObj)
  } else {
    res.status(404).json({ error: true, message: 'User not found' })
  }
}