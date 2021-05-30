import mongoose from 'mongoose'
import logger from "../logger"
import User from "../models/User"
import { genPassword } from "../utils/passwordUtils"
import { UserModel } from "./User"

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

export async function increaseMmr(player: User & mongoose.Document<any, any>, points: number) {
  try {
    player.mmr += points
    player.update()

  } catch (err) {
    logger.error(err)
  }
}

export async function decreaseMmr(player: User & mongoose.Document<any, any>, points: number) {
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