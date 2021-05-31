import logger from '../logger/'
import { newUser } from '../mongo/userMethods'
import { issueJWT } from '../utils/issueJWT'
import { Request, Response } from 'express'

/**
 * Signup function, it requires the properties username, email and password set
 * into the request's body
 * @param req 
 * @param res 
 */
export async function signup(req: Request, res: Response) {
  try {
    const user = await newUser(req.body?.username, req.body?.email, req.body?.password)
    const jwt = await issueJWT(user)
    res.status(200).json({ message: 'User successfully created', token: jwt.token, expiresIn: jwt.expires })
  } catch (err) {
    logger.error(err)
    res.send({ error: true, message: 'An error has occurred' })
  }
}