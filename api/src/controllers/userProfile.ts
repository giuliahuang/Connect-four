import { Request, Response } from 'express'
import path from 'path'
import logger from '../logger'
import User from '../models/User'
import { setAvatar } from '../mongo/userMethods'

/**
 * Sends a response containing the user's information
 * @param req 
 * @param res 
 */
export async function getUserProfile(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User

  res.status(200).json({
    username: user.username,
    email: user.email,
    mmr: user.mmr,
    friends: user.friends,
    sentFriendReqs: user.sentFriendReqs,
    receivedFriendReqs: user.receivedFriendReqs,
    avatar: user.avatar,
    matchesPlayed: user.matchesPlayed
  })
}

/**
 * Lets a user upload a new avatar, expected form label is 'data'
 * @param req Request
 * @param res Response
 */
export async function uploadAvatar(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User
  const remove = path.join(__dirname, '../../public/')
  const relPath = req.file.path.replace(remove, '')
  try {
    await setAvatar(user._id, relPath)
    res.status(200).json({ message: 'Avatar saved' })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: true, message: 'Internal server error' })
  }
}