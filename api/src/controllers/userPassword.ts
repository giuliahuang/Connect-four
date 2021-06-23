import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User'
import { getUserByEmail, setPassword } from '../mongo/userMethods'
import { validatePassword } from '../utils/passwordUtils'

/**
 * Lets a user set a new password, provided that the current one is valid
 * @param req Request
 * @param res Response
 */
export async function newPassword(req: Request, res: Response): Promise<void> {
  const password = req.body.password
  const user = await getUserByEmail(req.body.email)

  if (user && validatePassword(password, user.hash, user.salt)) {
    const result = await setPassword(user.email, req.body.newPassword)
    if (result) res.status(200).json({ message: 'Password set correctly' })
    else res.status(500).json({ error: true, message: 'Internal server error' })
  } else res.status(401).json({ error: true, message: 'Invalid password' })
}

/**
 * Resets a user's password, provided that the current one is valid
 * @param req Request
 * @param res Response
 */
export async function resetPassword(req: Request, res: Response): Promise<void> {
  const user = req.user as User
  if (validatePassword(req.body.password, user.hash, user.salt)) {
    const newPlainPassword = uuidv4()
    const result = await setPassword(user.email, newPlainPassword)
    if (result) res.status(200).json({ message: 'Password reset correctly', password: newPlainPassword })
    else res.status(500).json({ error: true, message: 'Something went wrong while resetting the password' })
  } else {
    res.status(401).json({ error: true, message: 'Old password isn\'t valid' })
  }
}