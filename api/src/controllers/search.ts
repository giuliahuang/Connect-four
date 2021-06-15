import { Request, Response } from 'express'
import logger from '../logger'
import { getUserByUsername } from '../mongo/userMethods'

/**
 * Searches for the user through the property username set into
 * the request's body. It assumes that the username is typed
 * exactly right
 * @param req Request
 * @param res Response
 */
export function search(req: Request, res: Response): void {
  const username = req.query.username
  if (username) {
    getUserByUsername(username as string).then(user => {
      res.status(200).json(JSON.parse(JSON.stringify(user)))
    }).catch(err => {
      logger.error(err)
      res.status(404).json({ error: true, message: 'User not found' })
    })
  }
}