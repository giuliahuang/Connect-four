import UnmatchedPlayer from "./UnmatchedPlayer"

const POOL_POLL_INTERVAL = 1000
const mm_pool = new Map<string, UnmatchedPlayer>()

setInterval(() => matchmake(mm_pool), POOL_POLL_INTERVAL)

// Ideally this should be implemented through a microservice instead of a child process
process.on('message', (message) => {
  if (message.id) {
    const unmatchedPlayer: UnmatchedPlayer = {
      player: {
        id: message.id,
        mmr: message.mmr,
        username: ''
      },
      ws: message.ws,
      timeJoined: Date.now()
    }
    if (!mm_pool.has(unmatchedPlayer.player.id)) {
      mm_pool.set(unmatchedPlayer.player.id, unmatchedPlayer)
      console.log(`${unmatchedPlayer.player.id} added to pool`)
    }
  }

  if (message.cancel)
    mm_pool.delete(message.cancel)
})

/**
 * Iterates through the pool until all players have been matched, then it returns
 * @param mm_pool Matchmaking map
 */
function matchmake(mm_pool: Map<string, UnmatchedPlayer>) {
  if (mm_pool.size < 1) return

  mm_pool.forEach((p1: UnmatchedPlayer, player1id: string) => {
    mm_pool.forEach((p2: UnmatchedPlayer, player2id: string) => {
      if (isMatch(p1, p2)) {
        mm_pool.delete(player1id)
        mm_pool.delete(player2id)
        if (process.send) process.send({ player1: p1, player2: p2 })
      }
    })
  })
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