import { Server as WebServer } from 'http'
import { Server as IOServer } from 'socket.io'
import { play } from '../game/matchmaking/matchmaking'
import logger from '../logger/'
import { getUserById } from '../mongo/user'
import extractTokenPayload from '../utils/extractTokenPayload'
import jwtAuth from 'socketio-jwt-auth'
import fs from 'fs'
import { jwtCallback } from '../config/passport'

export function setupIOServer(httpServer: WebServer): IOServer {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(httpServer, { cors: { origin: "*" } })
  io.use(jwtAuth.authenticate({
    secret: fs.readFileSync('/workspace/api/src/config/id_rsa_pub.pem').toString(),
    algorithm: 'RS256'
  }, jwtCallback))

  io.on('connection', socket => {
    logger.info(`A new socket connection has been established by ${socket.id}`)

    socket.on('play', () => {
      play(socket)
    })

    socket.on('invite', message => {
      const payload = extractTokenPayload(message.jwt)
      if (payload) {
        getUserById(payload.sub).then(user => {
          if (user)
            socket.to(message.invitee).emit('invite', user.username)
        })
      }
    })

    socket.on('dm', ({ message, dest }) => {
      io.to(dest).emit('dm', message)
    })
  })
  return io
}