import logger from '../logger'
import { genPassword, validatePassword as isValid } from '../utils/passwordUtils'
import User from '../models/User'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema<User>({
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  email: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  roles: {
    type: [mongoose.SchemaTypes.String],
    required: true
  },
  salt: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  hash: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  mmr: {
    type: mongoose.SchemaTypes.Number,
    required: true
  },
  friends: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true
  },
  sentFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true
  },
  receivedFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true
  },
})

const UserModel = mongoose.model<User>('User', userSchema)

export async function setPassword(user: User, pwd: string) {
  const pwdObj = genPassword(pwd)
  UserModel.findOneAndUpdate({ email: user.email }, { hash: pwdObj.hash, salt: pwdObj.salt })
}

export function hasAdminRole(user: User): boolean {
  return user.roles.includes('ADMIN')
}

export async function setAdmin(user: User) {
  if (!hasAdminRole(user)) {
    await UserModel.findOneAndUpdate({ email: user.email }, { $push: { roles: 'ADMIN' } })
  }
}

export function hasModeratorRole(user: User): boolean {
  return user.roles.includes('MODERATOR')
}

export async function setModerator(user: User) {
  if (!hasModeratorRole(user))
    await UserModel.findOneAndUpdate({ email: user.email }, { $push: { roles: 'MODERATOR' } })
}

export async function newUser(username: string, email: string, password: string): Promise<User & mongoose.Document<any, any>> {
  const pwdObj = genPassword(password)
  const doc = new UserModel({
    username: username,
    email: email,
    roles: [],
    salt: pwdObj.salt,
    hash: pwdObj.hash,
    mmr: 0,
    friends: [],
    sentFriendReqs: [],
    receivedFriendReqs: []
  })
  return await doc.save()
}

export async function sendFriendRequest(sourceEmail: string, requestedEmail: string): Promise<boolean> {
  try {
    const src = await UserModel.findOne({ email: sourceEmail })
    const dest = await UserModel.findOne({ email: requestedEmail })

    if (src && dest) {
      if (!checkRequest(src, dest)) {
        if (!src.sentFriendReqs.includes(dest._id)) {
          src.sentFriendReqs.push(dest._id)
        }
        if (!dest.receivedFriendReqs.includes(src._id))
          dest.receivedFriendReqs.push(src._id)

        src.update()
        dest.update()
      }
      return true
    }
  } catch (err) {
    logger.error(err)
  }
  return false
}

async function checkRequest(src: User & mongoose.Document<any, any>, dest: User & mongoose.Document<any, any>): Promise<boolean> {
  if (dest.sentFriendReqs.includes(src._id))
    return await addFriend(src, dest)
  return false
}

export async function respondFriendRequest(hasAccepted: boolean, sourceEmail: string, requestedEmail: string) {
  try {
    const src = await UserModel.findOne({ email: sourceEmail })
    const dest = await UserModel.findOne({ email: requestedEmail })

    if (src && dest) {
      src.sentFriendReqs = src.sentFriendReqs.filter(id => id === dest._id)
      dest.receivedFriendReqs = dest.receivedFriendReqs.filter(id => id === src._id)
      src.update()
      dest.update()
      if (hasAccepted) {
        addFriend(src, dest)
      }
    }
  } catch (err) {
    logger.error(err)
  }
}

async function addFriend(user1: User & mongoose.Document<any, any>, user2: User & mongoose.Document<any, any>): Promise<boolean> {
  try {
    if (user1.friends.includes(user2._id) && user2.friends.includes(user1._id))
      return false

    user1.friends.push(user2._id)
    user2.friends.push(user1._id)
    await user1.save()
    await user1.save()
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
      await doc1.save()
      await doc2.save()
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

export async function getUserById(uid: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ _id: uid })
  } catch (err) {
    logger.error(err)
  }
  return null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ email: email })
  } catch (err) {
    logger.error(err)
    return null
  }
}

export async function getUsersByUsername(username: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ username: username })
  } catch (err) {
    logger.error(err)
  }
  return null
}

export async function increaseMmr(uid: string, points: number) {
  try {
    const doc = await UserModel.findOne({ _id: uid })
    if (doc) {
      doc.mmr += points
      doc.save()
    }
  } catch (err) {
    logger.error(err)
  }
}

export async function decreaseMmr(uid: string, points: number) {
  try {
    const doc = await UserModel.findOne({ _id: uid })
    if (doc) {
      doc.mmr -= points
      doc.save()
    }
  } catch (err) {
    logger.error(err)
  }
}