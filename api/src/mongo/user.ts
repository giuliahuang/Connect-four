import logger from '../logger'
import { genPassword, validatePassword as isValid } from '../utils/passwordUtils'
import User from '../models/User'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema<User>({
  username: {
    type: mongoose.SchemaTypes.String,
    required: true
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
  }
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
    friends: []
  })
  return await doc.save()
}

export async function addFriend(sourceEmail: string, requestedEmail: string): Promise<boolean> {
  try {
    const doc1 = await UserModel.findOne({ email: sourceEmail })
    const doc2 = await UserModel.findOne({ email: requestedEmail })

    if (!doc1 || !doc2) {
      logger.error('Users not found')
      return false
    } else {
      if (doc1.friends.includes(doc2.id) && doc2.friends.includes(doc1.id))
        return false

      doc1.friends.push(doc2.id)
      doc2.friends.push(doc1.id)
      await doc1.save()
      await doc2.save()
      return true

    }
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
          logger.info(doc.username)
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

export async function getUserById(uid: string): Promise<User | undefined> {
  try {
    const doc = await UserModel.findOne({ _id: uid })
    if (doc) return doc
  } catch (err) {
    logger.error(err)
    return undefined
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const doc = await UserModel.findOne({ email: email })
    if (doc) return doc
  } catch (err) {
    logger.error(err)
    return undefined
  }
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