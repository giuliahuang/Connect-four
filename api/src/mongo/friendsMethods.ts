import mongoose from 'mongoose'
import logger from "../logger"
import User from "../models/User"
import UserModel from "./User"

/**
 * Allows a user to send a friend request to another user
 * @param askerUsername username of the user who sent the friend request
 * @param requestedUsername username of the user who received the friend request
 * @returns true if the request has been properly processed, false otherwise
 */
export async function sendFriendRequest(askerUsername: string, requestedUsername: string): Promise<boolean> {
  try {
    const asker = await UserModel.findOne({ username: askerUsername })
    const requested = await UserModel.findOne({ username: requestedUsername })

    if (asker && requested) {
      if (!asker.sentFriendReqs.includes(requested._id) && !requested.receivedFriendReqs.includes(asker._id)) {
        asker.sentFriendReqs.push(requested._id)
        requested.receivedFriendReqs.push(asker._id)
        asker.update()
        requested.update()
        return true
      }
    }
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
 * @returns true if the request was accepted, false otherwise
 */
export async function respondFriendRequest(hasAccepted: boolean, askerUsername: string, requestedUsername: string): Promise<boolean> {
  try {
    const asker = await UserModel.findOne({ username: askerUsername })
    const requested = await UserModel.findOne({ username: requestedUsername })

    if (asker && requested) {
      asker.sentFriendReqs = asker.sentFriendReqs.filter(id => id === requested._id)
      requested.receivedFriendReqs = requested.receivedFriendReqs.filter(id => id === asker._id)
      asker.update()
      requested.update()
      if (hasAccepted) {
        addFriend(asker, requested)
        return true
      }
    }
  } catch (err) {
    logger.error(err)
  }
  return false
}

/**
 * Actually adds two users to the respective friends lists
 * @param user1 
 * @param user2 
 * @returns true if the operation was processed properly, false otherwise
 */
async function addFriend(user1: User & mongoose.Document<any, any>, user2: User & mongoose.Document<any, any>): Promise<boolean> {
  try {
    if (user1.friends.includes(user2._id) && user2.friends.includes(user1._id)) {
      user1.friends.push(user2._id)
      user2.friends.push(user1._id)
      await user1.update()
      await user2.update()
      return true
    }
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
    const sourceUser = await UserModel.findOne({ username: sourceUsername })
    const deletedFriend = await UserModel.findOne({ username: deleteFriendUsername })

    if (sourceUser && deletedFriend &&
      sourceUser.friends.includes(deletedFriend.id) &&
      deletedFriend.friends.includes(sourceUser.id)) {

      sourceUser.friends = sourceUser.friends.filter(data => data === deletedFriend.id)
      deletedFriend.friends = deletedFriend.friends.filter(data => data === sourceUser.id)
      await sourceUser.update()
      await deletedFriend.update()
      return true
    }
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
export async function getFriends(uid: string): Promise<string[] | undefined> {
  try {
    const doc = await UserModel.findById(uid)
    if (doc) {
      let friends: string[] = []

      for (const friendId of doc.friends) {
        const doc = await UserModel.findById(friendId)
        if (doc) friends.push(doc.username)
      }
      
      return friends
    }
  } catch (err) {
    logger.error(err)
  }
  return undefined
}