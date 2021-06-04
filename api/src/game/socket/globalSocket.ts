import { Server as IOServer, Socket } from "socket.io"
import logger from '../../logger'
import { disconnectClient, getOnlineFriends, sendMessage } from "../friends/friendsList"
import { invitePlayer, inviteResponse } from "../friends/gameInvites"
import { play } from "../matchmaking/matchmaking"

export function globalCallback(io: IOServer, socket: Socket) {
  logger.info(`A new socket connection has been established by ${socket.id}`)
  socket.join(socket.request['user.username'])
  socket.broadcast.emit('connected', socket)
  socket.emit('onlinefriends', getOnlineFriends)

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
    sendMessage(socket.request['user'], message, destUsername, io)
  })

  socket.on('disconnect', reason => {
    disconnectClient(socket, reason, io)
  })
}