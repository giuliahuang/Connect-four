import { Request, Response } from 'express'
import User from '../models/User'
import UserModel from '../mongo/User'
import { getUserByEmail, setPassword } from '../mongo/userMethods'
import { validatePassword } from '../utils/passwordUtils'

/**
 * Lets a user set a new password, provided that the current one is valid
 * @param req Request
 * @param res Response
 */
export async function changeTempPassword(req: Request, res: Response): Promise<void> {
  const password = req.body.password
  const user = await getUserByEmail(req.body.email)

  if (user && validatePassword(password, user.hash, user.salt)) {
    const result = await setPassword(user.email, req.body.newPassword)
    await UserModel.findOneAndUpdate({ username: user.username }, { lastSeen: Date.now() })
    if (result) res.status(200).json({ message: 'Password set correctly' })
    else res.status(500).json({ error: true, message: 'Internal server error' })
  } else res.status(401).json({ error: true, message: 'Invalid password' })
}

/**
 * Lets a user set a new password is the current one is valid
 * @param req Request
 * @param res Response
 */
export async function newPassword(req: Request, res: Response): Promise<void> {
  const user = req.user as User
  const currentPass = req.body.currentPass
  const newPass = req.body.newPass

  if (user && validatePassword(currentPass, user.hash, user.salt)) {
    const result = await setPassword(user.email, newPass)
    if (result) res.status(200).json({ message: 'Password reset correctly' })
    else res.status(500).json({ error: true, message: 'Something went wrong while changing the password' })
  } else res.status(401).json({ error: true, message: 'Old password isn\'t valid' })
}