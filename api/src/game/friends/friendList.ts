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

const hgetAsync = promisify(redis.hget).bind(redis)
const hsetAsync = promisify(redis.hset).bind(redis)

export function sendMessage(user: User, message: string, destUsername: string, socket: Socket) {
  if (user.friends.includes(destUsername)) {
    socket.to(destUsername).emit('dm', message)
    dm(message, user.username, destUsername)
  }
  else
    socket.to(user.username).emit('dm', `${destUsername} is not a valid friend`)
}

export async function clientConnected(socket: Socket) {
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

export async function clientDisconnected(socket: Socket, reason: string) {
  try {
    const username = await hgetAsync('users', socket.id)
    if (username) {
      logger.info(`Client ${username} disconnected: ${reason}`)
      const user = await getUserByUsername(username)
      if (user) {
        user.friends.forEach(friend => {
          logger.info('sending disconnection event to ' + friend)
          socket.to(friend).emit('disconnected', username)
        })
        redis.hdel('users', socket.id)
      }
    }
  } catch (err) {
    logger.prettyError(err)
  }
}

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