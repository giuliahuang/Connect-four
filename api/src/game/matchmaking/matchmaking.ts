import { MatchingPlayer } from "./MatchingPlayer"
import { Logger } from 'tslog'
import { UnmatchedPlayer } from "./UnmatchedPlayer"
import { Socket } from 'socket.io'

const logger = new Logger()
const MAX_TIME_IN_QUEUE = 20000
const POOL_POLL_INTERVAL = 1000
const mm_pool = new Map<string, MatchingPlayer>()

// playerdata should be provided by database
export const play = (socket: Socket, playerData: any) => {
  logger.info(`Client ${playerData.id} has requested to play`)

  const player: UnmatchedPlayer = {
    id: playerData.id,
    time_joined: Date.now(),
    mmr: playerData.mmr
  }

  if (!mm_pool.has(player.id))
    mm_pool.set(player.id, { ws: socket, player: player })
  else
    socket.disconnect()

  setInterval(() => match_make(mm_pool), POOL_POLL_INTERVAL)
}

function match_make(mm_pool: Map<string, MatchingPlayer>) {
  if (mm_pool.size < 1) return
  logger.info('test')

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
        if (b && Date.now() - b.player.time_joined > MAX_TIME_IN_QUEUE) {
          b.ws.send(`${b.player.id} didn't find a match`)
          b.ws.disconnect()
          mm_pool.delete(B)
        }
      }
    }
  }
}

function is_match(p1: MatchingPlayer, p2: MatchingPlayer): boolean {
  // modify constant value 100
  if (p1 !== p2 && Math.abs(p1.player.mmr - p2.player.mmr) < 100) return true
  return false
}

async function do_battle(p1: MatchingPlayer, p2: MatchingPlayer) {
  console.log(`${p1.player.id} was matched with ${p2.player.id}`)
  p1.ws.send(`${p1.player.id} you were matched with ${p2.player.id}`)
  p2.ws.send(`${p2.player.id} you were matched with ${p1.player.id}`)
  p1.ws.disconnect()
  p2.ws.disconnect()
}