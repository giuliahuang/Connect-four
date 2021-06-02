import mongoose from 'mongoose'
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

      if (asker && requested) {
        if (!asker.sentFriendReqs.includes(requested.username) && !requested.receivedFriendReqs.includes(asker.username)) {
          asker.sentFriendReqs.push(requested.username)
          requested.receivedFriendReqs.push(asker.username)
          asker.save()
          requested.save()
        }
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
export async function respondFriendRequest(hasAccepted: boolean, askerUsername: string, requestedUsername: string) {
  try {
    const session = await UserModel.startSession()

    await session.withTransaction(async () => {
      const asker = await UserModel.findOne({ username: askerUsername })
      const requested = await UserModel.findOne({ username: requestedUsername })

      if (asker && requested) {
        asker.sentFriendReqs = asker.sentFriendReqs.filter(username => username === requested.username)
        requested.receivedFriendReqs = requested.receivedFriendReqs.filter(username => username === asker.username)
        asker.save()
        requested.save()
        if (hasAccepted) {
          await addFriend(asker, requested)
        }
      }
    })

    session.endSession()
  } catch (err) {
    logger.error(err)
  }
}

/**
 * Actually adds two users to the respective friends lists
 * @param user1 
 * @param user2 
 * @returns true if the operation was processed properly, false otherwise
 */
async function addFriend(user1: User & mongoose.Document<any, any>, user2: User & mongoose.Document<any, any>): Promise<boolean> {
  try {
    const session = await UserModel.startSession()

    await session.withTransaction(async () => {
      if (user1.friends.includes(user2.username) && user2.friends.includes(user1.username)) {
        user1.friends.push(user2.username)
        user2.friends.push(user1.username)
        await user1.save()
        await user2.save()
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
 * Deletes a user from the friends list
 * @param sourceUsername username of the user who sent the friends deletion request
 * @param deleteFriendUsername username of the user to remove from the friends list
 * @returns true if the request was processed properly, false otherwise
 */
export async function deleteFriend(sourceUsername: string, deleteFriendUsername: string): Promise<boolean> {
  try {
    const session = await UserModel.startSession()

    await session.withTransaction(async () => {
      const sourceUser = await UserModel.findOne({ username: sourceUsername })
      const deletedFriend = await UserModel.findOne({ username: deleteFriendUsername })

      if (sourceUser && deletedFriend &&
        sourceUser.friends.includes(deletedFriend.username) &&
        deletedFriend.friends.includes(sourceUser.username)) {

        sourceUser.friends = sourceUser.friends.filter(data => data === deletedFriend.username)
        deletedFriend.friends = deletedFriend.friends.filter(data => data === sourceUser.username)
        await sourceUser.save()
        await deletedFriend.save()
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
 * Returns the friends list of the user who originated the
 * @param uid user id of the user who requested the respective friends list
 * @returns an array containing the usernames of the users referenced in the friends list
 */
export async function getFriends(username: string): Promise<string[]> {
  try {
    const doc = await UserModel.findOne({ username })
    if (doc) return doc.friends
  } catch (err) {
    logger.error(err)
  }
  return []
}

export async function getFriendProfile(username: string, friendUsername: string): Promise<any> {
  try {
    const user = await getUserByUsername(username)
    const friend = await getUserByUsername(friendUsername)
    if (friend && user && (user.friends.includes(friend.username) || user.roles.includes('ADMIN') || user.roles.includes('MODERATOR'))) {
      return {
        username: friend.username,
        mmr: friend.mmr,
        avatar: friend.avatar,
        matchesPlayed: friend.matchesPlayed
      }
    }
  } catch (err) {
    logger.error(err)
  }
}