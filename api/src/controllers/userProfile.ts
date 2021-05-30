import { Request, Response } from 'express'
import { getUserById } from '../mongo/userMethods'
import extractTokenPayload from '../utils/extractTokenPayload'

export async function getUserProfile(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const user = await getUserById(token.sub)
    if (user) {
      res.status(200).json({
        username: user.username,
        email: user.email,
        mmr: user.mmr,
        friends: user.friends,
        sentFriendReqs: user.sentFriendReqs,
        receivedFriendReqs: user.receivedFriendReqs
      })
    }
  }
  res.status(404).json({ error: true, message: 'User not found' })
}