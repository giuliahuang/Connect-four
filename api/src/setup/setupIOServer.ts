import { Server as WebServer } from 'http'
import { Server as IOServer } from 'socket.io'
import logger from '../logger/'
import { play } from '../game/matchmaking/matchmaking'

export function setupIOServer(httpServer: WebServer): IOServer {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(httpServer, { cors: { origin: "*" } })

  io.on('connection', (socket) => {
    logger.info(`A new socket connection has been established by ${socket.id}`)

    socket.on('play', (jwt) => {
      play(socket, jwt)
    })

    socket.on('dm', () => { })
  })

  return io
}