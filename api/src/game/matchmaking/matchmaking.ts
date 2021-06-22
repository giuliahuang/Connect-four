import { fork } from 'child_process'
import path from 'path'
import { Server, Socket } from 'socket.io'
import logger from '../../logger/'
import User from '../../models/User'
import { getUserById } from '../../mongo/userMethods'
import { gameStart } from '../gameplay/gameplay'
import Player from '../Player'
import PlayerWithWS from "./UnmatchedPlayer"

interface MatchmakingResponse {
  player1: PlayerWithWS,
  player2: PlayerWithWS
}

const childProcess = fork(path.join(__dirname, 'child.js'))
childProcess.on('message', message => {
  const res: MatchmakingResponse = message.valueOf() as MatchmakingResponse
  matchmakingSuccess(res.player1, res.player2)
})
let io: Server

/**
 * Puts a user into matchmaking throught the Socket.io event
 * @param socket 
 */
export function play(socket: Socket, server: Server): void {
  const user: User = socket.request['user']
  const player: Player = {
    id: user._id,
    username: user.username,
    mmr: user.mmr
  }

  logger.info(`Player: ${player.username} with ${player.mmr} mmr requested to play`)
  if (!io) io = server

  childProcess.send({ id: player.id, mmr: player.mmr, ws: socket.id })

}

/**
 * Starts the game between player 1 and player 2
 * @param p1 player 1
 * @param p2 player 2
 */
async function matchmakingSuccess(p1: PlayerWithWS, p2: PlayerWithWS) {
  const user1 = await getUserById(p1.player.id)
  const user2 = await getUserById(p2.player.id)
  const socket1 = io.sockets.sockets.get(p1.ws as string)
  const socket2 = io.sockets.sockets.get(p2.ws as string)
  if (user1 && user2 && socket1 && socket2) {
    const player1: PlayerWithWS = {
      player: {
        id: user1._id,
        username: user1.username,
        mmr: user1.mmr
      },
      timeJoined: p1.timeJoined,
      ws: socket1
    }
    const player2: PlayerWithWS = {
      player: {
        id: user2._id,
        username: user2.username,
        mmr: user2.mmr
      },
      timeJoined: p2.timeJoined,
      ws: socket2
    }
    logger.info(`Player: ${player1.player.username} was matched with Player: ${player1.player.username}`)
      ; (player1.ws as Socket).send(`You've been matched with ${player2.player.id}`)
      ; (player2.ws as Socket).send(`You've been matched with ${player1.player.id}`)
    gameStart(player1, player2)
  } else {
    logger.prettyError(new Error('Matchmaking failure'))
  }
}

export function cancelMatchmaking(userid: string): void {
  childProcess.send({ cancel: userid })
}