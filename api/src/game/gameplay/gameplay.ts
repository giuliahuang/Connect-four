import fs from 'fs'
import { Server as IOServer } from 'socket.io'
import jwtAuth from 'socketio-jwt-auth'
import { jwtCallback } from '../../config/passport'
import logger from '../../logger/'
import freePortFinder from '../../utils/freePortFinder'
import { UnmatchedPlayer } from '../matchmaking/UnmatchedPlayer'
import { Match } from './Match'

export async function gameStart(p1: UnmatchedPlayer, p2: UnmatchedPlayer) {
  const port = await freePortFinder()

  if (port) {
    const io = new IOServer(port, { cors: { origin: "*" } })
    io.use(jwtAuth.authenticate({
      secret: fs.readFileSync('/workspace/api/src/config/id_rsa_pub.pem').toString(),
      algorithm: 'RS256'
    }, jwtCallback))

    p1.ws.emit('matched', port)
    p2.ws.emit('matched', port)

    const player1 = p1.player
    const player2 = p2.player

    io.on('connection', (socket) => {
      logger.info(`Started a new match between ${player1.id} and ${player2.id}`)
      const match = new Match(player1, player2)

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
