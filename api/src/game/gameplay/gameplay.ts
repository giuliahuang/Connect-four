import { promisify } from 'util'
import logger from '../../logger/'
import MatchResults from '../../models/MatchResults'
import User from '../../models/User'
import { endMatch } from '../../mongo/matchMethods'
import { createIOServer } from '../../setup/setupIOServer'
import { redisClient as redis } from '../../setup/setupRedis'
import freePortFinder from '../../utils/freePortFinder'
import UnmatchedPlayer from '../matchmaking/UnmatchedPlayer'
import Player from '../Player'
import { Match } from './Match'
import MoveResult from './MoveResult'

const hgetAsync = promisify(redis.hget).bind(redis)

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
    p1.ws.broadcast.emit('playing', p1.player.username, port)
    p2.ws.broadcast.emit('playing', p2.player.username, port)

    logger.info(`Started a new match between ${player1.username} and ${player2.username}`)
    io.on('connection', socket => {
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
        const user: User = socket.request['user']
        const moveResult = match.addDot(column, user._id)
        if (moveResult.accepted) {
          socket.broadcast.emit('dot', column)
          if (moveResult.matchResult) {
            io.emit('winner', `Player ${socket.request['user.username']} has won the match!`)
            p1.ws.broadcast.emit('stoppedPlaying', p1.player.username)
            p2.ws.broadcast.emit('stoppedPlaying', p2.player.username)
            io.disconnectSockets()
          }
        } else {
          io.emit('playerMoveRejection', column, user.username)
        }
      })

      socket.on('disconnect', async (reason) => {
        try {
          const username = await hgetAsync('users', socket.id)
          if (username === player1.username) {
            endMatch({ winner: player2.username, loser: username })
            io.emit('playerDisconnected', username, reason)
          } else if (username === player2.username) {
            endMatch({ winner: player1.username, loser: username })
            io.emit('playerDisconnected', username, reason)
          }
        } catch (err) {
          logger.prettyError(err)
        }
      })
    })
  } else {
    logger.error("Couldn't find a free port")
  }
}