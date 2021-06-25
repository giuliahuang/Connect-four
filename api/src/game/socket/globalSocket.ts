import { Server as IOServer, Socket } from "socket.io"
import logger from '../../logger'
import User from "../../models/User"
import { clientConnected, clientDisconnected, getNewMessages, sendMessage } from "../friends/friendList"
import { invitePlayer, inviteResponse } from "../friends/gameInvites"
import { cancelMatchmaking, play } from "../matchmaking/matchmaking"

/**
 * Handles socket connections to the global Socket.io server
 * @param io Socket.io server instance
 * @param socket Socket client of the user who just connected
 */
export function globalCallback(io: IOServer, socket: Socket): void {
  logger.info(`A new socket connection has been established by ${socket.id}`)
  clientInit(socket)

  socket.on('play', () => {
    play(socket, io)
  })

  socket.on('cancelPlay', () => {
    const user: User = socket.request['user']
    cancelMatchmaking(user._id)
  })

  socket.on('invite', (username: string) => {
    invitePlayer(socket, username)
  })

  socket.on('inviteResponse', (message) => {
    inviteResponse(socket, message.hasAccepted, message.inviterUsername)
  })

  socket.on('dm', (message: string, destUsername: string) => {
    sendMessage(socket.request['user'], message, destUsername, socket)
  })

  socket.on('disconnect', () => {
    clientDisconnected(socket)
  })
}

/**
 * Notifies all the user's friends of the connection event, then it retrieves
 * all new messages and sends them to the user
 * @param socket Socket client of the user who just connected
 */
async function clientInit(socket: Socket) {
  await socket.join(socket.request['user'].username)
  await clientConnected(socket)
  const newMessages = await getNewMessages(socket)
  if (newMessages.length > 0) socket.emit('newMessages', newMessages)
}