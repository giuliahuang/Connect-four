import mongoose from 'mongoose'
import logger from "../logger"
import User from "../models/User"
import { UserModel } from "./User"

export async function sendFriendRequest(askerEmail: string, requestedEmail: string): Promise<boolean> {
  try {
    const asker = await UserModel.findOne({ email: askerEmail })
    const requested = await UserModel.findOne({ email: requestedEmail })

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

export async function respondFriendRequest(hasAccepted: boolean, askerEmail: string, requestedEmail: string): Promise<boolean> {
  try {
    const asker = await UserModel.findOne({ email: askerEmail })
    const requested = await UserModel.findOne({ email: requestedEmail })

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

async function addFriend(user1: User & mongoose.Document<any, any>, user2: User & mongoose.Document<any, any>): Promise<boolean> {
  try {
    if (user1.friends.includes(user2._id) && user2.friends.includes(user1._id))
      return false

    user1.friends.push(user2._id)
    user2.friends.push(user1._id)
    await user1.update()
    await user2.update()
    return true

  } catch (err) {
    logger.error(err)
    return false
  }
}

export async function deleteFriend(sourceEmail: string, requestedEmail: string): Promise<boolean> {
  try {
    const doc1 = await UserModel.findOne({ email: sourceEmail })
    const doc2 = await UserModel.findOne({ email: requestedEmail })

    if (!doc1 || !doc2) {
      logger.error('Users not found')
      return false
    } else {
      if (!doc1.friends.includes(doc2.id) && !doc2.friends.includes(doc1.id))
        return false

      doc1.friends = doc1.friends.filter(data => data === doc2.id)
      doc2.friends = doc2.friends.filter(data => data === doc1.id)
      await doc1.update()
      await doc2.update()
      return true
    }
  } catch (err) {
    logger.error(err)
    return false
  }
}

export async function getFriends(uid: string): Promise<any | undefined> {
  try {
    const doc = await UserModel.findOne({ _id: uid })
    if (doc) {
      let friends: string[] = []

      for (const friendId of doc.friends) {
        const doc = await UserModel.findOne({ _id: friendId })
        if (doc) {
          friends.push(doc.username)
        }
      }
      return JSON.parse(JSON.stringify(friends))
    }
  } catch (err) {
    logger.error(err)
  }
  return undefined
}