import logger from '../logger/'
import { newUser } from '../models/User'
import { issueJWT } from '../utils/issueJWT'

export async function signup(req, res) {
  try {
    const user = await newUser(req.body?.username, req.body?.email, req.body?.password)
    const jwt = issueJWT(user)
    res.status(200).json({ message: 'User successfully created', token: jwt.token, expiresIn: jwt.expires })
  } catch (err) {
    logger.error(err)
    res.send({ error: true, message: 'An error has occurred' })
  }
}