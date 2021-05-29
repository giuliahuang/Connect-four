import { Request, Response } from 'express'
import { sendFriendRequest, getUserById, getFriends, deleteFriend as df, respondFriendRequest as rfr } from '../mongo/user'
import extractTokenPayload from '../utils/extractTokenPayload'

export async function getFriendsList(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const result = await getFriends(token.sub)
    if (result) {
      res.status(200).json(result)
    }
  }
  res.status(500).json({ error: true, message: 'Internal server error' })
}

export async function getFriendsRequests(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  if (token) {
    const result = await getUserById(token.sub)
    if (result) {
      res.status(200).json(JSON.parse(JSON.stringify(result.friends)))
    }
  }
  res.status(500).json({ error: true, message: 'Failed to retrieve friends list' })
}

export async function addFriend(req: Request, res: Response) {
  const result = await sendFriendRequest(req.body.sourceEmail, req.body.requestedEmail)
  if (result) res.status(200).json({ message: 'Friend request sent' })
  else res.status(400).json({ error: true, message: 'Friend request failed' })
}

export async function respondFriendRequest(req: Request, res: Response) {
  const result = await rfr(req.body.hasAccepted, req.body.sourceEmail, req.body.requestedEmail)
  if (result) res.status(200).json({ message: 'Friend request accepted' })
  else res.status(200).json({ message: 'Friend request rejected' })
}

export async function deleteFriend(req: Request, res: Response) {
  const result = await df(req.body.sourceEmail, req.body.requestedEmail)
  if (result) res.status(200).json({ message: 'Successfully deleted friend' })
  else res.status(400).json({ error: true, message: 'Failed to delete friend' })
}
