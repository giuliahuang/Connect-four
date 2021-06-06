import { ChildProcess, fork } from 'child_process'
import path from 'path'
import { Server, Socket } from 'socket.io'
import logger from '../../logger/'
import User from '../../models/User'
import { getUserById } from '../../mongo/userMethods'
import { gameStart } from '../gameplay/gameplay'
import Player from '../Player'
import UnmatchedPlayer from "./UnmatchedPlayer"

let childProcess = fork(path.join(__dirname, 'child.js'))
let io: Server

/**
 * Puts a user into matchmaking throught the Socket.io event
 * @param socket 
 */
export function play(socket: Socket, server: Server) {
  const user: User = socket.request['user']
  const player: Player = {
    id: user._id,
    username: user.username,
    mmr: user.mmr
  }
  if (player) {
    logger.info(`Player: ${player.username} with ${player.mmr} mmr requested to play`)
    if (!io) io = server

    childProcess.send({ id: player.id, mmr: player.mmr, ws: socket.id })
  }
}

childProcess.on('message', message => {
  const res: any = message.valueOf()
  matchmakingSuccess(res.player1, res.player2)
})

/**
 * Starts the game between player 1 and player 2
 * @param p1 player 1
 * @param p2 player 2
 */
async function matchmakingSuccess(p1: any, p2: any) {
  const user1 = await getUserById(p1.id)
  const user2 = await getUserById(p2.id)
  const socket1 = io.sockets.sockets.get(p1.ws)
  const socket2 = io.sockets.sockets.get(p2.ws)
  const player1: UnmatchedPlayer = {
    player: {
      id: user1!._id,
      username: user1!.username,
      mmr: user1!.mmr
    },
    timeJoined: p1.timeJoined,
    ws: socket1!
  }
  const player2: UnmatchedPlayer = {
    player: {
      id: user2!._id,
      username: user2!.username,
      mmr: user2!.mmr
    },
    timeJoined: p2.timeJoined,
    ws: socket2!
  }
  logger.info(`Player: ${player1.player.username} was matched with Player: ${player1.player.username}`)
  player1.ws.send(`You've been matched with ${player2.player.id}`)
  player2.ws.send(`You've been matched with ${player1.player.id}`)
  gameStart(player1, player2)
}