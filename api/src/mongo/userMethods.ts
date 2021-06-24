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
export async function setPassword(email: string, pwd: string): Promise<boolean> {
  try {
    const pwdObj = genPassword(pwd)
    await UserModel.findOneAndUpdate({ email }, { hash: pwdObj.hash, salt: pwdObj.salt })
    return true
  } catch (err) {
    logger.prettyError(err)
    return false
  }
}

/**
 * If user is not admin it becomes one
 * @param email 
 */
export async function setAdmin(email: string): Promise<void> {
  await UserModel.findOneAndUpdate({ email, roles: { $ne: 'ADMIN' } }, { $push: { roles: 'ADMIN' } })
}

/**
 * If user is not moderator it becomes one
 * @param email 
 */
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
export async function newUser(username: string, email: string, password: string): Promise<User & mongoose.Document<User> | null> {
  try {
    const pwdObj = genPassword(password)
    const doc = new UserModel({
      username: username,
      email: email,
      salt: pwdObj.salt,
      hash: pwdObj.hash,
      lastSeen: Date.now()
    })
    return await doc.save()
  } catch (err) {
    logger.prettyError(err)
    return null
  }
}

const strippedUserQuery = 'username mmr friends roles sentFriendReqs receivedFriendReqs matchesPlayed avatar lastSeen'

/**
 * If the user is found, it is returned
 * @param uid User ID
 * @returns either the user object or null
 */
export async function getUserById(uid: string): Promise<User | null> {
  try {
    return await UserModel.findById(uid)
  } catch (err) {
    logger.error(err)
  }
  return null
}

/**
 * Returns the full user object if it is found in the database, used for authentication
 * @param email 
 * @returns either the user of null
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ email })
  } catch (err) {
    logger.error(err)
  }
  return null
}

/**
 * If the user is found, it is returned with the specified properties, as to avoid retrieving sensitive data such as
 * hash, salt and email
 * @param username
 * @returns either the user object or null
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ username }).select(strippedUserQuery)
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

/**
 * Store into the user document the path to the avatar that was just uploaded
 * @param uid User ID
 * @param path Image path on storage
 * @returns true if successful, false otherwise
 */
export async function setAvatar(uid: string, path: string): Promise<boolean> {
  try {
    await UserModel.findByIdAndUpdate(uid, { avatar: path })
    return true
  } catch (err) {
    logger.error(err)
  }
  return false
}

/**
 * @returns a list containing all the moderators
 */
export async function getModerators(): Promise<User[]> {
  try {
    return await UserModel.find({ roles: 'MODERATOR' }).select(strippedUserQuery)
  } catch (err) {
    logger.prettyError(err)
    return []
  }
}

/**
 * Deletes a user from the database, after checking for the required privileges
 * @param staffUsername Username of the staff member who asked for the deletion 
 * @param username Username of the user to delete
 * @returns true if successful, false otherwise
 */
export async function deleteUserSudo(staffUsername: string, username: string): Promise<boolean> {
  try {
    if (staffUsername !== username) {
      const staff = await getUserByUsername(staffUsername)
      // TODO
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

/**
 * Lets a user ask for their own account to be deleted from the database
 * @param username Username of the user who wants to be deleted
 * @returns true if successful, false otherwise
 */
export async function deleteUser(username: string): Promise<boolean> {
  try {
    await UserModel.findOneAndDelete({username})
    return true
  } catch (err) {
    logger.prettyError(err)
    return false
  }
}