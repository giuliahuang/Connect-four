import logger from '../logger/'
import { UserModel } from '../models/User'
import { issueJWT } from '../utils/issueJWT'
import { validatePassword } from '../utils/passwordUtils'

export async function login(req, res) {
  try {
    const doc = await UserModel.findOne({ email: req.body.email })
    if (doc && validatePassword(req.body.password, doc.hash, doc.salt)) {
      const tokenObject = issueJWT(doc)
      res.status(200).json({ token: tokenObject.token, expiresIn: tokenObject.expires })
    } else {
      res.status(401).json({ error: true, message: 'Incorrect username or password' })
    }
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: true, message: 'Internal server error' })
  }
}