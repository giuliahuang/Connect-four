import { Request, Response } from 'express'
import { newUser } from '../mongo/userMethods'
import { issueJWT } from '../utils/issueJWT'

/**
 * Signup function, it requires the properties username, email and password set
 * into the request's body
 * @param req Request
 * @param res Response
 */
export async function signup(req: Request, res: Response): Promise<void> {
  const user = await newUser(req.body?.username, req.body?.email, req.body?.password)
  if (user) {
    const jwt = await issueJWT(user)
    res.status(200).json({ message: 'User successfully created', token: jwt.token, expiresIn: jwt.expires })
  } else {
    res.send({ error: true, message: 'An error has occurred' })
  }
}