import { Request, Response } from 'express'
import { deleteFriend as df, getFriends, respondFriendRequest as rfr, sendFriendRequest } from '../mongo/friendsMethods'
import UserModel from '../mongo/User'
import extractTokenPayload from '../utils/extractTokenPayload'

/**
 * Sends a response containing the friends list of the user who originated the request
 * @param req Request
 * @param res Response
 */
export async function getFriendsList(req: Request, res: Response) {
  const token = extractTokenPayload(req)

  if (token) {
    const result = await getFriends(token.sub)
    if (result)
      res.status(200).json(JSON.parse(JSON.stringify(result)))
    else
      res.status(404).json({ error: true, message: 'User not found' })
  } else
    res.status(401).json({ error: true, message: 'Unauthorized' })
}

/**
 * Sends a response containing the friend requests of the user who originated the request
 * @param req Request
 * @param res Response
 */
export async function getFriendsRequests(req: Request, res: Response) {
  const token = extractTokenPayload(req)

  if (token) {
    const result = await UserModel.findById(token.sub)
    if (result)
      res.status(200).json(JSON.parse(JSON.stringify(result.receivedFriendReqs)))
    else
      res.status(404).json({ error: true, message: 'User not found' })
  } else
    res.status(500).json({ error: true, message: 'Failed to retrieve friends list' })
}

/**
 * Sends a friend request to the user through the requestedUsername property set in the
 * request's body
 * @param req Request
 * @param res Response
 */
export async function addFriend(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  const user = await UserModel.findById(token?.sub)

  if (user) {
    const result = await sendFriendRequest(user.username, req.body.requestedUsername)
    if (result)
      res.status(200).json({ message: 'Friend request sent' })
    else
      res.status(500).json({ error: true, message: 'An error has occurred' })
  } else
    res.status(404).json({ error: true, message: 'User not found' })
}

/**
 * Lets a user respond to a friend request through the askerUsername and hasAccepted
 * properties set into the request's body
 * @param req Request
 * @param res Response
 */
export async function respondFriendRequest(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  const user = await UserModel.findById(token?.sub)

  if (user) {
    const result = await rfr(req.body.hasAccepted, req.body.askerUsername, user.username)
    if (result)
      res.status(200).json({ message: 'Friend request accepted' })
    else
      res.status(200).json({ message: 'Friend request rejected' })
  } else
    res.status(404).json({ error: true, message: 'User not found' })
}

/**
 * Removes a friend from the friends list through the 
 * @param req Request
 * @param res Response
 */
export async function deleteFriend(req: Request, res: Response) {
  const token = extractTokenPayload(req)
  const user = await UserModel.findById(token?.sub)
  if (user) {
    const result = await df(req.body.sourceEmail, req.body.requestedEmail)
    if (result)
      res.status(200).json({ message: 'Successfully deleted friend' })
    else
      res.status(500).json({ error: true, message: 'Failed to delete friend' })
  } else
    res.status(404).json({ error: true, message: 'User not found' })
}
