import { Logger } from 'tslog'
import { Socket } from 'socket.io'
import { gameStart } from '../gameplay/gameplay'
import { UnmatchedPlayer } from "./UnmatchedPlayer"
import { MatchingPlayer } from "./MatchingPlayer"

const logger = new Logger()
const MAX_TIME_IN_QUEUE = 20000
const POOL_POLL_INTERVAL = 1000
const mm_pool = new Map<number, MatchingPlayer>()

// playerdata should be provided by database
export const play = (socket: Socket, playerData: any) => {
  logger.info(`Client ${playerData.id} with ${playerData.mmr} mmr has requested to play`)

  const player: UnmatchedPlayer = {
    id: playerData.id,
    timeJoined: Date.now(),
    mmr: playerData.mmr
  }

  if (!mm_pool.has(player.id))
    mm_pool.set(player.id, { player: player, ws: socket })
  else
    socket.disconnect()

  setInterval(() => match_make(mm_pool), POOL_POLL_INTERVAL)
}

function match_make(mm_pool: Map<number, MatchingPlayer>) {
  if (mm_pool.size < 1) return

  //enabled down level iteration, look for better alternative
  for (const [A, p1] of mm_pool) {
    for (const [B, p2] of mm_pool) {
      if (is_match(p1, p2)) {
        const a = mm_pool.get(A)
        const b = mm_pool.get(B)
        if (a && b) {
          do_battle({ ...a }, { ...b })
          mm_pool.delete(A)
          mm_pool.delete(B)
        }
      } else {
        const b = mm_pool.get(B)
        if (b && Date.now() - b.player.timeJoined > MAX_TIME_IN_QUEUE) {
          b.ws.send(`${b.player.id} didn't find a match`)
          b.ws.disconnect()
          mm_pool.delete(B)
        }
      }
    }
  }
}

function is_match(p1: MatchingPlayer, p2: MatchingPlayer): boolean {
  if (p1 !== p2 && Math.abs(p1.player.mmr - p2.player.mmr) < 500)
    if (Math.abs(p1.player.mmr - p2.player.mmr) < (10 * p1.player.timeJoined * 1000))
      return true

  return false
}

async function do_battle(p1: MatchingPlayer, p2: MatchingPlayer) {
  console.log(`${p1.player.id} was matched with ${p2.player.id}`)
  p1.ws.send(`${p1.player.id} you were matched with ${p2.player.id}`)
  p2.ws.send(`${p2.player.id} you were matched with ${p1.player.id}`)
  gameStart({ id: p1.player.id, mmr: p1.player.mmr, ws: p1.ws }, { id: p2.player.id, mmr: p2.player.mmr, ws: p2.ws })
}