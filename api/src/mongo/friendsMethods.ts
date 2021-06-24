import mongoose from 'mongoose'
import { receiveMessageOnPort } from 'worker_threads'
import logger from "../logger"
import User from "../models/User"
import UserModel from "./User"
import { getUserByUsername } from './userMethods'

/**
 * Allows a user to send a friend request to another user
 * @param askerUsername username of the user who sent the friend request
 * @param requestedUsername username of the user who received the friend request
 * @returns true if the request has been properly processed, false otherwise
 */
export async function sendFriendRequest(askerUsername: string, requestedUsername: string): Promise<boolean> {
  try {
    const session = await UserModel.startSession()

    await session.withTransaction(async () => {
      const asker = await UserModel.findOne({ username: askerUsername })
      const requested = await UserModel.findOne({ username: requestedUsername })
      if (asker && requested && asker !== requested) {
        if ((!asker.sentFriendReqs.includes(requested.username) && !requested.receivedFriendReqs.includes(asker.username))
          || (!asker.friends.includes(requested.username) && (!requested.friends.includes(asker.username)))) {

          asker.sentFriendReqs.push(requested.username)
          requested.receivedFriendReqs.push(asker.username)
          asker.save()
          requested.save()
        } else {
          throw new Error('Friend request already sent')
        }
      } else {
        throw new Error('User not found')
      }
    })

    session.endSession()
    return true
  } catch (err) {
    logger.error(err)
  }
  return false
}

/**
 * Allows a user to respond to a friend request that they received
 * @param hasAccepted indicates whether the user accepted or refused the request
 * @param askerUsername username of the user who sent the friend request
 * @param requestedUsername username of the user who received the friend request
 */
export async function processFriendRequest(hasAccepted: boolean, askerUsername: string, requestedUsername: string): Promise<void> {
  try {
    const session = await UserModel.startSession()

    await session.withTransaction(async () => {
      const asker = await UserModel.findOne({ username: askerUsername })
      const requested = await UserModel.findOne({ username: requestedUsername })

      if (asker && requested && asker.sentFriendReqs.includes(requested.username)) {
        asker.sentFriendReqs = asker.sentFriendReqs.filter(username => username !== requested.username)
        requested.receivedFriendReqs = requested.receivedFriendReqs.filter(username => username !== asker.username)
        if (hasAccepted) {
          asker.friends.push(requested.username)
          requested.friends.push(asker.username)
        }
        await asker.save()
        await requested.save()
        const u = await UserModel.findOne({ username: asker.username })
        const u2 = await UserModel.findOne({ username: requested.username })
        logger.info(u)
        logger.info(u2)
      } else {
        throw new Error('Request not found')
      }
    })

    session.endSession()
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Deletes a user from the friends list
 * @param sourceUsername username of the user who sent the friends deletion request
 * @param deleteFriendUsername username of the user to remove from the friends list
 * @returns true if the request was processed properly, false otherwise
 */
export async function removeFromFriendList(sourceUsername: string, deleteFriendUsername: string): Promise<boolean> {
  try {
    const session = await UserModel.startSession()

    await session.withTransaction(async () => {
      const sourceUser = await UserModel.findOne({ username: sourceUsername })
      const deletedFriend = await UserModel.findOne({ username: deleteFriendUsername })

      logger.info(sourceUser)
      logger.info(deletedFriend)
      if (sourceUser && deletedFriend &&
        sourceUser.friends.includes(deletedFriend.username) &&
        deletedFriend.friends.includes(sourceUser.username)) {

        sourceUser.friends = sourceUser.friends.filter(data => data !== deletedFriend.username)
        deletedFriend.friends = deletedFriend.friends.filter(data => data !== sourceUser.username)
        logger.info(sourceUser)
        logger.info(deletedFriend)
        await sourceUser.save()
        await deletedFriend.save()
      } else {
        throw new Error('Friend not found')
      }
    })

    session.endSession()
    return true

  } catch (err) {
    logger.error(err)
  }
  return false
}

export async function getFriendProfile(username: string, friendUsername: string): Promise<User | undefined> {
  try {
    const user = await getUserByUsername(friendUsername)
    if (user) {
      user.sentFriendReqs = []
      user.receivedFriendReqs = []
      return user
    }
  } catch (err) {
    logger.error(err)
  }
}