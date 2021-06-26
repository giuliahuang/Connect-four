import { Request, Response } from 'express'
import { getUserByEmail } from '../mongo/userMethods'
import { issueJWT } from '../utils/issueJWT'
import { validatePassword } from '../utils/passwordUtils'

/**
 * Login function, expects email and password properties set into the request's body
 * @param req Request
 * @param res Response
 */
export async function login(req: Request, res: Response): Promise<void> {
  const user = await getUserByEmail(req.body.email)
  if (user && validatePassword(req.body.password, user.hash, user.salt)) {
    if (!user.lastSeen) {
      res.status(300).json({ error: true, message: 'User should reset the password before logging in', path: '/login/first', method: 'POST' })
    } else {
      const tokenObject = await issueJWT(user)
      res.status(200).json({ token: tokenObject.token, expiresIn: tokenObject.expires })
    }
  } else {
    res.status(401).json({ error: true, message: 'Incorrect username or password' })
  }
}
