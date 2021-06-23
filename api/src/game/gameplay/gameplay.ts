import { Socket } from 'socket.io'
import logger from '../../logger/'
import { createIOServer } from '../../setup/setupIOServer'
import freePortFinder from '../../utils/freePortFinder'
import PlayerWithWS from '../matchmaking/UnmatchedPlayer'
import Player from '../Player'
import { matchCallback } from '../socket/matchSocket'
import { Match } from './Match'

/**
 * Creates a new Socket.io server and starts the game
 * @param p1 player 1
 * @param p2 player 2
 */
export async function gameStart(p1: PlayerWithWS, p2: PlayerWithWS): Promise<void> {
  const port = await freePortFinder()

  if (port) {
    const io = createIOServer(port)

      ; (p1.ws as Socket).emit('matched', port)
      ; (p2.ws as Socket).emit('matched', port)

    let player1: Player, player2: Player
    if (Math.random()) {
      player1 = p1.player
      player2 = p2.player
    } else {
      player1 = p2.player
      player2 = p1.player
    }

    const match = new Match(player1, player2)
      ; (p1.ws as Socket).broadcast.emit('playing', p1.player.username, port)
      ; (p2.ws as Socket).broadcast.emit('playing', p2.player.username, port)

    logger.info(`Started a new match between ${player1.username} and ${player2.username}`)
    io.on('connection', socket => matchCallback(match, p1, p2, io, socket, port))
  } else {
    logger.error("Couldn't find a free port")
      ; (p1.ws as Socket).emit('notMatched', 'An error occured while the match was starting')
      ; (p2.ws as Socket).emit('notMatched', 'An error occured while the match was starting')
  }
}