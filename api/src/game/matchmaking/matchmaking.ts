import { Socket } from 'socket.io'
import logger from '../../logger/'
import User from '../../models/User'
import { gameStart } from '../gameplay/gameplay'
import Player from '../Player'
import UnmatchedPlayer from "./UnmatchedPlayer"

const MAX_TIME_IN_QUEUE = 20000
const POOL_POLL_INTERVAL = 1000
const mm_pool = new Map<string, UnmatchedPlayer>()

/**
 * Puts a user into matchmaking throught the Socket.io event
 * @param socket 
 */
export function play(socket: Socket) {
  const user: User = socket.request['user']
  const player: Player = {
    id: user._id,
    username: user.username,
    mmr: user.mmr
  }
  if (player) {
    logger.info(`Player: ${player.username} with ${player.mmr} mmr requested to play`)
    const unmatchedPlayer: UnmatchedPlayer = {
      player: player,
      timeJoined: Date.now(),
      ws: socket
    }

    if (!mm_pool.has(unmatchedPlayer.player.id))
      mm_pool.set(unmatchedPlayer.player.id, unmatchedPlayer)
    else
      socket.disconnect()
  }

  setInterval(() => matchmake(mm_pool), POOL_POLL_INTERVAL)
}

/**
 * Iterates through the pool until all players have been matched, then it returns
 * @param mm_pool Matchmaking map
 */
function matchmake(mm_pool: Map<string, UnmatchedPlayer>) {
  if (mm_pool.size < 1) return

  //enabled down level iteration, look for better alternative
  for (const [A, p1] of mm_pool) {
    for (const [B, p2] of mm_pool) {
      if (isMatch(p1, p2)) {
        const a = mm_pool.get(A)
        const b = mm_pool.get(B)
        if (a && b) {
          matchmakingSuccess({ ...a }, { ...b })
          mm_pool.delete(A)
          mm_pool.delete(B)
        }
      } else {
        const b = mm_pool.get(B)
        if (b && Date.now() - b.timeJoined > MAX_TIME_IN_QUEUE) {
          b.ws.send(`${b.player.id} didn't find a match`)
          b.ws.disconnect()
          mm_pool.delete(B)
        }
      }
    }
  }
}

/**
 * Checks whether the users provided are a good match. The condition gets
 * looser the longer player 1 has been in queue.
 * The maximum difference in MMR is 500
 * @param p1 player 1
 * @param p2 player 2
 * @returns true if the two player have been matched, false otherwise
 */
function isMatch(p1: UnmatchedPlayer, p2: UnmatchedPlayer): boolean {
  if (p1 !== p2 && Math.abs(p1.player.mmr - p2.player.mmr) < 500)
    if (Math.abs(p1.player.mmr - p2.player.mmr) < (10 * p1.timeJoined * 1000))
      return true
  return false
}

/**
 * Starts the game between player 1 and player 2
 * @param p1 player 1
 * @param p2 player 2
 */
function matchmakingSuccess(p1: UnmatchedPlayer, p2: UnmatchedPlayer) {
  console.log(`${p1.player.id} was matched with ${p2.player.id}`)
  p1.ws.send(`${p1.player.id} you were matched with ${p2.player.id}`)
  p2.ws.send(`${p2.player.id} you were matched with ${p1.player.id}`)
  gameStart(p1, p2)
}