import { Request, Response } from 'express'
import UserModel from '../mongo/User'
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