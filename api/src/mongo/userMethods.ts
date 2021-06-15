import mongoose from 'mongoose'
import Player from '../game/Player'
import logger from "../logger"
import User from "../models/User"
import { genPassword } from "../utils/passwordUtils"
import UserModel from "./User"

/**
 * Receives the hash + salt and stores them in the user's document
 * @param userEmail email of the user who requested the password change
 * @param pwd string containing the password provided by the user
 */
export async function setPassword(email: string, pwd: string): Promise<void> {
  const pwdObj = genPassword(pwd)
  await UserModel.findOneAndUpdate({ email }, { hash: pwdObj.hash, salt: pwdObj.salt })
}

export async function setAdmin(email: string): Promise<void> {
  await UserModel.findOneAndUpdate({ email, roles: { $ne: 'ADMIN' } }, { $push: { roles: 'ADMIN' } })
}

export async function setModerator(email: string): Promise<void> {
  await UserModel.findOneAndUpdate({ email, roles: { $ne: 'MODERATOR' } }, { $push: { roles: 'MODERATOR' } })
}

/**
 * Creates a new user with the provided parameters
 * @param username 
 * @param email 
 * @param password 
 * @returns the mongodb document after it got stored in the DB
 */
export async function newUser(username: string, email: string, password: string): Promise<User & mongoose.Document<User>> {
  const pwdObj = genPassword(password)
  const doc = new UserModel({
    username: username,
    email: email,
    salt: pwdObj.salt,
    hash: pwdObj.hash,
    lastSeen: Date.now()
  })
  return await doc.save()
}

export async function getUserById(uid: string): Promise<User | null> {
  try {
    return await UserModel.findById(uid).select('username mmr friends roles sentFriendReqs receivedFriendReqs matchesPlayed avatar lastSeen')
  } catch (err) {
    logger.error(err)
  }
  return null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ email })
  } catch (err) {
    logger.error(err)
  }
  return null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ username }).select('username mmr friends roles sentFriendReqs receivedFriendReqs matchesPlayed avatar lastSeen')
  } catch (err) {
    logger.error(err)
  }
  return null
}

/**
 * @returns the 10 top ranked players in the database
 */
export async function globalRanking(): Promise<Player[]> {
  const topTen: Player[] = []
  try {
    const result = await UserModel.find().sort({ length: -1 }).limit(10)
    result.forEach(user => {
      topTen.push({ id: user._id, mmr: user.mmr, username: user.username })
    })
  } catch (err) {
    logger.error(err)
  }
  return topTen
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

export async function getModerators(): Promise<User[]> {
  try {
    return await UserModel.find({ roles: 'MODERATOR' }).select('username mmr friends roles sentFriendReqs receivedFriendReqs matchesPlayed avatar lastSeen')
  } catch (err) {
    logger.prettyError(err)
    return []
  }
}

export async function deleteUser(staffUsername: string, username: string): Promise<boolean> {
  try {
    if (staffUsername !== username) {
      const staff = await getUserByUsername(staffUsername)
      if (staff && staff.roles.includes('ADMIN')) {
        UserModel.findOneAndDelete({ username })
        return true
      } else if (staff && staff.roles.includes('MODERATOR')) {
        UserModel.findOneAndDelete({ username, roles: { $nin: ['ADMIN', 'MODERATOR'] } })
        return true
      }
    }
  } catch (err) {
    logger.error(err)
  }
  return false
}