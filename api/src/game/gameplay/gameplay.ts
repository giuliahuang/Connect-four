import logger from '../../logger/'
import { createIOServer } from '../../setup/setupIOServer'
import freePortFinder from '../../utils/freePortFinder'
import UnmatchedPlayer from '../matchmaking/UnmatchedPlayer'
import Player from '../Player'
import { Match } from './Match'

/**
 * Creates a new Socket.io server and starts the game
 * @param p1 player 1
 * @param p2 player 2
 */
export async function gameStart(p1: UnmatchedPlayer, p2: UnmatchedPlayer) {
  const port = await freePortFinder()

  if (port) {
    const io = createIOServer(port)

    p1.ws.emit('matched', port)
    p2.ws.emit('matched', port)

    let player1: Player, player2: Player
    if (Math.random()) {
      player1 = p1.player
      player2 = p2.player
    } else {
      player1 = p2.player
      player2 = p1.player
    }

    const match = new Match(player1, player2)
    p1.ws.broadcast.emit('playing', port)
    p2.ws.broadcast.emit('playing', port)

    logger.info(`Started a new match between ${player1.id} and ${player2.id}`)
    io.on('connection', (socket) => {
      if (socket.request['user._id'] == player1.id || socket.request['user._id'] == player2.id)
        socket.join('playersChat')
      else
        socket.join('observersChat')

      socket.on('message', message => {
        if (socket.request['user._id'] == player1.id || socket.request['user._id'] == player2.id)
          socket.to('playersChat').to('observersChat').emit('message', message)
        else
          socket.to('observersChat').emit('message', message)
      })

      socket.on('dot', (column: number) => {
        const playerId: string = socket.request['user._id']
        const moveResult = match.addDot(column, playerId)
        if (moveResult && moveResult.accepted) {
          socket.broadcast.emit('dot', column)
          if (moveResult.matchResult) {
            io.emit(`Player ${socket.request['user.username']} has won the match!`)
            p1.ws.broadcast.emit('stoppedPlaying')
            p2.ws.broadcast.emit('stoppedPlaying')
            io.disconnectSockets()
          }
        }
      })
    })
  } else {
    logger.error("Couldn't find a free port")
    p1.ws.disconnect()
    p2.ws.disconnect()
  }
}
