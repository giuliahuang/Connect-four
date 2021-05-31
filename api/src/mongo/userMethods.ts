import mongoose from 'mongoose'
import logger from "../logger"
import User from "../models/User"
import { genPassword } from "../utils/passwordUtils"
import UserModel from "./User"

/**
 * Receives the hash + salt and stores them in the user's document
 * @param user user who requested the password change
 * @param pwd string containing the password provided by the user
 */
export async function setPassword(user: User & mongoose.Document<any, any>, pwd: string) {
  const pwdObj = genPassword(pwd)
  user.hash = pwdObj.hash
  user.salt = pwdObj.salt
  await user.update()
}

export async function setAdmin(user: User & mongoose.Document<any, any>) {
  if (!user.roles.includes('ADMIN')) {
    user.roles.push('ADMIN')
    await user.update()
  }
}

export async function setModerator(user: User & mongoose.Document<any, any>) {
  if (!user.roles.includes('MODERATOR')) {
    user.roles.push('MODERATOR')
    await user.update()
  }
}

/**
 * Creates a new user with the provided parameters
 * @param username 
 * @param email 
 * @param password 
 * @returns the mongodb document after it got stored in the DB
 */
export async function newUser(username: string, email: string, password: string): Promise<User & mongoose.Document<any, any>> {
  const pwdObj = genPassword(password)
  const doc = new UserModel({
    username: username,
    email: email,
    salt: pwdObj.salt,
    hash: pwdObj.hash
  })
  return await doc.save()
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

export async function decreaseMmr(player: string, points: number) {
  try {
    await UserModel.findByIdAndUpdate(player, {$inc: {mmr: -points}})
  } catch (err) {
    logger.error(err)
  }
}

/**
 * @returns the 10 top ranked players in the database
 */
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

/**
 * @param userId of the user who requested the statistics
 * @returns an object containing the number of wins, losses and the winrate | undefined
 * if the user is not found
 */
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

export async function setAvatar(uid: string, path: string): Promise<boolean> {
  try {
    await UserModel.findByIdAndUpdate(uid, { avatar: path })
    return true
  } catch (err) {
    logger.error(err)
  }
  return false
}