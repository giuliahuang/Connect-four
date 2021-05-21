import { Server as IOServer } from 'socket.io'
import { Logger } from 'tslog'
import freePortFinder from '../../utils/freePortFinder'
import { MatchingPlayer } from '../matchmaking/MatchingPlayer'

const logger = new Logger()

export async function gameStart(p1: MatchingPlayer, p2: MatchingPlayer) {
  const port = await freePortFinder()
  let io

  if (port) {
    io = new IOServer(port, { cors: { origin: "*" } })
    io.on('connection', (socket) => {
      logger.info(`Started a new match between ${p1.player} and ${p2.player}`)
      p1.ws = socket
      p2.ws = socket

      socket.on('move', (message) => {
        //do something
      })
    })
  } else {
    logger.error("Couldn't find a free port")
    p1.ws.disconnect()
    p2.ws.disconnect()
  }
}
