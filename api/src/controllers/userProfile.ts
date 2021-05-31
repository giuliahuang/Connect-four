import { Request, Response } from 'express'
import path from 'path'
import UserModel from '../mongo/User'
import { setAvatar } from '../mongo/userMethods'
import extractTokenPayload from '../utils/extractTokenPayload'

/**
 * Sends a response containing the user's information
 * @param req 
 * @param res 
 */
export async function getUserProfile(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const user = await UserModel.findById(token.sub)
    if (user) {
      res.status(200).json({
        username: user.username,
        email: user.email,
        mmr: user.mmr,
        friends: user.friends,
        sentFriendReqs: user.sentFriendReqs,
        receivedFriendReqs: user.receivedFriendReqs
      })
    } else
      res.status(404).json({ error: true, message: 'User not found' })
  } else
    res.status(401).json({ error: true, message: 'Unauthorized' })
}

/**
 * Returns the path to the logged user's avatar
 * @param req Request
 * @param res Response
 */
export async function getAvatar(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const user = await UserModel.findById(token.sub)
    if (user)
      res.status(200).json(user.avatar)
    else
      res.status(404).json({ error: true, message: 'User not found' })
  } else
    res.status(401).json({ error: true, message: 'Unauthorized' })
}

/**
 * Lets a user upload a new avatar, expected form label is 'data'
 * @param req Request
 * @param res Response
 */
export async function uploadAvatar(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const user = await UserModel.findById(token.sub)
    if (user) {
      const remove = path.join(__dirname, '../../public/')
      const relPath = req.file.path.replace(remove, '')
      await setAvatar(token.sub, relPath)
      res.status(200).json({ message: 'Avatar saved' })
    } else
      res.status(404).json({ error: true, message: 'User not found' })
  } else
    res.status(401).json({ error: true, message: 'Unauthorized' })
}