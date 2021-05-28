import { Server as WebServer } from 'http'
import { Server as IOServer } from 'socket.io'
import jwtAuth from 'socketio-jwt-auth'
import { jwtCallback } from '../config/passport'
import { invitePlayer, inviteResponse } from '../game/friends/invite'
import { play } from '../game/matchmaking/matchmaking'
import logger from '../logger/'
import { RSA_KEYS } from './setup'

export async function setupIOServer(httpServer: WebServer): Promise<IOServer> {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(httpServer, { cors: { origin: "*" } })
  const secretKey = RSA_KEYS.PUB_KEY
  io.use(jwtAuth.authenticate({
    secret: secretKey,
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