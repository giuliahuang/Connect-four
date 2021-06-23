import { Socket } from "socket.io"
import { promisify } from 'util'
import logger from "../../logger"
import Message from "../../models/Message"
import User from "../../models/User"
import { MessageModel } from "../../mongo/Message"
import { dm } from "../../mongo/messageMethods"
import UserModel from "../../mongo/User"
import { getUserByUsername } from "../../mongo/userMethods"
import { redisClient as redis } from '../../setup/setupRedis'
import { cancelMatchmaking } from "../matchmaking/matchmaking"

// Promisified Redis hashmap methods
const hgetAsync = promisify(redis.hget).bind(redis)
const hsetAsync = promisify(redis.hset).bind(redis)

/**
 * Sends a message to the specified user if they are a friend through the associated
 * Socket.io room and then persists it into the database
 * @param user User who sent the message
 * @param message Content of the message
 * @param destUsername User who's supposed to receive the message
 * @param socket Socket client of user
 */
export function sendMessage(user: User, message: string, destUsername: string, socket: Socket): void {
  if (user.friends.includes(destUsername)) {
    socket.to(destUsername).emit('dm', message)
    dm(message, user.username, destUsername)
  } else
    socket.to(user.username).emit('dm', `${destUsername} is not a valid friend`)
}

/**
 * Stores an association of the socket id and the user's username into the
 * Redis hashmap. Then emits an event to the user's friends to notify of his
 * online status
 * @param socket Socket client of the user who just connected to the server
 */
export async function clientConnected(socket: Socket): Promise<void> {
  const user: User = socket.request['user']
  try {
    await hsetAsync(['users', socket.id, user.username])
    const friends: string[] = socket.request['user.friends']
    if (friends) {
      friends.forEach(friend => {
        socket.to(friend).emit('connected', socket.request['user.username'])
      })
    }
  } catch (err) {
    logger.prettyError(err)
  }
}

/**
 * Retrieves the user's username through the Redis hashmap and deletes the record from it.
 * Then it cancels the eventual matchmaking that the user was engaged in.
 * Lastly it notifies the user's friends of his disconnection.
 * @param socket Socket client of the user who just disconnected
 */
export async function clientDisconnected(socket: Socket): Promise<void> {
  try {
    const username = await hgetAsync('users', socket.id)
    if (username) {
      const user = await getUserByUsername(username)
      if (user) {
        cancelMatchmaking(user._id)
        user.friends.forEach(friend => {
          socket.to(friend).emit('disconnected', username)
        })
        redis.hdel('users', socket.id)
      }
    }
  } catch (err) {
    logger.prettyError(err)
  }
}

/**
 * Lets a user retrieve all the messages that they received while offline
 * @param socket Socket client of the user who connected
 * @returns A list containing all new messages
 */
export async function getNewMessages(socket: Socket): Promise<Message[]> {
  try {
    const username = socket.request['user.username']
    const user = await UserModel.findOne({ username })
    if (user && user.lastSeen) {
      const ls = user.lastSeen
      return await MessageModel.find({ users: user, createdAt: { "$gt": { ls } } })
    }
  } catch (err) {
    logger.error(err)
  }
  return []
}