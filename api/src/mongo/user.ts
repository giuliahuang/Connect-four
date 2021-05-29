import logger from '../logger'
import { genPassword } from '../utils/passwordUtils'
import User from '../models/User'
import mongoose from 'mongoose'
import { matchSchema } from './MatchModel'
import MatchResult from '../models/Match'

const MMR_INCR = 30
const MMR_DECR = 25

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
  matchesPlayed: {
    type: [matchSchema],
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
    friends: [],
    sentFriendReqs: [],
    receivedFriendReqs: [],
    matchesPlayed: []
  })
  return await doc.save()
}

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

async function increaseMmr(player: User & mongoose.Document<any, any>, points: number) {
  try {
    player.mmr += points
    player.update()

  } catch (err) {
    logger.error(err)
  }
}

async function decreaseMmr(player: User & mongoose.Document<any, any>, points: number) {
  try {
    player.mmr -= points
    player.update()
  } catch (err) {
    logger.error(err)
  }
}

export async function globalRanking(): Promise<any> {
  try {
    const result = await UserModel.find().sort({ length: -1 }).limit(10)
    let topTen: any[] = []
    result.forEach(user => {
      topTen.push({ username: user.username, mmr: user.mmr })
    })
    return topTen
  } catch (err) {
    logger.error(err)
  }
}

export async function userStats(userId: string): Promise<any> {
  try {
    const user = await UserModel.findById(userId)
    if (user) {
      const matches = user.matchesPlayed
      let wins = 0, losses = 0
      matches.forEach(match => {
        if (match.winner === user._id) ++wins
        else ++losses
      })
      let stats = {
        matchesWon: wins,
        matchesLost: losses,
        winRate: wins / (wins + losses)
      }
      return stats
    }
  } catch (err) {
    logger.error(err)
  }
}

export async function endMatch(res: MatchResult) {
  try {
    const winner = await UserModel.findById(res.winner)
    const loser = await UserModel.findById(res.loser)

    if (winner && loser) {
      winner.matchesPlayed.push(res)
      loser.matchesPlayed.push(res)

      increaseMmr(winner, MMR_INCR)
      decreaseMmr(loser, MMR_DECR)
      winner.update()
      loser.update()
    }
  } catch (err) {
    logger.error(err)
  }
}