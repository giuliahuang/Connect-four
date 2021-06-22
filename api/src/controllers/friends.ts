import { Request, Response } from 'express'
import logger from '../logger'
import User from '../models/User'
import { deleteFriend as df, getFriendProfile, getFriends, respondFriendRequest as rfr, sendFriendRequest } from '../mongo/friendsMethods'

/**
 * Sends a response containing the friends list of the user who originated the request
 * @param req Request
 * @param res Response
 */
export async function getFriendsList(req: Request, res: Response) {
  const user: User = req.body['user']

  const result = await getFriends(user._id)
  if (result)
    res.status(200).json(JSON.parse(JSON.stringify(result)))
  else
    res.status(404).json({ error: true, message: 'User not found' })

}

/**
 * Sends a response containing the friend requests of the user who originated the request
 * @param req Request
 * @param res Response
 */
export async function getFriendsRequests(req: Request, res: Response) {
  const user: User = req.body['user']
  res.status(200).json(JSON.parse(JSON.stringify(user.receivedFriendReqs)))
}

/**
 * Sends a friend request to the user through the requestedUsername property set in the
 * request's body
 * @param req Request
 * @param res Response
 */
export async function addFriend(req: Request, res: Response) {
  const user: User = req.body['user']
  const result = await sendFriendRequest(user.username, req.body.requestedUsername)
  if (result)
    res.status(200).json({ message: 'Friend request sent' })
  else
    res.status(500).json({ error: true, message: 'An error has occurred' })
}

/**
 * Lets a user respond to a friend request through the askerUsername and hasAccepted
 * properties set into the request's body
 * @param req Request
 * @param res Response
 */
export async function respondFriendRequest(req: Request, res: Response) {
  const user: User = req.body['user']
  const result = await rfr(req.body.hasAccepted, req.body.askerUsername, user.username)
  if (result != null)
    res.status(200).json({ message: 'Friend request accepted' })
  else
    res.status(200).json({ message: 'Friend request rejected' })
}

/**
 * Removes a friend from the friends list
 * @param req Request
 * @param res Response
 */
export async function deleteFriend(req: Request, res: Response) {
  const user: User = req.body['user']
  const result = await df(user.email, req.query.username as string)
  if (result)
    res.status(200).json({ message: 'Successfully deleted friend' })
  else
    res.status(500).json({ error: true, message: 'Failed to delete friend' })
}

export async function friendProfile(req: Request, res: Response) {
  const user: User = req.body['user']
  try {
    const result = await getFriendProfile(user.username, req.query.username as string)
    if (result) return res.status(200).json(result)
  } catch (err) {
    logger.error(err)
  }
  return res.status(500).json({ error: true, message: 'Could retrieve friend\'s profile' })
}