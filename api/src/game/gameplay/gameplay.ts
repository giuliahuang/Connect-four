import { Server as IOServer } from 'socket.io'
import logger from '../../logger/'
import { decreaseMmr, increaseMmr } from '../../mongo/user'
import freePortFinder from '../../utils/freePortFinder'
import { Player } from '../Player'
import { Match } from './Match'

const MMR_INCR = 30
const MMR_DECR = 25

export async function gameStart(p1: Player, p2: Player) {
  const port = await freePortFinder()

  if (port) {
    const match = new Match(p1, p2)
    const io = new IOServer(port, { cors: { origin: "*" } })

    p1.ws.emit('matched', port)
    p2.ws.emit('matched', port)

    io.on('connection', (socket) => {
      logger.info(`Started a new match between ${p1.id} and ${p2.id}`)
      p1.ws = socket
      p2.ws = socket

      socket.on('dot', (message) => {
        if (match.addDot(message.col, message.player)) {
          socket.broadcast.emit(`Player ${message.player} has won the match!`)

          //todo
          increaseMmr('winning player', MMR_INCR)
          decreaseMmr('losing player', MMR_DECR)
          io.disconnectSockets()
        }
      })
    })
  } else {
    logger.error("Couldn't find a free port")
    p1.ws.disconnect()
    p2.ws.disconnect()
  }
}
