import { Server as IOServer, Socket } from 'socket.io'
import { promisify } from 'util'
import logger from '../../logger'
import User from '../../models/User'
import { endMatch } from '../../mongo/matchMethods'
import { redisClient as redis } from '../../setup/setupRedis'
import { Match } from '../gameplay/Match'
import UnmatchedPlayer from '../matchmaking/UnmatchedPlayer'
import Player from '../Player'

const hgetAsync = promisify(redis.hget).bind(redis)

export function matchCallback(match: Match, p1: UnmatchedPlayer, p2: UnmatchedPlayer, io: IOServer, socket: Socket): void {
  const player1 = match.player1
  const player2 = match.player2

  joinChat(socket, player1, player2)

  socket.on('message', (message: string) => { chat(message, socket, player1, player2) })

  socket.on('dot', (column: number) => { play(column, socket, match, p1, p2, io) })

  socket.on('disconnect', (reason: string) => {
    disconnect(reason, socket, player1, player2, io)
  })
}

function joinChat(socket: Socket, player1: Player, player2: Player) {
  if (socket.request['user']._id !== player1.id || socket.request['user']._id !== player2.id)
    socket.join('playersChat')
  else
    socket.join('observersChat')
}

function chat(message: string, socket: Socket, player1: Player, player2: Player) {
  if (socket.request['user']._id == player1.id || socket.request['user']._id == player2.id)
    socket.to('playersChat').to('observersChat').emit('message', { message, player: socket.request['user.username'] })
  else
    socket.to('observersChat').emit('message', { message, player: socket.request['user.username'] })
}

function play(column: number, socket: Socket, match: Match, p1: UnmatchedPlayer, p2: UnmatchedPlayer, io: IOServer) {
  const user: User = socket.request['user']
  const moveResult = match.addDot(column, user._id)
  if (moveResult.accepted) {
    socket.broadcast.emit('dot', column)
    if (moveResult.matchResult) {
      io.emit('winner', `Player ${socket.request['user.username']} has won the match!`)
        ; (p1.ws as Socket).broadcast.emit('stoppedPlaying', p1.player.username)
        ; (p2.ws as Socket).broadcast.emit('stoppedPlaying', p2.player.username)
      closeServer(io)
    }
  } else {
    io.emit('playerMoveRejection', column, user.username)
  }
}

async function disconnect(reason: string, socket: Socket, player1: Player, player2: Player, io: IOServer) {
  try {
    const username = await hgetAsync('users', socket.id)
    if (username === player1.username) {
      endMatch({ winner: player2.username, loser: username })
      io.emit('playerDisconnected', username, reason)
      closeServer(io)
    } else if (username === player2.username) {
      endMatch({ winner: player1.username, loser: username })
      io.emit('playerDisconnected', username, reason)
      closeServer(io)
    }
  } catch (err) {
    logger.prettyError(err)
  }
}

function closeServer(io: IOServer) {
  io.disconnectSockets()
  io.close()
}