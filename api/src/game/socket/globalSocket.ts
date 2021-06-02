import { Server as IOServer, Socket } from "socket.io"
import logger from '../../logger'
import { getOnlineFriends } from "../friends/friendsList"
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
    const user = socket.request['user']
    if (user.friends.includes(destUsername))
      io.to(destUsername).emit('dm', message)
  })

  socket.on('disconnect', reason => {
    logger.info(`Clieant ${socket.id} disconnected because: ${reason}`)
    io.emit('disconnected', socket.request['user.username'])
  })
}