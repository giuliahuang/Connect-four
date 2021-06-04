import { Server as IOServer, Socket } from "socket.io"
import logger from '../../logger'
import Message from "../../models/Message"
import MessageModel from "../../mongo/Message"
import UserModel from "../../mongo/User"
import { disconnectClient, getOnlineFriends, sendMessage } from "../friends/friendList"
import { invitePlayer, inviteResponse } from "../friends/gameInvites"
import { play } from "../matchmaking/matchmaking"

export function globalCallback(io: IOServer, socket: Socket) {
  logger.info(`A new socket connection has been established by ${socket.id}`)
  clientInit(socket)

  socket.on('play', () => {
    play(socket)
  })

  socket.on('invite', (username: string) => {
    invitePlayer(socket, username)
  })

  socket.on('inviteResponse', (hasAccepted: boolean, inviterUsername: string) => {
    inviteResponse(socket, hasAccepted, inviterUsername)
  })

  socket.on('dm', (message: string, destUsername: string) => {
    sendMessage(socket.request['user'], message, destUsername, socket)
  })

  socket.on('disconnect', reason => {
    disconnectClient(socket, reason, io)
  })
}

async function clientInit(socket: Socket) {
  socket.join(socket.request['user.username'])
  await notifyConnection(socket)
  socket.emit('onlinefriends', getOnlineFriends)
  const newMessages = await getNewMessages(socket)
  if (newMessages.length > 0) socket.emit('newMessages', newMessages)
}

async function notifyConnection(socket: Socket) {
  try {
    const friends = await getOnlineFriends(socket)
    friends.forEach(friend => {
      socket.to(friend).emit('friendConnected', socket.request['user.username'])
    })
  } catch (err) {
    logger.error(err)
  }
}

async function getNewMessages(socket: Socket): Promise<Message[]> {
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