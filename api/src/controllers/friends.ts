import { Request, Response } from 'express'
import logger from '../logger'
import User from '../models/User'
import { getFriendProfile, processFriendRequest, removeFromFriendList, sendFriendRequest } from '../mongo/friendsMethods'
/**
 * Sends a response containing the friends list of the user who originated the request
 * @param req Request
 * @param res Response
 */
export async function getFriendsList(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User
  res.status(200).json(user.friends)
}

/**
 * Sends a response containing the friend requests of the user who originated the request
 * @param req Request
 * @param res Response
 */
export async function getFriendsRequests(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User
  res.status(200).json(user.receivedFriendReqs)
}

/**
 * Sends a friend request to the user through the requestedUsername property set in the
 * request's body
 * @param req Request
 * @param res Response
 */
export async function addFriend(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User
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
export async function respondFriendRequest(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User
  await processFriendRequest(req.body.hasAccepted, req.body.askerUsername, user.username)
  res.status(200).json({ message: 'Friend request response received' })
}

/**
 * Removes a friend from the friends list
 * @param req Request
 * @param res Response
 */
export async function deleteFriend(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User
  const result = await removeFromFriendList(user.username, req.params.username as string)
  if (result)
    res.status(200).json({ message: 'Successfully deleted friend' })
  else
    res.status(500).json({ error: true, message: 'Failed to delete friend' })
}

/**
 * Returns a friend's profile's information
 * @param req Request
 * @param res Response
 */
export async function friendProfile(req: Request, res: Response): Promise<void> {
  const user: User = req.user as User
  const result = await getFriendProfile(user.username, req.params.username as string)
  if (result) res.status(200).json(result)
  else res.status(500).json({ error: true, message: 'Couldn\'t retrieve friend\'s profile' })
}