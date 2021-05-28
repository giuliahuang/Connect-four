import fs from 'fs'
import { Server as WebServer } from 'http'
import { Server as IOServer } from 'socket.io'
import jwtAuth from 'socketio-jwt-auth'
import { jwtCallback } from '../config/passport'
import { invitePlayer, inviteResponse } from '../game/friends/invite'
import { play } from '../game/matchmaking/matchmaking'
import logger from '../logger/'

export function setupIOServer(httpServer: WebServer): IOServer {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(httpServer, { cors: { origin: "*" } })
  io.use(jwtAuth.authenticate({
    secret: fs.readFileSync('/workspace/api/src/config/id_rsa_pub.pem').toString(),
    algorithm: 'RS256'
  }, jwtCallback))

  io.on('connection', socket => {
    logger.info(`A new socket connection has been established by ${socket.id}`)
    socket.join(socket.request['user.email'])
    socket.broadcast.emit('connected', socket)

    socket.on('play', () => {
      play(socket)
    })

    socket.on('invite', invitedUid => {
      invitePlayer(socket, invitedUid)
    })

    socket.on('inviteResponse', (hasAccepted: boolean, inviterEmail: string) => {
      inviteResponse(socket, hasAccepted, inviterEmail)
    })

    socket.on('dm', ({ message, destEmail }) => {
      io.to(destEmail).emit('dm', message)
    })

    socket.on('disconnect', () => {
      io.emit('disconnected', socket)
    })
  })
  return io
}