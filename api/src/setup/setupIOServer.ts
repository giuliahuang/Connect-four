import { Server as WebServer } from 'http'
import { exit } from 'process'
import { Server as IOServer } from 'socket.io'
import jwtAuth from 'socketio-jwt-auth'
import { jwtCallback } from '../config/passport'
import { invitePlayer, inviteResponse } from '../game/friends/gameInvites'
import { play } from '../game/matchmaking/matchmaking'
import logger from '../logger/'

/**
 * Global Socket.io server definition, used for matchmaking, player chats and invites
 * @param httpServer required for binding the global Socket.io server
 */
export async function setupIOServer(httpServer: WebServer) {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(httpServer, { cors: { origin: "*" } })

  // Socket.io middleware that provides authentication through the JWT token set into
  // the websocket request's auth headers
  if (process.env.JWT_SECRET) {
    io.use(jwtAuth.authenticate({
      secret: process.env.JWT_SECRET,
      algorithm: 'HS256'
    }, jwtCallback))
  } else {
    logger.info('JWT Secret not found in .env file')
    exit(1)
  }

  io.on('connection', socket => {
    logger.info(`A new socket connection has been established by ${socket.id}`)
    socket.join(socket.request['user.username'])
    socket.broadcast.emit('connected', socket)

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
      io.to(destUsername).emit('dm', message)
    })

    socket.on('disconnect', () => {
      io.emit('disconnected', socket.request['user.username'])
    })
  })
  return io
}