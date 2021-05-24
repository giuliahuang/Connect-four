import { Server as WebServer } from 'http'
import { Server as IOServer } from 'socket.io'
import { Logger } from 'tslog'
import { play } from '../game/matchmaking/matchmaking'

const logger = new Logger()

export function setupIOServer(httpServer: WebServer): IOServer {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(httpServer, { cors: { origin: "*" } })

  io.on('connection', (socket) => {
    logger.info(`A new socket connection has been established by ${socket.id}`)

    socket.on('play', (message) => {
      play(socket, message)
    })

    socket.on('dm', () => { })
  })

  return io
}