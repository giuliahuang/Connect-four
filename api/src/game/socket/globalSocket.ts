import { Server as IOServer, Socket } from "socket.io"
import logger from '../../logger'
import { clientConnected, clientDisconnected, getNewMessages, sendMessage } from "../friends/friendList"
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
    clientDisconnected(socket, reason)
  })
}

async function clientInit(socket: Socket) {
  socket.join(socket.request['user.username'])
  await clientConnected(socket)
  const newMessages = await getNewMessages(socket)
  if (newMessages.length > 0) socket.emit('newMessages', newMessages)
}