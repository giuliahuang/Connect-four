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
    socket.join(socket.request['user.username'])
    socket.broadcast.emit('connected', socket)

    socket.on('play', play)

    socket.on('invite', invitePlayer)

    socket.on('inviteResponse', inviteResponse)

    socket.on('dm', (message: string, destUsername: string) => {
      io.to(destUsername).emit('dm', message)
    })

    socket.on('disconnect', () => {
      io.emit('disconnected', socket)
    })
  })
  return io
}