import mongoose from 'mongoose'
import logger from "../logger"
import MatchResults from '../models/MatchResults'
import User from "../models/User"
import { genPassword } from "../utils/passwordUtils"
import UserModel from "./User"

const MMR_INCR = 30
const MMR_DECR = 25

/**
 * Receives the hash + salt and stores them in the user's document
 * @param userEmail email of the user who requested the password change
 * @param pwd string containing the password provided by the user
 */
export async function setPassword(userEmail: string, pwd: string) {
  const pwdObj = genPassword(pwd)
  await UserModel.findOneAndUpdate({ email: userEmail }, { hash: pwdObj.hash, salt: pwdObj.salt })
}

export async function setAdmin(user: User & mongoose.Document<any, any>) {
  if (!user.roles.includes('ADMIN')) {
    user.roles.push('ADMIN')
    await user.updateOne()
  }
}

export async function setModerator(user: User & mongoose.Document<any, any>) {
  if (!user.roles.includes('MODERATOR')) {
    user.roles.push('MODERATOR')
    await user.updateOne()
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

export async function processResults(res: MatchResults) {
  try {
    await UserModel.findByIdAndUpdate(res.winner, { $inc: { mmr: MMR_INCR }, $push: { matchesPlayed: res } })
    await UserModel.findByIdAndUpdate(res.loser, { $inc: { mmr: -MMR_DECR }, $push: { matchesPlayed: res } })
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

export async function setAvatar(uid: string, path: string): Promise<boolean> {
  try {
    await UserModel.findByIdAndUpdate(uid, { avatar: path })
    return true
  } catch (err) {
    logger.error(err)
  }
  return false
}

export async function getModerators(): Promise<any[]> {
  const mods = await UserModel.find({ roles: 'MODERATORS' })
  let modsCleaned: any = []
  for (const mod of mods) {
    const modCleaned = {
      _id: mod._id,
      username: mod.username,
      email: mod.email,
    }
    modsCleaned.push(modCleaned)
  }
  return modsCleaned
}

export async function deleteUser(staffUsername: string, username: string): Promise<boolean> {
  try {
    const staff = await getUserByEmail(staffUsername)
    if (staff && staff.roles.includes('ADMIN')) {
      UserModel.findOneAndDelete({ username })
      return true
    } else if (staff && staff.roles.includes('MODERATOR')) {
      UserModel.findOneAndDelete({ username, roles: { $nin: ['ADMIN', 'MODERATOR'] } })
      return true
    }
  } catch (err) {
    logger.error(err)
  }
  return false
}