import { Request, Response } from 'express'
import { addFriend as af, getFriends, deleteFriend as df } from '../mongo/user'
import extractTokenPayload from '../utils/extractTokenPayload'

export async function getFriendsList(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const result = await getFriends(token.sub)
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(400).json({ error: true, message: 'Failed to retrieve JWT payload' })
    }
  }
}

export async function addFriend(req: Request, res: Response) {
  const result = await af(req.body.sourceEmail, req.body.requestedEmail)
  if (result) res.status(200).json({ message: 'Successfully added to the friends list' })
  else res.status(400).json({ error: true, message: 'Failed to add to friends list' })
}

export async function deleteFriend(req: Request, res: Response) {
  const result = await df(req.body.sourceEmail, req.body.requestedEmail)
  if (result) res.status(200).json({ message: 'Successfully deleted friend' })
  else res.status(400).json({ error: true, message: 'Failed to delete friend' })
}
